import { CheckCircle, AlertCircle } from 'lucide-react';
import { ValidationResult } from '@/utils/validation';

interface ValidationStatusProps {
  validationResult: ValidationResult;
  showSuccess?: boolean;
}

export function ValidationStatus({ validationResult, showSuccess = true }: ValidationStatusProps) {
  if (validationResult.isValid && showSuccess) {
    return (
      <div className="flex items-center text-green-500 text-sm">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span>All fields valid</span>
      </div>
    );
  }

  if (!validationResult.isValid) {
    return (
      <div className="flex items-center text-red-500 text-sm">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{validationResult.errors.length} error(s) to fix</span>
      </div>
    );
  }

  return null;
}

