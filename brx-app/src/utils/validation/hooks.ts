import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { workoutSchema, exerciseSchema } from './schemas';
import type { ValidationResult, ValidationOptions, ValidationError } from './types';

/**
 * Hook for validating workout data
 */
export function useWorkoutValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  const validateWorkout = useCallback((data: unknown, options?: ValidationOptions) => {
    try {
      // If validatePartial is true, we'll only validate the fields that are present
      const schema = options?.validatePartial 
        ? workoutSchema.partial() 
        : workoutSchema;

      // Parse data with the schema
      schema.parse(data);
      setValidationResult({ isValid: true, errors: [], warnings: [] });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors
          .filter(err => {
            // Skip validation for ignored fields
            if (options?.ignoreFields && options.ignoreFields.length > 0) {
              return !options.ignoreFields.some(field => 
                err.path.join('.').startsWith(field)
              );
            }
            return true;
          })
          .map(err => ({
            path: err.path,
            message: err.message,
            type: 'error' as const,
            field: err.path.join('.'),
          }));
        
        setValidationResult({ 
          isValid: errors.length === 0,
          errors, 
          warnings: [] 
        });
      }
      return false;
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationResult({ isValid: true, errors: [], warnings: [] });
  }, []);

  return {
    validationResult,
    validateWorkout,
    resetValidation,
  };
}

/**
 * Hook for validating exercise data
 */
export function useExerciseValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  const validateExercise = useCallback((data: unknown, options?: ValidationOptions) => {
    try {
      // If validatePartial is true, we'll only validate the fields that are present
      const schema = options?.validatePartial 
        ? exerciseSchema.partial() 
        : exerciseSchema;

      // Parse data with the schema
      schema.parse(data);
      setValidationResult({ isValid: true, errors: [], warnings: [] });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors
          .filter(err => {
            // Skip validation for ignored fields
            if (options?.ignoreFields && options.ignoreFields.length > 0) {
              return !options.ignoreFields.some(field => 
                err.path.join('.').startsWith(field)
              );
            }
            return true;
          })
          .map(err => ({
            path: err.path,
            message: err.message,
            type: 'error' as const,
            field: err.path.join('.'),
          }));
        
        setValidationResult({ 
          isValid: errors.length === 0,
          errors, 
          warnings: [] 
        });
      }
      return false;
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationResult({ isValid: true, errors: [], warnings: [] });
  }, []);

  return {
    validationResult,
    validateExercise,
    resetValidation,
  };
}

/**
 * Hook for real-time validation of workout data as it changes
 */
export function useRealTimeWorkoutValidation(
  workout: unknown, 
  options?: ValidationOptions & { debounceMs?: number }
) {
  const { 
    validationResult, 
    validateWorkout, 
    resetValidation 
  } = useWorkoutValidation();
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      validateWorkout(workout, options);
    }, options?.debounceMs || 300);
    
    return () => clearTimeout(debounceTimer);
  }, [workout, validateWorkout, options]);

  return {
    validationResult,
    resetValidation,
  };
}

