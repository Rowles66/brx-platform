import type { ValidationError, ValidationResult } from './types';

/**
 * Checks if a field has an error in the validation result
 */
export function hasFieldError(
  result: ValidationResult,
  field: string | string[]
): boolean {
  const fieldPath = Array.isArray(field) ? field : [field];
  return result.errors.some(error => 
    fieldPathMatches(error.path, fieldPath)
  );
}

/**
 * Gets the error for a specific field from the validation result
 */
export function getFieldError(
  result: ValidationResult,
  field: string | string[]
): ValidationError | undefined {
  const fieldPath = Array.isArray(field) ? field : [field];
  return result.errors.find(error => 
    fieldPathMatches(error.path, fieldPath)
  );
}

/**
 * Gets the error message for a specific field from the validation result
 */
export function getFieldErrorMessage(
  result: ValidationResult,
  field: string | string[]
): string | undefined {
  const error = getFieldError(result, field);
  return error?.message;
}

/**
 * Gets all error messages from the validation result
 */
export function getSummaryErrors(result: ValidationResult): string[] {
  return result.errors.map(error => error.message);
}

/**
 * Helper function to check if a field path matches another field path
 */
function fieldPathMatches(errorPath: string[], fieldPath: string[]): boolean {
  // Exact match
  if (errorPath.length === fieldPath.length) {
    return errorPath.every((segment, i) => segment === fieldPath[i]);
  }
  
  // Check if error path is a sub-path of the field path
  if (errorPath.length > fieldPath.length) {
    return errorPath.slice(0, fieldPath.length).every((segment, i) => segment === fieldPath[i]);
  }
  
  return false;
}

/**
 * Gets all errors for fields within an array path
 * Useful for getting all errors for exercises in a workout
 */
export function getArrayFieldErrors(
  result: ValidationResult,
  arrayPath: string | string[]
): ValidationError[] {
  const path = Array.isArray(arrayPath) ? arrayPath : [arrayPath];
  return result.errors.filter(error => 
    error.path.length > path.length && 
    path.every((segment, i) => error.path[i] === segment)
  );
}

/**
 * Groups errors by a specific field in the path
 * Useful for grouping exercise errors by exercise index
 */
export function groupErrorsByField(
  result: ValidationResult,
  groupByIndex: number
): Record<string, ValidationError[]> {
  const grouped: Record<string, ValidationError[]> = {};
  
  result.errors.forEach(error => {
    if (error.path.length > groupByIndex) {
      const key = error.path[groupByIndex];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(error);
    }
  });
  
  return grouped;
}

