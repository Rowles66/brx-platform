import React from 'react';

interface CheckboxFieldProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

/**
 * Custom checkbox field with BRX styling
 * 
 * TODO: Design polish needed:
 * - Add custom checkbox icon design
 * - Implement indeterminate state
 * - Add proper focus ring styling
 * - Consider adding checkbox group component
 * - Add proper error state styling
 * - Implement custom animation timing
 * - Add proper keyboard navigation
 */
export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  required = false
}) => {
  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-700 select-none">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

