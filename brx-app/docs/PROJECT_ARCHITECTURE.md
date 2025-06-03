# BRX Performance App Architecture

## Overview
This document outlines the architecture and technical implementation of the BRX Performance athlete portal replication.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (for complex state)
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **API Layer**: tRPC for type-safe API calls
- **Authentication**: Currently using localStorage (to be replaced with NextAuth)
- **Database**: Mock data (to be replaced with PostgreSQL/Prisma)
- **Payment Processing**: Stripe (integration pending)

### Developer Experience
- **Type Safety**: End-to-end TypeScript with tRPC
- **Code Quality**: ESLint + TypeScript strict mode
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   │   └── login/         # Login page
│   ├── api/               # API routes
│   │   └── trpc/          # tRPC endpoint
│   │       └── routers/      # Feature-specific routers
│   │           ├── auth.ts   # Authentication
│   │           ├── user.ts   # User management
│   │           └── workout.ts # Workout features
│   ├── components/            # Reusable UI components
│   ├── server/               # Backend logic
│   │   ├── api/
│   │   │   ├── root.ts       # Root tRPC router
│   │   │   ├── trpc.ts       # tRPC configuration
│   │   │   └── routers/      # Feature-specific routers
│   │   │       └── workout.ts # Workout features
│   │   └── trpc.ts          # tRPC client setup
│   └── utils/               # Helper functions
```

## Key Features Implemented

### 1. Authentication System
- Email/password login
- Session management (currently localStorage)
- Protected routes
- Mock user: test@example.com / password123

### 2. Dashboard
- Quick stats overview
- Recent activity feed
- Navigation to all major features
- Responsive design

### 3. Workout Module
- List of scheduled/completed workouts
- Individual workout detail pages
- Exercise tracking with sets/reps/weight
- Progress tracking within workouts
- Workout completion with notes

### 4. Schedule/Calendar
- Monthly calendar view
- Upcoming events sidebar
- Color-coded event types (workouts, classes, appointments)
- Responsive grid layout

### 5. Progress Tracking
- Performance metrics dashboard
- Weekly completion visualization
- Monthly workout trends
- Personal records tracking
- Achievement system

### 6. User Profile
- Personal information management
- Emergency contact details
- Edit mode with save functionality
- Settings navigation sidebar

## API Structure (tRPC Routers)

### Auth Router
- `signIn` - User authentication
- `signUp` - User registration
- `signOut` - Session termination

### User Router
- `me` - Get current user info
- `updateProfile` - Update user details
- `getRequiredItems` - Get onboarding checklist

### Workout Router
- `getWorkouts` - List workouts with pagination
- `getWorkout` - Get specific workout details
- `getExercises` - Search/filter exercises
- `getWorkoutPlans` - List training programs
- `completeWorkout` - Mark workout as complete

## Data Flow

1. **Client Side**: React components use tRPC hooks to fetch/mutate data
2. **tRPC Layer**: Type-safe API calls with automatic TypeScript inference
3. **Server Side**: tRPC procedures handle business logic
4. **Data Store**: Currently mock data, will integrate with database

## Styling Approach

- **Design System**: Custom Tailwind configuration with BRX brand colors
- **Components**: Utility-first CSS with Tailwind classes
- **Responsive**: Mobile-first design with responsive breakpoints
- **Dark Mode**: CSS variables prepared for dark mode support

## Security Considerations

### Current Implementation
- Basic authentication with mock data
- Client-side session storage
- No real data persistence

### Production Requirements
- Implement NextAuth for secure authentication
- Use secure HTTP-only cookies for sessions
- Add CSRF protection
- Implement rate limiting
- Secure API endpoints with proper authorization
- Environment variable management for secrets

## Performance Optimizations

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization with Next.js Image
- React Query caching for API responses
- Tailwind CSS purging for minimal bundle size

## Future Enhancements

### Phase 1: Core Infrastructure
- [ ] PostgreSQL database integration
- [ ] Prisma ORM setup
- [ ] NextAuth implementation
- [ ] Stripe payment integration

### Phase 2: Feature Expansion
- [ ] Real-time notifications
- [ ] File uploads for progress photos
- [ ] Video exercise demonstrations
- [ ] Social features (leaderboards, challenges)
- [ ] Mobile app with React Native

### Phase 3: AI Integration
- [ ] Personalized workout recommendations
- [ ] Form analysis with computer vision
- [ ] Nutrition tracking and suggestions
- [ ] Chatbot for fitness questions

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Type Checking**: `npm run type-check`
3. **Linting**: `npm run lint`
4. **Building**: `npm run build`
5. **Production**: `npm start`

## Deployment Strategy

### Recommended Platform: Vercel
- Automatic deployments from Git
- Edge functions for API routes
- Built-in analytics
- Easy environment variable management

### Alternative: Self-hosted
- Docker containerization
- Nginx reverse proxy
- PM2 for process management
- PostgreSQL on same server or managed service 