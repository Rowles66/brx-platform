import React, { useState } from 'react';
import { FormField } from './FormField';

interface PasswordFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoComplete?: string;
}

/**
 * Password field with show/hide toggle functionality
 * 
 * TODO: Design polish needed:
 * - Add password strength indicator
 * - Implement custom eye icon design
 * - Add proper ARIA announcements for visibility toggle
 * - Consider adding password generation feature
 * - Add proper focus management for toggle button
 * - Implement keyboard shortcuts for toggle
 * - Add proper contrast for toggle button
 */
export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  helperText,
  required = false,
  autoComplete = 'current-password'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const EyeIcon = () => (
    <svg
      className="h-5 w-5 text-gray-400 hover:text-gray-600"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {showPassword ? (
        <path
          fillRule="evenodd"
          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
          clipRule="evenodd"
        />
      ) : (
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      )}
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 000 3.946 6.012 6.012 0 019.336 0 6.012 6.012 0 000-3.946 6.012 6.012 0 00-9.336 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <FormField
      name={name}
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      autoComplete={autoComplete}
      endAdornment={
        <button
          type="button"
          onClick={handleTogglePassword}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <EyeIcon />
        </button>
      }
    />
  );
};

