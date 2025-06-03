import { CheckCircle, AlertCircle } from 'lucide-react';
import { ValidationResult } from '@/utils/validation';
import { hasFieldError, getFieldErrorMessage } from '@/utils/validation';

interface ValidationFieldStatusProps {
  validationResult: ValidationResult;
  field: string | string[];
  touched?: boolean;
}

export function ValidationFieldStatus({ 
  validationResult, 
  field, 
  touched = true 
}: ValidationFieldStatusProps) {
  const error = hasFieldError(validationResult, field);
  const errorMessage = getFieldErrorMessage(validationResult, field);
  
  // Only show success if the field has been touched and validation is running
  const showSuccess = touched && validationResult && !error;

  if (showSuccess) {
    return (
      <div className="flex items-center text-green-500 text-xs mt-1">
        <CheckCircle className="h-3 w-3 mr-1" />
        <span>Valid</span>
      </div>
    );
  }

  if (error && errorMessage) {
    return (
      <div className="flex items-center text-red-500 text-xs mt-1">
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>{errorMessage}</span>
      </div>
    );
  }

  return null;
}

