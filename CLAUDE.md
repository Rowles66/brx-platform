# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
cd brx-app  # Main application directory

# Development server
npm run dev                 # Start Next.js dev server (port 3000)
npm run dev:debug          # Start with Node inspector

# Build and production
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
```

### Database (Prisma)
```bash
npm run db:push            # Push schema changes to database
npm run db:migrate         # Run database migrations
npm run db:generate        # Generate Prisma client
npm run db:studio          # Open Prisma Studio GUI
```

### Testing
```bash
npm run test:e2e           # Run all Playwright tests
npm run test:e2e:ui        # Run Playwright tests with UI
npm run test:e2e:headed    # Run tests in headed mode
npm run test:e2e:debug     # Debug Playwright tests
npm run test:e2e:report    # Show test report
npm run audit:visual       # Run visual regression tests
```

### Utilities
```bash
npm run storybook          # Start Storybook dev server (port 6006)
npm run schema:generate    # Generate unified schema
npm run monitor:deployment # Monitor deployment status
```

## Architecture Overview

This is a monorepo with the main application in `brx-app/`. The project is a fitness platform migration from Exercise.com to a modern, AI-powered solution.

### Main Application (`brx-app/`)
- **Framework**: Next.js 15 with App Router
- **API**: tRPC for type-safe APIs
- **Database**: Prisma ORM with PostgreSQL
- **Auth**: Currently mock auth (NextAuth planned)
- **Styling**: Tailwind CSS
- **Testing**: Playwright for E2E, Vitest for unit tests

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components organized by feature
- `src/server/api/` - tRPC server configuration and routers
- `src/utils/` - Utility functions and validation schemas
- `prisma/` - Database schema and migrations
- `tests/` - E2E and integration tests

### Component Organization
Components are organized by feature:
- `components/dashboard/` - Dashboard-specific components
- `components/exercises/` - Exercise library components
- `components/programs/` - Program management components
- `components/workouts/` - Workout-related components
- `components/layout/` - Navigation and layout components
- `components/ui/` - Generic UI components

### API Structure (tRPC)
- `server/api/routers/auth.ts` - Authentication endpoints
- `server/api/routers/users.ts` - User management
- `server/api/routers/workouts.ts` - Workout functionality
- `server/api/routers/exercises.ts` - Exercise library
- `server/api/routers/user-progress.ts` - Progress tracking

## Development Workflow

### Working with the Database
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Generate client with `npm run db:generate`

### Adding New Features
1. Create tRPC router in `src/server/api/routers/`
2. Add to root router in `src/server/api/root.ts`
3. Create components in appropriate feature directory
4. Add pages in `src/app/`
5. Write tests in `tests/`

### Environment Setup
- Uses 1Password CLI for secret management (`op run`)
- Environment variables loaded from `.env` with 1Password references
- Database URL, API keys, and auth secrets managed securely

## Important Conventions

### Code Style
- TypeScript strict mode enabled
- Path aliases: `@/*` and `~/*` point to `src/*`
- Component exports via index.ts files for clean imports
- Validation using Zod schemas in `src/utils/validation/`

### File Naming
- React components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities and hooks: camelCase (e.g., `useWorkouts.ts`)
- API routes: kebab-case (e.g., `user-progress.ts`)

### Testing Strategy
- E2E tests for critical user journeys in `tests/e2e/`
- Component tests using Storybook
- Visual regression tests with Playwright
- API testing with tRPC procedures

## Security & Authentication

### Current State
- Mock authentication with localStorage
- Demo credentials: `demo@example.com` / `password`
- No real data persistence (uses mock data)

### Production Considerations
- 1Password CLI integration for secrets
- NextAuth planned for production authentication
- tRPC procedures can be protected with middleware
- Environment variables managed via 1Password vault references

## Deployment

### Vercel (Recommended)
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- Edge functions for API routes

### Development Server Commands
```bash
npm run vercel:dev         # Test Vercel deployment locally
npm run vercel:build       # Build with Vercel
```

## Project Context

This is Phase 2 of a migration from Exercise.com to an independent fitness platform. The goal is to create an AI-powered solution that enables strength coaches to earn $100K+ annually through intelligent automation.

### Legacy Resources
- `brx-core/` contains API analysis and migration tools
- Swagger documentation for Exercise.com API (136 endpoints)
- Data collection scripts for feature analysis
- UI/API mapping files for migration planning

### AI Integration Points
- Cursor IDE configuration in `.cursorrules`
- Aggressive AI workflow enabled for autonomous development
- AI-assisted feature prioritization and code generation
- Automated testing and deployment processes