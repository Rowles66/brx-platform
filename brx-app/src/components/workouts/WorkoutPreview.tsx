'use client';

import { useState } from 'react';
import { Trash2, ChevronUp, ChevronDown, Edit, X, AlertCircle, CheckCircle } from 'lucide-react';
import { ValidationResult, getFieldErrorMessage, hasFieldError, getArrayFieldErrors } from '@/utils/validation';
import { ValidationFieldStatus } from '@/components/ui/ValidationFieldStatus';

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

interface WorkoutPreviewProps {
  workout: WorkoutData;
  onWorkoutChange: (updates: Partial<WorkoutData>) => void;
  validationResult?: ValidationResult;
}

export function WorkoutPreview({ workout, onWorkoutChange, validationResult }: WorkoutPreviewProps) {
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  
  // Mock data for exercise names - in a real app, this would come from API
  const exerciseNames: Record<string, string> = {
    '1': 'Barbell Squat',
    '2': 'Bench Press',
    '3': 'Deadlift',
    '4': 'Pull-up',
    '5': 'Dumbbell Curl',
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workout.exercises.length) return;
    
    const newExercises = [...workout.exercises];
    const [moved] = newExercises.splice(index, 1);
    newExercises.splice(newIndex, 0, moved);
    
    onWorkoutChange({ exercises: newExercises });
  };

  const handleExerciseRemove = (exerciseId: string) => {
    onWorkoutChange({
      exercises: workout.exercises.filter(exercise => exercise.id !== exerciseId)
    });
  };

  const handleExerciseUpdate = (id: string, updates: Partial<WorkoutExercise>) => {
    onWorkoutChange({
      exercises: workout.exercises.map(exercise => 
        exercise.id === id ? { ...exercise, ...updates } : exercise
      )
    });
  };

  // Helper to check for exercise validation errors
  const hasExerciseError = (exerciseIndex: number, field: string) => {
    if (!validationResult) return false;
    return hasFieldError(validationResult, ['exercises', exerciseIndex.toString(), field]);
  };

  // Get error message for a specific exercise field
  const getExerciseErrorMessage = (exerciseIndex: number, field: string) => {
    if (!validationResult) return undefined;
    return getFieldErrorMessage(validationResult, ['exercises', exerciseIndex.toString(), field]);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Workout Preview</h2>
        {validationResult && getArrayFieldErrors(validationResult, 'exercises').length > 0 ? (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Fix exercise errors</span>
          </div>
        ) : workout.exercises.length > 0 && validationResult && validationResult.isValid ? (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>All exercises valid</span>
          </div>
        ) : null}
      </div>
      
      {workout.exercises.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No exercises added yet.</p>
          <p className="text-sm mt-2">Use the exercise selector to add exercises to your workout.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="border border-gray-200 rounded-md p-3"
            >
              {editingExerciseId === exercise.id ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{exerciseNames[exercise.exerciseId] || 'Exercise'}</h4>
                    <button 
                      onClick={() => setEditingExerciseId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sets</label>
                      <input 
                        type="number" 
                        value={exercise.sets}
                        onChange={(e) => handleExerciseUpdate(exercise.id, { sets: parseInt(e.target.value) || 0 })}
                        className="w-full p-1 text-sm border border-gray-300 rounded-md"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={exercise.reps}
                          onChange={(e) => handleExerciseUpdate(exercise.id, { reps: parseInt(e.target.value) || 0 })}
                          className={`w-full p-1 pr-6 text-sm border rounded-md ${
                            hasExerciseError(index, 'reps')
                              ? 'border-red-500'
                              : validationResult && !hasExerciseError(index, 'reps')
                              ? 'border-green-500'
                              : 'border-gray-300'
                          }`}
                          min="1"
                        />
                        {validationResult && !hasExerciseError(index, 'reps') && (
                          <CheckCircle className="absolute right-1 top-1.5 h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {validationResult && (
                        <ValidationFieldStatus
                          validationResult={validationResult}
                          field={['exercises', index.toString(), 'reps']}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={exercise.weight}
                          onChange={(e) => handleExerciseUpdate(exercise.id, { weight: parseInt(e.target.value) || 0 })}
                          className={`w-full p-1 pr-6 text-sm border rounded-md ${
                            hasExerciseError(index, 'weight')
                              ? 'border-red-500'
                              : validationResult && !hasExerciseError(index, 'weight')
                              ? 'border-green-500'
                              : 'border-gray-300'
                          }`}
                          min="0"
                        />
                        {validationResult && !hasExerciseError(index, 'weight') && (
                          <CheckCircle className="absolute right-1 top-1.5 h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {validationResult && (
                        <ValidationFieldStatus
                          validationResult={validationResult}
                          field={['exercises', index.toString(), 'weight']}
                        />
                      )}
      />
                        {validationResult && !hasExerciseError(index, 'sets') && (
                          <CheckCircle className="absolute right-1 top-1.5 h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {validationResult && (
                        <ValidationFieldStatus
                          validationResult={validationResult}
                          field={['exercises', index.toString(), 'sets']}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rest (sec)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={exercise.restTime}
                          onChange={(e) => handleExerciseUpdate(exercise.id, { restTime: parseInt(e.target.value) || 0 })}
                          className={`w-full p-1 pr-6 text-sm border rounded-md ${
                            hasExerciseError(index, 'restTime')
                              ? 'border-red-500'
                              : validationResult && !hasExerciseError(index, 'restTime')
                              ? 'border-green-500'
                              : 'border-gray-300'
                          }`}
                          min="0"
                        />
                        {validationResult && !hasExerciseError(index, 'restTime') && (
                          <CheckCircle className="absolute right-1 top-1.5 h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {validationResult && (
                        <ValidationFieldStatus
                          validationResult={validationResult}
                          field={['exercises', index.toString(), 'restTime']}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                    <textarea 
                      value={exercise.notes}
                      onChange={(e) => handleExerciseUpdate(exercise.id, { notes: e.target.value })}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => setEditingExerciseId(null)}
                    className="w-full py-1 mt-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex flex-col items-center mr-3">
                    <button
                      onClick={() => moveExercise(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      onClick={() => moveExercise(index, 'down')}
                      disabled={index === workout.exercises.length - 1}
                      className={`p-1 ${index === workout.exercises.length - 1 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{exerciseNames[exercise.exerciseId] || 'Exercise'}</h4>
                    <div className="flex items-center">
                      <p className={`text-sm ${validationResult && getArrayFieldErrors(validationResult, ['exercises', index.toString()]).length > 0 
                        ? 'text-red-500' 
                        : 'text-gray-500'}`}>
                        {exercise.sets} sets × {exercise.reps} reps{exercise.weight > 0 ? ` × ${exercise.weight}kg` : ''}
                      </p>
                      {validationResult && getArrayFieldErrors(validationResult, ['exercises', index.toString()]).length > 0 && (
                        <AlertCircle className="h-3 w-3 text-red-500 ml-1" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => setEditingExerciseId(exercise.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleExerciseRemove(exercise.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {workout.exercises.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Exercises:</span>
            <span>{workout.exercises.length}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="font-medium">Estimated Duration:</span>
            <span>{workout.estimatedDuration} minutes</span>
          </div>
        </div>
      )}
    </div>
  );
}

