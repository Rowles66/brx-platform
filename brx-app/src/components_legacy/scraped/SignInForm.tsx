import React, { useState } from 'react';
import { Stack, Typography, Link } from '@mui/material';
import { AuthLayout } from './AuthLayout';
import { AuthCard } from './AuthCard';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { CheckboxField } from './CheckboxField';
import { AuthButton } from './AuthButton';

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignInFormProps {
  onSubmit?: (data: SignInFormData) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Complete sign-in form component extracted from BRX Performance
 * 
 * TODO: Design polish needed:
 * - Add form validation with proper error messages
 * - Implement proper focus management
 * - Add keyboard navigation support
 * - Consider adding social login options
 * - Add proper form submission handling
 * - Implement remember me functionality
 * - Add proper loading states for all interactions
 * - Add form analytics tracking
 */
export const SignInForm: React.FC<SignInFormProps> = ({ 
  onSubmit,
  loading = false,
  error 
}) => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: true
  });

  const handleInputChange = (field: keyof SignInFormData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  const isFormValid = formData.email && formData.password;

  return (
    <AuthLayout>
      <AuthCard 
        title="Sign In" 
        error={error}
        showError={!!error}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            autoComplete="email"
          />
          
          <PasswordField
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            autoComplete="current-password"
          />
          
          <Stack className="css-gvltw3" direction="row" justifyContent="space-between" alignItems="center">
            <CheckboxField
              name="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleInputChange('rememberMe')}
            />
            
            <Link 
              href="https://online.brxperformance.com/ex4/reset-password/"
              className="css-gfzonv"
              // TODO: Add proper hover effects
              // TODO: Implement proper focus styling
            >
              Forgot password?
            </Link>
          </Stack>
          
          <AuthButton
            type="submit"
            disabled={!isFormValid}
            loading={loading}
          >
            Sign In
          </AuthButton>
        </form>
        
        <Typography 
          variant="body1" 
          align="center" 
          className="css-1ptfgyl"
          sx={{ '--Typography-textAlign': 'center' }}
        >
          Don&apos;t have an account?
          <br />
          <Link 
            href="https://online.brxperformance.com/ex4/sign-up"
            className="css-ryndpl"
            // TODO: Add proper hover effects
          >
            Sign up
          </Link>
        </Typography>
      </AuthCard>
    </AuthLayout>
  );
};

