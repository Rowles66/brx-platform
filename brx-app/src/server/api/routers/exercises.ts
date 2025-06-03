import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// Zod schemas for exercise management
const exerciseInput = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  muscleGroups: z.array(z.string()).optional().default([]),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

const exerciseUpdateInput = z.object({
  id: z.string(),
  name: z.string().min(1, 'Exercise name is required').optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

const exerciseFilterInput = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

const exerciseIdInput = z.object({
  id: z.string(),
});

// Output schemas
const exerciseResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  difficulty: z.string().nullable(),
  muscleGroups: z.array(z.string()),
  equipment: z.string().nullable(),
  instructions: z.string().nullable(),
  imageUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const exerciseListResponse = z.object({
  exercises: z.array(exerciseResponse),
  total: z.number(),
  hasMore: z.boolean(),
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
const staticExercises = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'A basic upper body exercise that targets chest, shoulders, and triceps.',
    category: 'Strength',
    difficulty: 'Beginner',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    equipment: null,
    instructions: '1. Start in plank position\n2. Lower body until chest nearly touches floor\n3. Push back up to starting position',
    imageUrl: 'https://example.com/pushup.jpg',
    videoUrl: 'https://example.com/pushup.mp4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Squats',
    description: 'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.',
    category: 'Strength',
    difficulty: 'Beginner',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    equipment: null,
    instructions: '1. Stand with feet shoulder-width apart\n2. Lower body as if sitting back into a chair\n3. Return to starting position',
    imageUrl: 'https://example.com/squat.jpg',
    videoUrl: 'https://example.com/squat.mp4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Deadlifts',
    description: 'A compound exercise that targets the posterior chain including hamstrings, glutes, and back.',
    category: 'Strength',
    difficulty: 'Intermediate',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    equipment: 'Barbell',
    instructions: '1. Stand with barbell over mid-foot\n2. Bend at hips and knees to grip bar\n3. Lift by extending hips and knees',
    imageUrl: 'https://example.com/deadlift.jpg',
    videoUrl: 'https://example.com/deadlift.mp4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const exercisesRouter = createTRPCRouter({
  /**
   * Get all exercises with filtering - Proxy to Exercise.com API
   */
  getAll: publicProcedure
    .input(exerciseFilterInput)
    .output(exerciseListResponse)
    .query(async ({ input }) => {
      try {
        // Build query parameters for Exercise.com API
        const queryParams = new URLSearchParams();
        if (input.category) queryParams.append('category', input.category);
        if (input.difficulty) queryParams.append('difficulty', input.difficulty);
        if (input.muscleGroups?.length) queryParams.append('muscle_groups', input.muscleGroups.join(','));
        if (input.equipment) queryParams.append('equipment', input.equipment);
        if (input.search) queryParams.append('search', input.search);
        queryParams.append('limit', input.limit.toString());
        queryParams.append('offset', input.offset.toString());
        
        // Proxy to Exercise.com exercises endpoint
        const exerciseResponse = await callExerciseAPI(`/exercises?${queryParams.toString()}`);
        
        // Transform Exercise.com response to our schema
        return {
          exercises: exerciseResponse.data.map((exercise: Record<string, unknown>) => ({
            id: exercise.id as string,
            name: exercise.name as string,
            description: exercise.description as string | null,
            category: exercise.category as string | null,
            difficulty: exercise.difficulty as string | null,
            muscleGroups: (exercise.muscle_groups as string[]) || [],
            equipment: exercise.equipment as string | null,
            instructions: exercise.instructions as string | null,
            imageUrl: exercise.image_url as string | null,
            videoUrl: exercise.video_url as string | null,
            createdAt: new Date(exercise.created_at as string),
            updatedAt: new Date(exercise.updated_at as string),
          })),
          total: exerciseResponse.total,
          hasMore: (input.offset + input.limit) < exerciseResponse.total,
        };
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        let filteredExercises = [...staticExercises];
        
        // Apply filters to static data
        if (input.category) {
          filteredExercises = filteredExercises.filter(ex => ex.category === input.category);
        }
        if (input.difficulty) {
          filteredExercises = filteredExercises.filter(ex => ex.difficulty === input.difficulty);
        }
        if (input.muscleGroups?.length) {
          filteredExercises = filteredExercises.filter(ex => 
            input.muscleGroups!.some(mg => ex.muscleGroups.includes(mg))
          );
        }
        if (input.search) {
          const searchLower = input.search.toLowerCase();
          filteredExercises = filteredExercises.filter(ex => 
            ex.name.toLowerCase().includes(searchLower) ||
            ex.description?.toLowerCase().includes(searchLower)
          );
        }
        
        const startIndex = input.offset;
        const endIndex = startIndex + input.limit;
        const paginatedExercises = filteredExercises.slice(startIndex, endIndex);
        
        return {
          exercises: paginatedExercises,
          total: filteredExercises.length,
          hasMore: endIndex < filteredExercises.length,
        };
      }
    }),

  /**
   * Get exercise by ID - Proxy to Exercise.com API
   */
  getById: publicProcedure
    .input(exerciseIdInput)
    .output(exerciseResponse.nullable())
    .query(async ({ input }) => {
      try {
        // Proxy to Exercise.com exercise detail endpoint
        const exerciseResponse = await callExerciseAPI(`/exercises/${input.id}`);
        
        return {
          id: exerciseResponse.id,
          name: exerciseResponse.name,
          description: exerciseResponse.description,
          category: exerciseResponse.category,
          difficulty: exerciseResponse.difficulty,
          muscleGroups: exerciseResponse.muscle_groups || [],
          equipment: exerciseResponse.equipment,
          instructions: exerciseResponse.instructions,
          imageUrl: exerciseResponse.image_url,
          videoUrl: exerciseResponse.video_url,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        const exercise = staticExercises.find(ex => ex.id === input.id);
        return exercise || null;
      }
    }),

  /**
   * Create new exercise - Proxy to Exercise.com API
   */
  create: publicProcedure
    .input(exerciseInput)
    .output(exerciseResponse)
    .mutation(async ({ input }) => {
      try {
        // Proxy to Exercise.com exercise creation endpoint
        const exerciseResponse = await callExerciseAPI('/exercises', {
          method: 'POST',
          body: JSON.stringify({
            name: input.name,
            description: input.description,
            category: input.category,
            difficulty: input.difficulty,
            muscle_groups: input.muscleGroups,
            equipment: input.equipment,
            instructions: input.instructions,
            image_url: input.imageUrl,
            video_url: input.videoUrl,
          }),
        });
        
        return {
          id: exerciseResponse.id,
          name: exerciseResponse.name,
          description: exerciseResponse.description,
          category: exerciseResponse.category,
          difficulty: exerciseResponse.difficulty,
          muscleGroups: exerciseResponse.muscle_groups || [],
          equipment: exerciseResponse.equipment,
          instructions: exerciseResponse.instructions,
          imageUrl: exerciseResponse.image_url,
          videoUrl: exerciseResponse.video_url,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return {
          id: Math.random().toString(),
          name: input.name,
          description: input.description || null,
          category: input.category || null,
          difficulty: input.difficulty || null,
          muscleGroups: input.muscleGroups || [],
          equipment: input.equipment || null,
          instructions: input.instructions || null,
          imageUrl: input.imageUrl || null,
          videoUrl: input.videoUrl || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Update exercise - Proxy to Exercise.com API
   */
  update: publicProcedure
    .input(exerciseUpdateInput)
    .output(exerciseResponse)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        
        // Proxy to Exercise.com exercise update endpoint
        const exerciseResponse = await callExerciseAPI(`/exercises/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: updateData.name,
            description: updateData.description,
            category: updateData.category,
            difficulty: updateData.difficulty,
            muscle_groups: updateData.muscleGroups,
            equipment: updateData.equipment,
            instructions: updateData.instructions,
            image_url: updateData.imageUrl,
            video_url: updateData.videoUrl,
          }),
        });
        
        return {
          id: exerciseResponse.id,
          name: exerciseResponse.name,
          description: exerciseResponse.description,
          category: exerciseResponse.category,
          difficulty: exerciseResponse.difficulty,
          muscleGroups: exerciseResponse.muscle_groups || [],
          equipment: exerciseResponse.equipment,
          instructions: exerciseResponse.instructions,
          imageUrl: exerciseResponse.image_url,
          videoUrl: exerciseResponse.video_url,
          createdAt: new Date(exerciseResponse.created_at),
          updatedAt: new Date(exerciseResponse.updated_at),
        };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        const existingExercise = staticExercises.find(ex => ex.id === input.id);
        if (!existingExercise) {
          throw new Error('Exercise not found');
        }
        
        return {
          ...existingExercise,
          ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)),
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Delete exercise - Proxy to Exercise.com API
   */
  delete: publicProcedure
    .input(exerciseIdInput)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        // Proxy to Exercise.com exercise deletion endpoint
        await callExerciseAPI(`/exercises/${input.id}`, {
          method: 'DELETE',
        });
        
        return { success: true };
      } catch (error) {
        // Fallback for development
        console.warn('Exercise.com API unavailable, using static response:', error);
        
        return { success: true };
      }
    }),

  /**
   * Get exercise categories - Proxy to Exercise.com API
   */
  getCategories: publicProcedure
    .output(z.array(z.string()))
    .query(async () => {
      try {
        // Proxy to Exercise.com categories endpoint
        const response = await callExerciseAPI('/exercises/categories');
        
        return response.categories;
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        return ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Sports'];
      }
    }),

  /**
   * Get muscle groups - Proxy to Exercise.com API
   */
  getMuscleGroups: publicProcedure
    .output(z.array(z.string()))
    .query(async () => {
      try {
        // Proxy to Exercise.com muscle groups endpoint
        const response = await callExerciseAPI('/exercises/muscle-groups');
        
        return response.muscle_groups;
      } catch (error) {
        // Fallback to static data for development
        console.warn('Exercise.com API unavailable, using static data:', error);
        
        return [
          'Chest', 'Back', 'Shoulders', 'Arms', 'Biceps', 'Triceps',
          'Core', 'Abs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves',
          'Lower Back', 'Upper Back', 'Traps', 'Forearms'
        ];
      }
    }),
});

