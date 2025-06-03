import React from 'react';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';

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
  const CheckedIcon = () => (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="currentColor"
        height="20"
        rx="6"
        width="20"
        x="2"
        y="2"
      />
      <path
        d="M7.55566 11.7222L10.5186 14.7778L16.4446 8.66669"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <FormControlLabel
      className="css-8sf69h"
      control={
        <Checkbox
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          className="css-jsuzhb"
          icon={<div style={{ width: 24, height: 24, border: '2px solid #ccc', borderRadius: 6 }} />}
          checkedIcon={<CheckedIcon />}
          // TODO: Add proper indeterminate icon
          // TODO: Add custom ripple effect
          // TODO: Implement proper focus styling
        />
      }
      label={
        <Typography 
          variant="subtitle2" 
          className="css-xdq8g8"
          // TODO: Add proper label styling for different states
        >
          {label}
        </Typography>
      }
      // TODO: Add proper ARIA labeling
      // TODO: Implement proper error state handling
    />
  );
};

