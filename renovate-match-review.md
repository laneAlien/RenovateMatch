# Ревью репозитория `laneAlien/RenovateMatch`

> Fullstack TypeScript marketplace: площадка для поиска подрядчиков по ремонту. Frontend: React 18 + Wouter + Tailwind + shadcn/ui. Backend: Express.js + Drizzle ORM. Аутентификация: email/password через React Context. Деплоится на Replit.

---

## 1. Сводка приоритетов

| Приоритет | Что | Где |
|---|---|---|
| 🔴 High | `MemStorage` вместо PostgreSQL — все проекты, заявки и сообщения теряются при перезапуске | `server/storage.ts` |
| 🔴 High | Пароли хранятся в plain text через React Context — нет хеширования | `server/routes.ts` |
| 🔴 High | Аутентификация через React Context без сервера — нет серверной верификации сессии | клиент |
| 🔴 High | Отсутствует README | корень проекта |
| 🟠 Med | Нет CSRF-защиты при session/cookie аутентификации | `server/index.ts` |
| 🟠 Med | Drizzle-схема определена, но миграции не применены | `shared/schema.ts` |
| 🟠 Med | Нет валидации входных данных на backend (Zod используется только для типов) | `server/routes.ts` |
| 🟠 Med | Поиск подрядчиков по `specialties` — фильтрация в памяти, не в SQL | `server/storage.ts` |
| 🟡 Low | `getUserByEmail` реализован через линейный перебор `Map` — O(n) | `server/storage.ts` |
| 🟡 Low | `attached_assets/` в репозитории | `attached_assets/` |
| 🟡 Low | Нет `.env.example` | корень проекта |
| 🟡 Low | Нет тестов для бизнес-логики (ставки, сообщения, фильтрация) | проект |

---

## 2. Критические проблемы

### 2.1 Пароли без хеширования

**Файл:** `server/routes.ts` (предположительно)

Хранение пароля в открытом виде — критическая уязвимость. Необходимо использовать `bcrypt`:

```typescript
import bcrypt from "bcrypt";

// При регистрации:
const hashedPassword = await bcrypt.hash(password, 12);

// При входе:
const valid = await bcrypt.compare(password, user.passwordHash);
```

### 2.2 Аутентификация только на клиенте

React Context для auth означает, что состояние аутентификации хранится только в браузере. При прямых API-запросах нет серверной проверки. Необходима серверная сессия:

```typescript
// server/index.ts
import session from "express-session";
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true }
}));
```

### 2.3 In-memory хранилище

Аналогично HauntedRealm2 и MineControl — `MemStorage` теряет все данные при перезапуске. Drizzle-схема уже готова в `shared/schema.ts`. Необходимо подключить PostgreSQL.

### 2.4 Отсутствует валидация на backend

Данные из форм должны валидироваться на сервере. Использовать уже подключённый Zod:

```typescript
import { insertProjectSchema } from "@shared/schema";

router.post("/api/projects", async (req, res) => {
  const result = insertProjectSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  // ...
});
```

---

## 3. Серьёзные замечания

### 3.1 Фильтрация подрядчиков в памяти

```typescript
async getContractorProfiles(filters?: { specialties?: string[]; location?: string }) {
  const all = Array.from(this.contractorProfiles.values());
  return all.filter(p => ...); // O(n) линейный перебор
}
```

При переходе на PostgreSQL эта фильтрация должна быть в SQL WHERE clause для производительности.

### 3.2 `getUserByEmail` — O(n) lookup

```typescript
async getUserByEmail(email: string) {
  for (const user of this.users.values()) {
    if (user.email === email) return user;
  }
}
```

В реальной БД нужен уникальный индекс на `email`. В схеме Drizzle добавить `.unique()` к полю email.

### 3.3 Нет защиты от BOLA (Broken Object Level Authorization)

Любой аутентифицированный пользователь может изменить заявку другого подрядчика или отредактировать чужой проект. Необходимы проверки владельца:

```typescript
if (project.ownerId !== req.session.userId) {
  return res.status(403).json({ message: "Forbidden" });
}
```

---

## 4. Качество кода

### 4.1 Нет `.env.example`

```
DATABASE_URL=postgresql://...
SESSION_SECRET=...
NODE_ENV=development
```

### 4.2 `attached_assets/` в репозитории

Добавить в `.gitignore`:
```
attached_assets/
```

---

## 5. Положительные стороны

- `IStorage` интерфейс — правильное разделение слоёв
- Drizzle-схема с Zod-валидацией через `drizzle-zod` — хорошая практика
- React Hook Form с Zod на клиенте — надёжная валидация форм
- TanStack Query для управления сервером состоянием
- Wouter вместо React Router — более лёгкое решение для простой маршрутизации

---

## 6. Чек-лист правок

- [ ] Добавить хеширование паролей через `bcrypt`
- [ ] Перенести аутентификацию на сервер (express-session)
- [ ] Подключить PostgreSQL через Drizzle вместо MemStorage
- [ ] Добавить валидацию тела запросов на backend через Zod
- [ ] Добавить проверки владельца объектов (BOLA protection)
- [ ] Создать `.env.example`
- [ ] Написать `README.md`
- [ ] Добавить CSRF-защиту
- [ ] Добавить `attached_assets/` в `.gitignore`
- [ ] Добавить `email.unique()` в Drizzle-схему
- [ ] Добавить скрипты `db:push`, `db:generate` в `package.json`
