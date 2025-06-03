import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc'

// Define exercise types
type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
};

// Mock workout data
const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body Strength',
    date: new Date('2025-05-31'),
    duration: 45,
    status: 'scheduled',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 185 },
      { name: 'Dumbbell Row', sets: 3, reps: 10, weight: 65 },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 40 },
      { name: 'Bicep Curls', sets: 3, reps: 15, weight: 30 },
    ] as Exercise[],
  },
  {
    id: '2',
    name: 'Lower Body Power',
    date: new Date('2025-05-30'),
    duration: 60,
    status: 'completed',
    exercises: [
      { name: 'Squats', sets: 5, reps: 5, weight: 275 },
      { name: 'Romanian Deadlifts', sets: 4, reps: 8, weight: 225 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 450 },
      { name: 'Calf Raises', sets: 4, reps: 20, weight: 180 },
    ] as Exercise[],
  },
  {
    id: '3',
    name: 'HIIT Cardio',
    date: new Date('2025-05-29'),
    duration: 30,
    status: 'completed',
    exercises: [
      { name: 'Sprint Intervals', sets: 8, reps: 1, duration: 30 },
      { name: 'Box Jumps', sets: 4, reps: 10 },
      { name: 'Battle Ropes', sets: 4, reps: 1, duration: 45 },
      { name: 'Burpees', sets: 3, reps: 15 },
    ] as Exercise[],
  },
]

const mockExercises = [
  { id: '1', name: 'Bench Press', category: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Squats', category: 'Legs', equipment: 'Barbell' },
  { id: '3', name: 'Deadlifts', category: 'Back', equipment: 'Barbell' },
  { id: '4', name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight' },
  { id: '5', name: 'Dips', category: 'Chest', equipment: 'Bodyweight' },
]

const mockWorkoutPlans = [
  {
    id: '1',
    name: '12-Week Strength Program',
    duration: '12 weeks',
    goal: 'Build Strength',
    daysPerWeek: 4,
    difficulty: 'Intermediate',
  },
  {
    id: '2',
    name: 'Summer Shred',
    duration: '8 weeks',
    goal: 'Fat Loss',
    daysPerWeek: 5,
    difficulty: 'Advanced',
  },
  {
    id: '3',
    name: 'Beginner Foundation',
    duration: '6 weeks',
    goal: 'General Fitness',
    daysPerWeek: 3,
    difficulty: 'Beginner',
  },
]

export const workoutRouter = createTRPCRouter({
  getWorkouts: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        perPage: z.number().default(10),
        status: z.enum(['all', 'scheduled', 'completed', 'missed']).optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      const page = input?.page || 1
      const perPage = input?.perPage || 10
      const status = input?.status || 'all'

      let filteredWorkouts = mockWorkouts
      if (status !== 'all') {
        filteredWorkouts = mockWorkouts.filter(w => w.status === status)
      }

      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedWorkouts = filteredWorkouts.slice(startIndex, endIndex)

      return {
        workouts: paginatedWorkouts,
        total: filteredWorkouts.length,
        page,
        perPage,
        totalPages: Math.ceil(filteredWorkouts.length / perPage),
      }
    }),

  getWorkout: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const workout = mockWorkouts.find(w => w.id === input.id)
      if (!workout) {
        throw new Error('Workout not found')
      }
      return workout
    }),

  getExercises: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        equipment: z.string().optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      let filteredExercises = mockExercises

      if (input?.search) {
        filteredExercises = filteredExercises.filter(e =>
          e.name.toLowerCase().includes(input.search!.toLowerCase())
        )
      }

      if (input?.category) {
        filteredExercises = filteredExercises.filter(e => e.category === input.category)
      }

      if (input?.equipment) {
        filteredExercises = filteredExercises.filter(e => e.equipment === input.equipment)
      }

      return filteredExercises
    }),

  getWorkoutPlans: protectedProcedure
    .query(async ({ ctx }) => {
      return mockWorkoutPlans
    }),

  completeWorkout: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const workout = mockWorkouts.find(w => w.id === input.workoutId)
      if (!workout) {
        throw new Error('Workout not found')
      }

      workout.status = 'completed'
      
      return {
        success: true,
        workout,
      }
    }),
}) 