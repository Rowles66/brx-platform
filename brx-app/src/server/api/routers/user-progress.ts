import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// Zod schemas for user progress tracking
const personalRecordInput = z.object({
  exerciseId: z.string(),
  type: z.enum(['weight', 'reps', 'duration', 'distance']),
  value: z.number().min(0),
  unit: z.string().optional(), // e.g., 'lbs', 'kg', 'minutes', 'seconds', 'miles', 'km'
  date: z.date().optional(),
  notes: z.string().optional(),
});

const userExerciseInput = z.object({
  exerciseId: z.string(),
  personalBest: z.record(z.any()).optional(), // JSON object for flexible PR data
  preferences: z.record(z.any()).optional(), // JSON object for user preferences
  notes: z.string().optional(),
});

const progressFilterInput = z.object({
  userId: z.string().optional(),
  exerciseId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

const exerciseStatsInput = z.object({
  exerciseId: z.string(),
  period: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
});

const achievementInput = z.object({
  type: z.enum(['pr', 'streak', 'milestone', 'consistency']),
  exerciseId: z.string().optional(),
  value: z.number().optional(),
  description: z.string(),
});

// Output schemas
const personalRecordResponse = z.object({
  id: z.string(),
  userId: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  type: z.string(),
  value: z.number(),
  unit: z.string().nullable(),
  previousValue: z.number().nullable(),
  improvement: z.number().nullable(),
  date: z.date(),
  notes: z.string().nullable(),
  createdAt: z.date(),
});

const userExerciseResponse = z.object({
  id: z.string(),
  userId: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  personalBest: z.record(z.any()).nullable(),
  preferences: z.record(z.any()).nullable(),
  notes: z.string().nullable(),
  totalSessions: z.number(),
  lastPerformed: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const progressStatsResponse = z.object({
  totalWorkouts: z.number(),
  totalExercises: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  totalVolume: z.number(), // Total weight lifted or time exercised
  averageWorkoutDuration: z.number(),
  favoriteExercises: z.array(z.object({
    exerciseId: z.string(),
    exerciseName: z.string(),
    sessionCount: z.number(),
  })),
  recentAchievements: z.array(z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
    date: z.date(),
  })),
});

const exerciseProgressResponse = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  sessions: z.array(z.object({
    date: z.date(),
    sets: z.number().nullable(),
    reps: z.number().nullable(),
    weight: z.number().nullable(),
    duration: z.number().nullable(),
    volume: z.number().nullable(),
  })),
  personalRecords: z.array(personalRecordResponse),
  trends: z.object({
    volumeTrend: z.enum(['increasing', 'decreasing', 'stable']),
    consistencyScore: z.number().min(0).max(1),
    averageProgress: z.number(),
  }),
});

// Exercise.com API client helper
const callExerciseAPI = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = 'https://api.exercise.com/v1'; // TODO: Replace with actual Exercise.com API URL
  const bearerToken = process.env.EXERCISE_COM_API_TOKEN; // TODO: Add to environment variables
  
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
const staticProgress = {
  personalRecords: [
    {
      id: '1',
      userId: '1',
      exerciseId: '1',
      exerciseName: 'Push-ups',
      type: 'reps',
      value: 25,
      unit: null,
      previousValue: 20,
      improvement: 5,
      date: new Date(),
      notes: 'New personal best!',
      createdAt: new Date(),
    },
    {
      id: '2',
      userId: '1',
      exerciseId: '3',
      exerciseName: 'Deadlifts',
      type: 'weight',
      value: 185,
      unit: 'lbs',
      previousValue: 175,
      improvement: 10,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: 'Felt strong today',
      createdAt: new Date(),
    },
  ],
  userExercises: [
    {
      id: '1',
      userId: '1',
      exerciseId: '1',
      exerciseName: 'Push-ups',
      personalBest: { reps: 25, weight: null },
      preferences: { preferredSets: 3, preferredReps: 15 },
      notes: 'Focus on form',
      totalSessions: 12,
      lastPerformed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  stats: {
    totalWorkouts: 8,
    totalExercises: 15,
    currentStreak: 3,
    longestStreak: 5,
    totalVolume: 2500,
    averageWorkoutDuration: 45,
    favoriteExercises: [
      { exerciseId: '1', exerciseName: 'Push-ups', sessionCount: 12 },
      { exerciseId: '2', exerciseName: 'Squats', sessionCount: 10 },
    ],
    recentAchievements: [
      {
        id: '1',
        type: 'pr',
        description: 'New PR: 25 push-ups!',
        date: new Date(),
      },
    ],
  },
};

export const userProgressRouter = createTRPCRouter({
  /**
   * Get user's overall progress statistics - Proxy to Exercise.com API
   */
  getStats: publicProcedure
    .input(z.object({ userId: z.string() }).optional())
    .output(progressStatsResponse)
    .query(async ({ input }) => {
      try {
        const userId = input?.userId || 'current'; // Use 'current' for authenticated user
        
        // Proxy to Exercise.com user progress stats endpoint
        const exerciseResponse = await callExerciseAPI(`/users/${userId}/progress/stats`);
        
        return {
          totalWorkouts: exerciseResponse.total_workouts,
          totalExercises: exerciseResponse.total_exercises,
          currentStreak: exerciseResponse.current_streak,
          longestStreak: exerciseResponse.longest_streak,
          totalVolume: exerciseResponse.total_volume,
          averageWorkoutDuration: exerciseResponse.average_workout_duration,
          favoriteExercises: exerciseResponse.favorite_exercises.map((ex: Record<string, unknown>) => ({
            exerciseId: ex.exercise_id as string,
            exerciseName: ex.exercise_name as string,
            sessionCount: ex.session_count as number,
          })),
          recentAchievements: exerciseResponse.recent_achievements.map((ach: Record<string, unknown>) => ({
            id: ach.id as string,
            type: ach.type as string,
            description: ach.description as string,
            date: new Date(ach.date as string),
          })),
        };
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        return staticProgress.stats;
      }
    }),

  /**
   * Get user's personal records - Proxy to Exercise.com API
   */
  getPersonalRecords: publicProcedure
    .input(progressFilterInput)
    .output(z.array(personalRecordResponse))
    .query(async ({ input }) => {
      try {
        // Build query parameters for Exercise.com API
        const queryParams = new URLSearchParams();
        if (input.userId) queryParams.append('user_id', input.userId);
        if (input.exerciseId) queryParams.append('exercise_id', input.exerciseId);
        if (input.dateFrom) queryParams.append('date_from', input.dateFrom.toISOString());
        if (input.dateTo) queryParams.append('date_to', input.dateTo.toISOString());
        queryParams.append('limit', input.limit.toString());
        queryParams.append('offset', input.offset.toString());
        
        // Proxy to Exercise.com personal records endpoint
        const exerciseResponse = await callExerciseAPI(`/users/progress/records?${queryParams.toString()}`);
        
        return exerciseResponse.data.map((record: Record<string, unknown>) => ({
          id: record.id as string,
          userId: record.user_id as string,
          exerciseId: record.exercise_id as string,
          exerciseName: record.exercise_name as string,
          type: record.type as string,
          value: record.value as number,
          unit: record.unit as string | null,
          previousValue: record.previous_value as number | null,
          improvement: record.improvement as number | null,
          date: new Date(record.date as string),
          notes: record.notes as string | null,
          createdAt: new Date(record.created_at as string),
        }));
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        let filteredRecords = [...staticProgress.personalRecords];
        
        // Apply filters to static data
        if (input.exerciseId) {
          filteredRecords = filteredRecords.filter(r => r.exerciseId === input.exerciseId);
        }
        if (input.dateFrom) {
          filteredRecords = filteredRecords.filter(r => r.date >= input.dateFrom!);
        }
        if (input.dateTo) {
          filteredRecords = filteredRecords.filter(r => r.date <= input.dateTo!);
        }
        
        const startIndex = input.offset;
        const endIndex = startIndex + input.limit;
        return filteredRecords.slice(startIndex, endIndex);
      }
    }),

  /**
   * Create new personal record - Proxy to Exercise.com API
   */
  createPersonalRecord: publicProcedure
    .input(personalRecordInput)
    .output(personalRecordResponse)
    .mutation(async ({ input }) => {
      try {
        // Proxy to Exercise.com personal record creation endpoint
        const exerciseResponse = await callExerciseAPI('/users/progress/records', {
          method: 'POST',
          body: JSON.stringify({
            exercise_id: input.exerciseId,
            type: input.type,
            value: input.value,
            unit: input.unit,
            date: input.date?.toISOString() || new Date().toISOString(),
            notes: input.notes,
          }),
        });
        
        return {
          id: exerciseResponse.id,
          userId: exerciseResponse.user_id,
          exerciseId: exerciseResponse.exercise_id,
          exerciseName: exerciseResponse.exercise_name,
          type: exerciseResponse.type,
          value: exerciseResponse.value,
          unit: exerciseResponse.unit,
          previousValue: exerciseResponse.previous_value,
          improvement: exerciseResponse.improvement,
          date: new Date(exerciseResponse.date),
          notes: exerciseResponse.notes,
          createdAt: new Date(exerciseResponse.created_at),
        };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return {
          id: Math.random().toString(),
          userId: '1', // TODO: Get from session
          exerciseId: input.exerciseId,
          exerciseName: `Exercise ${input.exerciseId}`, // TODO: Look up actual name
          type: input.type,
          value: input.value,
          unit: input.unit || null,
          previousValue: null,
          improvement: null,
          date: input.date || new Date(),
          notes: input.notes || null,
          createdAt: new Date(),
        };
      }
    }),

  /**
   * Get user exercise preferences and history - Proxy to Exercise.com API
   */
  getUserExercise: publicProcedure
    .input(z.object({ exerciseId: z.string() }))
    .output(userExerciseResponse.nullable())
    .query(async ({ input }) => {
      try {
        // Proxy to Exercise.com user exercise endpoint
        const exerciseResponse = await callExerciseAPI(`/users/exercises/${input.exerciseId}`);
        
        return {
          id: exerciseResponse.id,
          userId: exerciseResponse.user_id,
          exerciseId: exerciseResponse.exercise_id,
          exerciseName: exerciseResponse.exercise_name,
          personalBest: exerciseResponse.personal_best,
          preferences: exerciseResponse.preferences,
          notes: exerciseResponse.notes,
          totalSessions: exerciseResponse.total_sessions,
          lastPerformed: exerciseResponse.last_performed ? new Date(exerciseResponse.last_performed) : null,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        const userExercise = staticProgress.userExercises.find(ue => ue.exerciseId === input.exerciseId);
        return userExercise || null;
      }
    }),

  /**
   * Update user exercise preferences - Proxy to Exercise.com API
   */
  updateUserExercise: publicProcedure
    .input(userExerciseInput)
    .output(userExerciseResponse)
    .mutation(async ({ input }) => {
      try {
        // Proxy to Exercise.com user exercise update endpoint
        const exerciseResponse = await callExerciseAPI(`/users/exercises/${input.exerciseId}`, {
          method: 'PUT',
          body: JSON.stringify({
            personal_best: input.personalBest,
            preferences: input.preferences,
            notes: input.notes,
          }),
        });
        
        return {
          id: exerciseResponse.id,
          userId: exerciseResponse.user_id,
          exerciseId: exerciseResponse.exercise_id,
          exerciseName: exerciseResponse.exercise_name,
          personalBest: exerciseResponse.personal_best,
          preferences: exerciseResponse.preferences,
          notes: exerciseResponse.notes,
          totalSessions: exerciseResponse.total_sessions,
          lastPerformed: exerciseResponse.last_performed ? new Date(exerciseResponse.last_performed) : null,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        const existingUserExercise = staticProgress.userExercises.find(ue => ue.exerciseId === input.exerciseId);
        if (!existingUserExercise) {
          return {
            id: Math.random().toString(),
            userId: '1',
            exerciseId: input.exerciseId,
            exerciseName: `Exercise ${input.exerciseId}`,
            personalBest: input.personalBest || null,
            preferences: input.preferences || null,
            notes: input.notes || null,
            totalSessions: 0,
            lastPerformed: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        
        return {
          ...existingUserExercise,
          personalBest: input.personalBest || existingUserExercise.personalBest,
          preferences: input.preferences || existingUserExercise.preferences,
          notes: input.notes || existingUserExercise.notes,
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Get exercise progress over time - Proxy to Exercise.com API
   */
  getExerciseProgress: publicProcedure
    .input(exerciseStatsInput)
    .output(exerciseProgressResponse)
    .query(async ({ input }) => {
      try {
        // Proxy to Exercise.com exercise progress endpoint
        const exerciseResponse = await callExerciseAPI(
          `/users/progress/exercises/${input.exerciseId}?period=${input.period}`
        );
        
        return {
          exerciseId: exerciseResponse.exercise_id,
          exerciseName: exerciseResponse.exercise_name,
          sessions: exerciseResponse.sessions.map((session: Record<string, unknown>) => ({
            date: new Date(session.date as string),
            sets: session.sets as number | null,
            reps: session.reps as number | null,
            weight: session.weight as number | null,
            duration: session.duration as number | null,
            volume: session.volume as number | null,
          })),
          personalRecords: exerciseResponse.personal_records.map((record: Record<string, unknown>) => ({
            id: record.id as string,
            userId: record.user_id as string,
            exerciseId: record.exercise_id as string,
            exerciseName: record.exercise_name as string,
            type: record.type as string,
            value: record.value as number,
            unit: record.unit as string | null,
            previousValue: record.previous_value as number | null,
            improvement: record.improvement as number | null,
            date: new Date(record.date as string),
            notes: record.notes as string | null,
            createdAt: new Date(record.created_at as string),
          })),
          trends: {
            volumeTrend: exerciseResponse.trends.volume_trend,
            consistencyScore: exerciseResponse.trends.consistency_score,
            averageProgress: exerciseResponse.trends.average_progress,
          },
        };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return {
          exerciseId: input.exerciseId,
          exerciseName: `Exercise ${input.exerciseId}`,
          sessions: [
            {
              date: new Date(),
              sets: 3,
              reps: 15,
              weight: null,
              duration: null,
              volume: 45,
            },
          ],
          personalRecords: staticProgress.personalRecords.filter(pr => pr.exerciseId === input.exerciseId),
          trends: {
            volumeTrend: 'increasing' as const,
            consistencyScore: 0.85,
            averageProgress: 5.2,
          },
        };
      }
    }),

  /**
   * Create achievement - Proxy to Exercise.com API
   */
  createAchievement: publicProcedure
    .input(achievementInput)
    .output(z.object({
      id: z.string(),
      type: z.string(),
      description: z.string(),
      exerciseId: z.string().nullable(),
      value: z.number().nullable(),
      date: z.date(),
      createdAt: z.date(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Proxy to Exercise.com achievement creation endpoint
        const exerciseResponse = await callExerciseAPI('/users/achievements', {
          method: 'POST',
          body: JSON.stringify({
            type: input.type,
            description: input.description,
            exercise_id: input.exerciseId,
            value: input.value,
          }),
        });
        
        return {
          id: exerciseResponse.id,
          type: exerciseResponse.type,
          description: exerciseResponse.description,
          exerciseId: exerciseResponse.exercise_id,
          value: exerciseResponse.value,
          date: new Date(exerciseResponse.date),
          createdAt: new Date(exerciseResponse.created_at),
        };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return {
          id: Math.random().toString(),
          type: input.type,
          description: input.description,
          exerciseId: input.exerciseId || null,
          value: input.value || null,
          date: new Date(),
          createdAt: new Date(),
        };
      }
    }),
});

