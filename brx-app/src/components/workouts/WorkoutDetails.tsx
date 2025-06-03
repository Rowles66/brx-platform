'use client';

import { ValidationResult, getFieldErrorMessage, hasFieldError } from '@/utils/validation';
import { ValidationFieldStatus } from '@/components/ui/ValidationFieldStatus';
import { CheckCircle } from 'lucide-react';

interface Workout {
  name: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedDuration: number;
}

interface WorkoutDetailsProps {
  workout: Workout;
  onChange: (updates: Partial<Workout>) => void;
  validationResult?: ValidationResult;
}

export function WorkoutDetails({ workout, onChange, validationResult }: WorkoutDetailsProps) {
  const workoutTypes = [
    { value: 'strength', label: 'Strength Training' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Workout Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Workout Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={workout.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={`w-full p-2 pr-8 border rounded-md ${
                validationResult && hasFieldError(validationResult, 'name')
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : validationResult && workout.name.length > 0 && !hasFieldError(validationResult, 'name')
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter workout name"
            />
            {validationResult && workout.name.length > 0 && !hasFieldError(validationResult, 'name') && (
              <CheckCircle className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
            )}
          </div>
          {validationResult && (
            <ValidationFieldStatus
              validationResult={validationResult}
              field="name"
              touched={workout.name.length > 0}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={workout.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Describe the workout"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={workout.type}
              onChange={(e) => onChange({ type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {workoutTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={workout.difficulty}
              onChange={(e) => onChange({ difficulty: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {difficultyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <div className="relative">
              <input
                type="number"
                value={workout.estimatedDuration}
                onChange={(e) => onChange({ estimatedDuration: parseInt(e.target.value) })}
                className={`w-full p-2 pr-8 border rounded-md ${
                  validationResult && hasFieldError(validationResult, 'estimatedDuration')
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : validationResult && !hasFieldError(validationResult, 'estimatedDuration')
                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300'
                }`}
                min="1"
                step="1"
              />
              {validationResult && !hasFieldError(validationResult, 'estimatedDuration') && (
                <CheckCircle className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
              )}
            </div>
            {validationResult && (
              <ValidationFieldStatus
                validationResult={validationResult}
                field="estimatedDuration"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

