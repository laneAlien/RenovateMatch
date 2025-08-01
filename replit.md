# Overview

BuildConnect is a home renovation marketplace application that connects homeowners with verified contractors. The platform allows homeowners to post renovation projects and receive competitive bids from contractors, while providing contractors with a dashboard to find and bid on projects. The application features user authentication, project management, bidding systems, messaging functionality, and contractor profiles.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with file-based page organization
- **UI Components**: Radix UI primitives with Tailwind CSS styling through shadcn/ui component library
- **State Management**: React Context for authentication state and TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with CSS variables for theming and design tokens

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with route-based organization
- **Middleware**: Custom request logging, JSON parsing, and error handling
- **Development**: Hot module replacement with Vite integration for full-stack development

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared module with Zod validation
- **Storage Interface**: Abstract storage interface with in-memory implementation for development
- **Migrations**: Drizzle Kit for database schema migrations

## Authentication & Authorization
- **Authentication**: Simple email/password authentication with user type differentiation
- **User Types**: Homeowner and Contractor user roles with different access patterns
- **Session Management**: Context-based authentication state management
- **Security**: Basic credential validation without advanced session management

## Key Data Models
- **Users**: Core user accounts with role-based access (homeowner/contractor)
- **Contractor Profiles**: Extended profiles for contractors with business information, specialties, and portfolios
- **Projects**: Homeowner-posted renovation projects with detailed requirements
- **Bids**: Contractor proposals for projects with pricing and timeline information
- **Messages**: Project-based messaging system for communication between users

## Application Features
- **Project Posting**: Homeowners can create detailed renovation project listings
- **Contractor Discovery**: Browse and filter contractors by specialty and location
- **Bidding System**: Contractors can submit competitive bids on projects
- **Messaging**: Built-in communication system for project discussions
- **Dashboard**: Role-specific dashboards for managing projects and bids
- **Profile Management**: Contractor profile creation and management

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and context
- **Express.js**: Backend web application framework
- **TypeScript**: Type safety across the entire application stack

## Database & ORM
- **Drizzle ORM**: Type-safe database operations and query building
- **@neondatabase/serverless**: PostgreSQL database connection
- **Drizzle Kit**: Database schema management and migrations

## UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind

## Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

## Utility Libraries
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **Lucide React**: Icon library for consistent iconography