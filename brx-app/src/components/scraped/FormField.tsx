import React from 'react';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoComplete?: string;
  endAdornment?: React.ReactNode;
}

/**
 * Reusable form field component matching BRX design system
 * 
 * TODO: Design polish needed:
 * - Add field validation states (success, warning)
 * - Implement floating label animations
 * - Add proper focus ring styling
 * - Consider adding field size variants
 * - Add proper error state styling
 * - Implement field grouping capabilities
 * - Add character count for relevant fields
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  required = false,
  autoComplete,
  endAdornment
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
            ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${endAdornment ? 'pr-10' : ''}
          `}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {helperText && (
        <p className={`mt-2 text-sm ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

