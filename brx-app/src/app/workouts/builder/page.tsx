'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { WorkoutDetails } from '@/components/workouts/WorkoutDetails';
import { ExerciseSelector } from '@/components/workouts/ExerciseSelector';
import { WorkoutPreview } from '@/components/workouts/WorkoutPreview';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { 
  useRealTimeWorkoutValidation, 
  getFieldError,
  getFieldErrorMessage,
  getSummaryErrors,
  hasFieldError
} from '@/utils/validation';
import { ValidationStatus } from '@/components/ui/ValidationStatus';
import { ValidationProgress } from '@/components/ui/ValidationProgress';

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  notes: string;
}

interface WorkoutData {
  name: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedDuration: number;
  exercises: WorkoutExercise[];
}

export default function WorkoutBuilderPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutData>({
    name: '',
    description: '',
    type: 'strength',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    exercises: [],
  });

  // Add validation with the validation hook
  const { validationResult } = useRealTimeWorkoutValidation(workout, {
    debounceMs: 300,
    validatePartial: true
  });

  // Create workout mutation with tRPC
  const createWorkoutMutation = api.workouts.create.useMutation({
    onSuccess: (data) => {
      toast.success('Workout created successfully!');
      console.log('Created workout:', data);
      // Navigate to workouts list after successful creation
      router.push('/workouts');
    },
    onError: (error) => {
      toast.error(`Failed to create workout: ${error.message}`);
      console.error('Error creating workout:', error);
    }
  });

  const handleWorkoutChange = (updates: Partial<WorkoutData>) => {
    setWorkout(prev => ({ ...prev, ...updates }));
  };

  const handleExerciseAdd = (exerciseId: string) => {
    const newExercise: WorkoutExercise = {
      id: Math.random().toString(),
      exerciseId,
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
      notes: '',
    };

    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const handleSaveWorkout = async () => {
    // Use our validation system instead of manual validation
    if (!validationResult.isValid) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      // Map workout data to match the tRPC input schema
      // Include type and difficulty as metadata in the description field
      const metadata = `Type: ${workout.type}, Difficulty: ${workout.difficulty}`;
      const description = workout.description 
        ? `${workout.description}\n\n${metadata}`
        : metadata;

      createWorkoutMutation.mutate({
        name: workout.name,
        description: description,
        duration: workout.estimatedDuration, // Map estimatedDuration to duration
        exercises: workout.exercises.map(exercise => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          rest: exercise.restTime, // Map restTime to rest
          notes: exercise.notes,
        }))
      });
    } catch (error) {
      console.error('Error preparing workout data:', error);
      toast.error('Failed to prepare workout data');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Workout Builder</h1>
            {validationResult && <ValidationStatus validationResult={validationResult} />}
          </div>
          <button
            onClick={handleSaveWorkout}
            disabled={createWorkoutMutation.isLoading}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 ${
              createWorkoutMutation.isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {createWorkoutMutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Workout</span>
            )}
          </button>
        </div>

        {/* Show validation error summary */}
        {!validationResult.isValid && validationResult.errors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {getSummaryErrors(validationResult).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Show error message if there was an error from the mutation */}
        {createWorkoutMutation.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {createWorkoutMutation.error.message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress indicator */}
        {validationResult && (
          <div className="mb-6 max-w-md">
            <ValidationProgress 
              validationResult={validationResult} 
              totalFields={6 + workout.exercises.length * 4} // Name, duration, type, difficulty, description + exercises (4 fields per exercise)
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          <div className="lg:col-span-2 space-y-6">
            <WorkoutDetails
              workout={workout}
              onChange={handleWorkoutChange}
              validationResult={validationResult}
            />
            <ExerciseSelector
              onExerciseSelect={handleExerciseAdd}
              selectedExercises={workout.exercises.map(e => e.exerciseId)}
            />
          </div>
          <div className="lg:col-span-1">
            <WorkoutPreview
              workout={workout}
              onWorkoutChange={handleWorkoutChange}
              validationResult={validationResult}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

