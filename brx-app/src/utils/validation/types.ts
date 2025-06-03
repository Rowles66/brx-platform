export type ValidationError = {
  path: string[];
  message: string;
  type: 'error' | 'warning';
  field: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
};

export type ValidationOptions = {
  validatePartial?: boolean;
  ignoreFields?: string[];
};

