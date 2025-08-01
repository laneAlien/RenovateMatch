import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull(), // 'homeowner' or 'contractor'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contractorProfiles = pgTable("contractor_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  description: text("description"),
  specialties: text("specialties").array(),
  yearsExperience: text("years_experience"),
  serviceRadius: text("service_radius"),
  profileImage: text("profile_image"),
  portfolioImages: text("portfolio_images").array(),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  projectType: text("project_type").notNull(),
  budgetRange: text("budget_range").notNull(),
  timeline: text("timeline").notNull(),
  propertyType: text("property_type").notNull(),
  location: text("location"),
  images: text("images").array(),
  status: text("status").notNull().default("posted"), // 'posted', 'bidding', 'awarded', 'completed'
  awardedContractorId: varchar("awarded_contractor_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  contractorId: varchar("contractor_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  timeline: text("timeline").notNull(),
  proposal: text("proposal").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContractorProfileSchema = createInsertSchema(contractorProfiles).omit({
  id: true,
  userId: true,
  rating: true,
  reviewCount: true,
  isVerified: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  ownerId: true,
  status: true,
  awardedContractorId: true,
  createdAt: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  contractorId: true,
  status: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  senderId: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ContractorProfile = typeof contractorProfiles.$inferSelect;
export type InsertContractorProfile = z.infer<typeof insertContractorProfileSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
