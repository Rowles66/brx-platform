import { createTRPCRouter } from './trpc';
import { exampleRouter } from './routers/example';
import { usersRouter } from './routers/users';
import { authRouter } from './routers/auth';
import { exercisesRouter } from './routers/exercises';
import { workoutsRouter } from './routers/workouts';
import { userProgressRouter } from './routers/user-progress';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // Legacy routers (for backward compatibility)
  example: exampleRouter,
  users: usersRouter,
  
  // High-priority feature routers (Exercise.com API proxies)
  auth: authRouter,
  exercises: exercisesRouter,
  workouts: workoutsRouter,
  userProgress: userProgressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

