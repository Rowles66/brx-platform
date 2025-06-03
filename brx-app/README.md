# BRX App Replica

## Features

### Workout Management
- Create custom workouts with detailed exercise configurations
- Categorize workouts by type and difficulty
- Track sets, reps, weights, and rest times
- Assign workouts to programs
- Comprehensive validation system for workout data:
  * Name validation (3-50 characters)
  * Duration limits (5-240 minutes)
  * Exercise parameter validation:
    - Sets: 1-20 (integer)
    - Reps: 1-100 (integer)
    - Weight: 0-1000 kg
    - Rest time: 0-300 seconds
  * Validation features:
    - Real-time validation feedback
    - Field-level validation messages
    - Visual error indicators
    - Error summaries for quick fixes
    - Reset validation option
    - Validation status indicators
  * Technical implementation:
    - Zod schema validation
    - Type-safe with TypeScript integration
    - Path-based error identification
    - Centralized validation constants
    - Helper functions for error extraction and display
    - Component-specific error handling
    - Real-time validation with React hooks
    - Validation state management
    - Clear visual feedback system
    - Modular file structure for maintainability

> 📘 **Documentation**: See [Validation System README](src/utils/validation/README.md) for detailed usage instructions and API reference.

### Exercise Library
- Browse comprehensive exercise database
- Filter exercises by muscle group, equipment, and difficulty
- Add exercises to workouts with default parameters

### Program Management
- Build structured training programs
- Organize workouts into weekly schedules
- Track client progress through programs

## Technical Implementation

### Backend
- Next.js API routes with tRPC for type-safe API
- Prisma ORM with PostgreSQL database
- Authentication via Clerk

### Frontend
- React with Next.js App Router
- TailwindCSS for styling
- React Query for data fetching
- Sonner for toast notifications

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure environment variables
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following key models:
- User: Represents trainers or administrators
- Client: Users being trained
- Exercise: Exercise library entries
- Workout: Collections of exercises with specific parameters
- WorkoutPlan: Structured programs consisting of workouts

# BRX Performance App Replica - Next.js + tRPC + Prisma

This is a Next.js 14 application replicating the BRX Performance authentication system with modern tooling.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: tRPC for type-safe APIs
- **Database**: Prisma + PostgreSQL
- **Authentication**: Static data (for now)
- **Secrets Management**: 1Password CLI (`op run`)
- **Linting**: ESLint

## Features

- ✅ Modern Next.js 14 setup with App Router
- ✅ tRPC integration for type-safe APIs
- ✅ Prisma ORM with PostgreSQL support
- ✅ Tailwind CSS for styling
- ✅ 1Password CLI integration for secrets management
- ✅ Extracted BRX Performance UI components
- ✅ Authentication form with static data
- ✅ TypeScript throughout

## Getting Started

### Prerequisites

1. Node.js 18+
2. 1Password CLI (`op`) installed and authenticated
3. PostgreSQL database (optional for now, using static data)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start development server (with 1Password secrets)
npm run dev
```

### Environment Variables

The application uses 1Password CLI for secrets management. Update `.env` with your 1Password vault references:

```env
DATABASE_URL="op://vault/database/DATABASE_URL"
NEXTAUTH_URL="op://vault/nextjs/NEXTAUTH_URL"
NEXTAUTH_SECRET="op://vault/nextjs/NEXTAUTH_SECRET"
API_SECRET_KEY="op://vault/api/SECRET_KEY"

# FireCrawl Automation
FIRECRAWL_API_KEY="op://vault/firecrawl/API_KEY"
OP_SERVICE_ACCOUNT_TOKEN="op://vault/github-actions/SERVICE_ACCOUNT_TOKEN"
SLACK_WEBHOOK_URL="op://vault/notifications/SLACK_WEBHOOK_URL"  # Optional
```

## Available Scripts

- `npm run dev` - Start development server with 1Password secrets
- `npm run build` - Build production app with 1Password secrets
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (with 1Password secrets)
- `npm run db:migrate` - Run database migrations (with 1Password secrets)
- `npm run db:studio` - Open Prisma Studio (with 1Password secrets)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable components
│   ├── scraped/        # Extracted BRX Performance components
│   └── providers.tsx   # tRPC and React Query providers
├── server/             # tRPC server configuration
│   └── api/           # API routes and procedures
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## Components

Extracted and converted BRX Performance components:

- **AuthLayout** - Main authentication layout with branded background
- **AuthCard** - Card container for auth forms
- **SignInForm** - Complete sign-in form
- **FormField** - Reusable form input field
- **PasswordField** - Password input with show/hide toggle
- **CheckboxField** - Custom checkbox component
- **AuthButton** - Branded authentication button
- **Logo** - BRX Performance logo component

## Demo Credentials

For testing the sign-in form:
- **Email**: `demo@example.com`
- **Password**: `password`

## tRPC API

Available endpoints:

- `users.getAll` - Get all users (static data)
- `users.getByEmail` - Get user by email
- `users.create` - Create new user
- `example.hello` - Example greeting endpoint

## Next Steps

1. ✅ Implement Frontend Scraping & UI Reconstruction (Phase 2)
2. Set up real database connection
3. Implement proper authentication
4. Content Extraction & Schema Mapping (Phase 3)
5. Real-time Diff Deployment
6. Set up deployment pipeline
7. Add comprehensive testing

## Development

The application uses static data for now to demonstrate the UI and architecture. All components have been converted from Material-UI to Tailwind CSS while maintaining the original BRX Performance design.

Open [http://localhost:3000](http://localhost:3000) to see the sign-in form in action.

## Implementation Phases

### Phase 2: Frontend Scraping & UI Reconstruction

This phase implements an automated system to mirror the production BRX Performance UI by capturing nightly snapshots using FireCrawl, analyzing the DOM structure, and rebuilding the component tree for accurate reproduction in our Next.js application.

Key components and features implemented:

- `FireCrawl` headless browser orchestration for accurate DOM snapshots
- Automated nightly extraction pipeline with GitHub Actions
- Component diffing & version tracking for UI changes
- Pull request generation with visual diffs

#### Nightly FireCrawl Automation

The system is configured to run nightly at 2:00 AM UTC and maintains a 14-day retention policy for UI snapshots.

**Script Paths & Purposes:**

- `scripts/run-nightly-firecrawl.sh` - Main orchestration script that:
  - Executes `op run -- python3 scripts/extract_with_firecrawl.py`
  - Creates date-specific branches (`frontend_sources/firecrawl/<date>`)
  - Pushes new assets to the branch
  - Handles comprehensive error management and cleanup
- `scripts/extract_with_firecrawl.py` - FireCrawl API integration for DOM extraction
- `scripts/test-firecrawl-setup.sh` - Setup validation tool
- `scripts/requirements.txt` - Python dependencies

**GitHub Actions Workflow:**

The workflow is defined in `.github/workflows/nightly-firecrawl.yml` and includes:

- Scheduled nightly runs at 2:00 AM UTC
- Manual trigger support with custom parameters
- Python dependency caching for performance
- Automatic pull request creation with detailed summaries
- Artifact uploads and cleanup procedures

**Security & Authentication:**

- 1Password CLI integration for secure credential management
- Service account tokens for GitHub Actions
- No hardcoded secrets in any code

**Monitoring & Notifications:**

- Slack integration with detailed status messages
- Extraction statistics in notifications
- GitHub Actions status tracking
- Artifact uploads for extraction results

The system is fully functional and includes testing tools, manual execution capabilities, and comprehensive documentation.
