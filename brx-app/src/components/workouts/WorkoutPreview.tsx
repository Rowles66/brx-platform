'use client';

import { useState } from 'react';
import { Trash2, ChevronUp, ChevronDown, Edit, X, AlertCircle, CheckCircle } from 'lucide-react';

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
  exercises: WorkoutExercise[];
  estimatedDuration: number;
}

interface WorkoutPreviewProps {
  workout: WorkoutData;
  onWorkoutChange: (workout: WorkoutData) => void;
  validationResult?: any;
}

export function WorkoutPreview({ workout, onWorkoutChange, validationResult }: WorkoutPreviewProps) {
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  const handleExerciseUpdate = (id: string, updates: Partial<WorkoutExercise>) => {
    const updatedExercises = workout.exercises.map(ex => 
      ex.id === id ? { ...ex, ...updates } : ex
    );
    onWorkoutChange({ ...workout, exercises: updatedExercises });
  };

  const handleExerciseRemove = (id: string) => {
    const updatedExercises = workout.exercises.filter(ex => ex.id !== id);
    onWorkoutChange({ ...workout, exercises: updatedExercises });
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workout.exercises.length) return;
    
    const updatedExercises = [...workout.exercises];
    [updatedExercises[index], updatedExercises[newIndex]] = [updatedExercises[newIndex], updatedExercises[index]];
    onWorkoutChange({ ...workout, exercises: updatedExercises });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Workout Preview</h2>
      
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
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Exercise #{index + 1}</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Sets: {exercise.sets}</div>
                    <div>Reps: {exercise.reps}</div>
                    <div>Weight: {exercise.weight} lbs</div>
                    <div>Rest: {exercise.restTime}s</div>
                  </div>
                  {exercise.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      Notes: {exercise.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveExercise(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveExercise(index, 'down')}
                      disabled={index === workout.exercises.length - 1}
                      className={`p-1 ${index === workout.exercises.length - 1 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => setEditingExerciseId(editingExerciseId === exercise.id ? null : exercise.id)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleExerciseRemove(exercise.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {editingExerciseId === exercise.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sets</label>
                      <input 
                        type="number" 
                        value={exercise.sets}
                        onChange={(e) => handleExerciseUpdate(exercise.id, { sets: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                      <input 
                        type="number" 
                        value={exercise.reps}
                        onChange={(e) => handleExerciseUpdate(exercise.id, { reps: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Weight (lbs)</label>
                      <input 
                        type="number" 
                        value={exercise.weight}
                        onChange={(e) => handleExerciseUpdate(exercise.id, { weight: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rest (seconds)</label>
                      <input 
                        type="number" 
                        value={exercise.restTime}
                        onChange={(e) => handleExerciseUpdate(exercise.id, { restTime: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                    <textarea 
                      value={exercise.notes}
                      onChange={(e) => handleExerciseUpdate(exercise.id, { notes: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Add any notes for this exercise..."
                    />
                  </div>
                  <button
                    onClick={() => setEditingExerciseId(null)}
                    className="w-full py-2 mt-3 text-white text-sm rounded-md transition-colors"
                    style={{ backgroundColor: '#fe3f00' }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {workout.exercises.length > 0 && (
        <div className="mt-6 border-t pt-4">
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