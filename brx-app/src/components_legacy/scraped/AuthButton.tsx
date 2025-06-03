import React from 'react';
import { Button, CircularProgress } from '@mui/material';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

/**
 * Authentication button component with loading states
 * 
 * TODO: Design polish needed:
 * - Add custom button hover effects
 * - Implement proper loading spinner design
 * - Add button size variants (small, medium, large)
 * - Consider adding icon support
 * - Add proper focus ring styling
 * - Implement custom ripple animation
 * - Add button group support
 * - Add proper disabled state styling
 */
export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'contained',
  color = 'primary',
  fullWidth = true
}) => {
  const isDisabled = disabled || loading;

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      className="css-2ke0i9"
      startIcon={loading ? (
        <CircularProgress 
          size={16} 
          color="inherit"
          // TODO: Add custom spinner design
        />
      ) : undefined}
      // TODO: Add proper ARIA attributes for loading state
      // TODO: Implement proper focus management
      // TODO: Add custom ripple effect
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

