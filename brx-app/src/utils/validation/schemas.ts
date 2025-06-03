import { z } from 'zod';
import { VALIDATION_LIMITS, ERROR_MESSAGES } from './constants';

const { WORKOUT, EXERCISE } = VALIDATION_LIMITS;

export const exerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  sets: z.number()
    .int()
    .min(EXERCISE.SETS_MIN, { message: ERROR_MESSAGES.EXERCISE.SETS_RANGE })
    .max(EXERCISE.SETS_MAX, { message: ERROR_MESSAGES.EXERCISE.SETS_RANGE }),
  reps: z.number()
    .int()
    .min(EXERCISE.REPS_MIN, { message: ERROR_MESSAGES.EXERCISE.REPS_RANGE })
    .max(EXERCISE.REPS_MAX, { message: ERROR_MESSAGES.EXERCISE.REPS_RANGE }),
  weight: z.number()
    .min(EXERCISE.WEIGHT_MIN, { message: ERROR_MESSAGES.EXERCISE.WEIGHT_RANGE })
    .max(EXERCISE.WEIGHT_MAX, { message: ERROR_MESSAGES.EXERCISE.WEIGHT_RANGE }),
  restTime: z.number()
    .min(EXERCISE.REST_MIN, { message: ERROR_MESSAGES.EXERCISE.REST_RANGE })
    .max(EXERCISE.REST_MAX, { message: ERROR_MESSAGES.EXERCISE.REST_RANGE }),
  notes: z.string().optional(),
});

export const workoutSchema = z.object({
  name: z.string()
    .min(WORKOUT.NAME_MIN, { message: ERROR_MESSAGES.WORKOUT.NAME_LENGTH })
    .max(WORKOUT.NAME_MAX, { message: ERROR_MESSAGES.WORKOUT.NAME_LENGTH }),
  description: z.string().optional(),
  type: z.string(),
  difficulty: z.string(),
  estimatedDuration: z.number()
    .min(WORKOUT.DURATION_MIN, { message: ERROR_MESSAGES.WORKOUT.DURATION_RANGE })
    .max(WORKOUT.DURATION_MAX, { message: ERROR_MESSAGES.WORKOUT.DURATION_RANGE }),
  exercises: z.array(exerciseSchema)
    .min(1, { message: ERROR_MESSAGES.WORKOUT.NO_EXERCISES }),
});

export type WorkoutSchema = z.infer<typeof workoutSchema>;
export type ExerciseSchema = z.infer<typeof exerciseSchema>;

