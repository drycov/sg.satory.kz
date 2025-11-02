# AI Assistant Instructions for sg.satory.kz

This document guides AI coding assistants to be productive in this codebase.

## Project Overview

This is a VPN User Management System built with:
- Backend: Express.js + TypeScript + Sequelize + PostgreSQL
- Frontend: React + Vite + TypeScript
- Infrastructure: MikroTik Router + FreeRADIUS

The system manages VPN user accounts, IP pools, and router configurations.

## Key Architecture Components

### Backend (`/backend`)
- REST API server with TypeScript and Express
- Models (`/src/models/`): Sequelize models for User, IP Pool, Router, etc.
- Services (`/src/services/`): Business logic layer handling core operations
- Controllers (`/src/controllers/`): Route handlers for REST endpoints
- Routes (`/src/routes/`): API endpoint definitions
- Config (`/src/config/`): Database and system configuration

### Frontend (`/frontend`)
- Modern React app using Vite with React Compiler enabled
- TypeScript for type safety
- ESLint with type-aware rules

## Development Workflows

### Backend Development
```bash
cd backend
npm install
npm run dev     # Start development server
npm run build   # Compile TypeScript
npm run start   # Run production build
npm run lint    # Run ESLint
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev     # Start Vite dev server with HMR
npm run build   # Build for production
npm run preview # Preview production build
```

## Project Conventions

1. **TypeScript Patterns**
   - Strong typing everywhere - avoid `any`
   - Models define interfaces for database entities
   - Services contain business logic
   - Controllers are thin request handlers
   - TypeScript Path Aliases:
     ```json
     {
       "@models/*": ["src/models/*"],
       "@services/*": ["src/services/*"],
       "@controllers/*": ["src/controllers/*"],
       "@config/*": ["src/config/*"],
       "@types/*": ["src/types/*"]
     }
     ```
   - Use imports like: `import { UserModel } from '@models/user.model'`

2. **API Structure**
   - RESTful endpoints in `backend/src/routes/`
   - Controllers handle request/response cycle
   - Services contain core business logic
   - All operations are logged via audit-log service

3. **Database Patterns**
   - Use Sequelize migrations for schema changes
   - Models define relationships and constraints
   - IP Pool management via dedicated service

## Critical Integration Points

1. **MikroTik Router Integration**
   - Router configuration managed via `RouterService`
   - Endpoints defined in `router_endpoints.model.ts`
   - Changes tracked in audit log

2. **FreeRADIUS Integration**
   - User authentication handled via RADIUS
   - IP assignments managed through IP pool service

3. **Frontend-Backend Communication**
   - REST API with typed requests/responses
   - CORS enabled for development
   - Authentication via tokens

## Common Tasks

- User Management: See `users.service.ts` and `UserModel`
- IP Assignment: `ip-pool.service.ts` handles IP allocation
- Audit Logging: Use `audit-log.service.ts` for tracking changes
- Router Config: `router.service.ts` manages MikroTik settings