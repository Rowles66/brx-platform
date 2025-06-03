import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// Zod schemas for workout management
const workoutStatus = z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

const workoutExerciseInput = z.object({
  exerciseId: z.string(),
  sets: z.number().min(1).optional(),
  reps: z.number().min(1).optional(),
  weight: z.number().min(0).optional(),
  duration: z.number().min(1).optional(), // in seconds
  rest: z.number().min(0).optional(), // in seconds
  notes: z.string().optional(),
});

const workoutInput = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  duration: z.number().min(1).optional(), // in minutes
  scheduledAt: z.date().optional(),
  exercises: z.array(workoutExerciseInput).optional().default([]),
});

const workoutIdInput = z.object({
  id: z.string(),
});

const workoutFilterInput = z.object({
  userId: z.string().optional(),
  status: workoutStatus.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Output schemas
const workoutExerciseResponse = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  sets: z.number().nullable(),
  reps: z.number().nullable(),
  weight: z.number().nullable(),
  duration: z.number().nullable(),
  rest: z.number().nullable(),
  notes: z.string().nullable(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const workoutResponse = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  status: workoutStatus,
  exercises: z.array(workoutExerciseResponse),
  scheduledAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const workoutListResponse = z.object({
  workouts: z.array(workoutResponse),
  total: z.number(),
  hasMore: z.boolean(),
});

// Exercise.com API client helper
const callExerciseAPI = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = 'https://api.exercise.com/v1';
  const bearerToken = process.env.EXERCISE_COM_API_TOKEN;
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Exercise.com API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Static data for fallback
const staticWorkouts = [
  {
    id: '1',
    userId: '1',
    name: 'Push Day',
    description: 'Upper body push movements',
    duration: 60,
    status: 'PLANNED' as const,
    exercises: [
      {
        id: '1',
        exerciseId: '1',
        exerciseName: 'Push-ups',
        sets: 3,
        reps: 15,
        weight: null,
        duration: null,
        rest: 60,
        notes: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    scheduledAt: new Date(),
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type ExerciseAPIResponse = {
  data: Record<string, unknown>[];
  total: number;
};

type ExerciseDetails = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  duration: number;
  status: string;
  exercises?: Record<string, unknown>[];
  scheduled_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
};

export const workoutsRouter = createTRPCRouter({
  /**
   * Get all workouts with filtering - Proxy to Exercise.com API
   */
  getAll: publicProcedure
    .input(workoutFilterInput)
    .output(workoutListResponse)
    .query(async ({ input }) => {
      try {
        const queryParams = new URLSearchParams();
        if (input.userId) queryParams.append('user_id', input.userId);
        if (input.status) queryParams.append('status', input.status);
        if (input.dateFrom) queryParams.append('date_from', input.dateFrom.toISOString());
        if (input.dateTo) queryParams.append('date_to', input.dateTo.toISOString());
        queryParams.append('limit', input.limit.toString());
        queryParams.append('offset', input.offset.toString());
        
        const exerciseResponse = await callExerciseAPI(`/workouts?${queryParams.toString()}`) as ExerciseAPIResponse;
        
        return {
          workouts: exerciseResponse.data.map((workout) => {
            const w = workout as ExerciseDetails;
            return {
              id: w.id,
              userId: w.user_id,
              name: w.name,
              description: w.description,
              duration: w.duration,
              status: w.status as 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
              exercises: (w.exercises || []).map((ex) => {
                const e = ex as Record<string, unknown>;
                return {
                  id: e.id as string,
                  exerciseId: e.exercise_id as string,
                  exerciseName: e.exercise_name as string,
                  sets: e.sets as number | null,
                  reps: e.reps as number | null,
                  weight: e.weight as number | null,
                  duration: e.duration as number | null,
                  rest: e.rest as number | null,
                  notes: e.notes as string | null,
                  completed: e.completed as boolean,
                  createdAt: new Date(e.created_at as string),
                  updatedAt: new Date(e.updated_at as string),
                };
              }),
              scheduledAt: w.scheduled_at ? new Date(w.scheduled_at) : null,
              completedAt: w.completed_at ? new Date(w.completed_at) : null,
              createdAt: new Date(w.created_at),
              updatedAt: new Date(w.updated_at),
            };
          }),
          total: exerciseResponse.total,
          hasMore: (input.offset + input.limit) < exerciseResponse.total,
        };
      } catch (error) {
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        return {
          workouts: staticWorkouts,
          total: staticWorkouts.length,
          hasMore: false,
        };
      }
    }),

  /**
   * Get workout by ID - Proxy to Exercise.com API
   */
  getById: publicProcedure
    .input(workoutIdInput)
    .output(workoutResponse.nullable())
    .query(async ({ input }) => {
      try {
        const exerciseResponse = await callExerciseAPI(`/workouts/${input.id}`) as ExerciseDetails;
        
        return {
          id: exerciseResponse.id,
          userId: exerciseResponse.user_id,
          name: exerciseResponse.name,
          description: exerciseResponse.description,
          duration: exerciseResponse.duration,
          status: exerciseResponse.status as 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
          exercises: (exerciseResponse.exercises || []).map((ex) => {
            const e = ex as Record<string, unknown>;
            return {
              id: e.id as string,
              exerciseId: e.exercise_id as string,
              exerciseName: e.exercise_name as string,
              sets: e.sets as number | null,
              reps: e.reps as number | null,
              weight: e.weight as number | null,
              duration: e.duration as number | null,
              rest: e.rest as number | null,
              notes: e.notes as string | null,
              completed: e.completed as boolean,
              createdAt: new Date(e.created_at as string),
              updatedAt: new Date(e.updated_at as string),
            };
          }),
          scheduledAt: exerciseResponse.scheduled_at ? new Date(exerciseResponse.scheduled_at) : null,
          completedAt: exerciseResponse.completed_at ? new Date(exerciseResponse.completed_at) : null,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        const workout = staticWorkouts.find(w => w.id === input.id);
        return workout || null;
      }
    }),

  /**
   * Create new workout - Proxy to Exercise.com API
   */
  create: publicProcedure
    .input(workoutInput)
    .output(workoutResponse)
    .mutation(async ({ input }) => {
      try {
        const exerciseResponse = await callExerciseAPI('/workouts', {
          method: 'POST',
          body: JSON.stringify({
            name: input.name,
            description: input.description,
            duration: input.duration,
            scheduled_at: input.scheduledAt?.toISOString(),
            exercises: input.exercises.map(ex => ({
              exercise_id: ex.exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              duration: ex.duration,
              rest: ex.rest,
              notes: ex.notes,
            })),
          }),
        }) as ExerciseDetails;
        
        return {
          id: exerciseResponse.id,
          userId: exerciseResponse.user_id,
          name: exerciseResponse.name,
          description: exerciseResponse.description,
          duration: exerciseResponse.duration,
          status: exerciseResponse.status as 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
          exercises: (exerciseResponse.exercises || []).map((ex) => {
            const e = ex as Record<string, unknown>;
            return {
              id: e.id as string,
              exerciseId: e.exercise_id as string,
              exerciseName: e.exercise_name as string,
              sets: e.sets as number | null,
              reps: e.reps as number | null,
              weight: e.weight as number | null,
              duration: e.duration as number | null,
              rest: e.rest as number | null,
              notes: e.notes as string | null,
              completed: e.completed as boolean,
              createdAt: new Date(e.created_at as string),
              updatedAt: new Date(e.updated_at as string),
            };
          }),
          scheduledAt: exerciseResponse.scheduled_at ? new Date(exerciseResponse.scheduled_at) : null,
          completedAt: exerciseResponse.completed_at ? new Date(exerciseResponse.completed_at) : null,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return {
          id: Math.random().toString(),
          userId: '1',
          name: input.name,
          description: input.description || null,
          duration: input.duration || null,
          status: 'PLANNED' as const,
          exercises: input.exercises.map((ex, index) => ({
            id: `ex_${index}`,
            exerciseId: ex.exerciseId,
            exerciseName: `Exercise ${ex.exerciseId}`,
            sets: ex.sets || null,
            reps: ex.reps || null,
            weight: ex.weight || null,
            duration: ex.duration || null,
            rest: ex.rest || null,
            notes: ex.notes || null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          scheduledAt: input.scheduledAt || null,
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Delete workout - Proxy to Exercise.com API
   */
  delete: publicProcedure
    .input(workoutIdInput)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        await callExerciseAPI(`/workouts/${input.id}`, {
          method: 'DELETE',
        });
        
        return { success: true };
      } catch (error) {
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return { success: true };
      }
    }),
});

