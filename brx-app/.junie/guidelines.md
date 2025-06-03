# BRX App Replica - Project Guidelines for Junie

## Project Overview
BRX App Replica is a Next.js 14 application that replicates the BRX Performance app with modern tooling. The application focuses on workout management, exercise library, and program management features.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: tRPC for type-safe APIs
- **Database**: Prisma + PostgreSQL
- **Authentication**: Clerk

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
│   └── validation/    # Validation system
└── lib/                # Library configurations
```

## Testing Guidelines
- Junie should run tests to verify the correctness of proposed solutions
- Use `npm run test` to run the test suite
- For component-specific tests, use `npm run test -- -t "ComponentName"`
- Ensure all tests pass before submitting changes

## Build Process
- Junie should build the project before submitting to ensure there are no build errors
- Use `npm run build` to build the project

## Code Style Guidelines
1. **TypeScript**: Use strict typing for all new code
2. **Component Structure**:
   - Use functional components with hooks
   - Follow the existing component structure in the project
3. **Styling**:
   - Use Tailwind CSS for styling
   - Follow the existing design patterns
4. **API Endpoints**:
   - Use tRPC for all new API endpoints
   - Ensure proper error handling and validation
5. **Validation**:
   - Use Zod for schema validation
   - Follow the validation system documentation in `src/utils/validation/README.md`

## Environment Variables
- The application uses 1Password CLI for secrets management
- Refer to the README.md for the list of required environment variables

## Getting Started for Development
1. Clone the repository
2. Install dependencies with `npm install`
3. Generate Prisma client with `npm run db:generate`
4. Configure environment variables
5. Run the development server with `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser
