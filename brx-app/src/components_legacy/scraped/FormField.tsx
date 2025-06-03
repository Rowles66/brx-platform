import React from 'react';
import { TextField, FormLabel } from '@mui/material';

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
    <FormLabel className="css-12h42w9">
      <TextField
        name={name}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        required={required}
        autoComplete={autoComplete}
        fullWidth
        variant="outlined"
        className="css-1vbfw84"
        InputProps={{
          endAdornment,
          className: endAdornment ? "css-1iprngn" : "css-vzta76"
        }}
        InputLabelProps={{
          className: "css-5qubf5"
        }}
        // TODO: Add proper ARIA labels and descriptions
        // TODO: Implement custom validation logic
        // TODO: Add proper keyboard navigation
      />
    </FormLabel>
  );
};

