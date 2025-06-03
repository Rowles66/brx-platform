import React, { useState } from 'react';
import { Typography, Link } from '@mui/material';
import { AuthLayout } from './AuthLayout';
import { AuthCard } from './AuthCard';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { AuthButton } from './AuthButton';

interface SignUpFormData {
  email: string;
  name: string;
  password: string;
}

interface SignUpFormProps {
  onSubmit?: (data: SignUpFormData) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Complete sign-up form component extracted from BRX Performance
 * 
 * TODO: Design polish needed:
 * - Add form validation with proper error messages
 * - Implement password strength indicator
 * - Add email validation and availability check
 * - Add proper form submission handling
 * - Implement terms of service modal
 * - Add privacy policy modal
 * - Add proper loading states for all interactions
 * - Add form analytics tracking
 * - Consider adding CAPTCHA integration
 */
export const SignUpForm: React.FC<SignUpFormProps> = ({ 
  onSubmit,
  loading = false,
  error 
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    name: '',
    password: ''
  });

  const handleInputChange = (field: keyof SignUpFormData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  const isFormValid = formData.email && formData.name && formData.password;

  return (
    <AuthLayout>
      <AuthCard 
        title="Sign Up" 
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
          
          <FormField
            name="name"
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            required
            autoComplete="name"
          />
          
          <PasswordField
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            autoComplete="new-password"
          />
          
          <AuthButton
            type="submit"
            disabled={!isFormValid}
            loading={loading}
          >
            Sign Up
          </AuthButton>
        </form>
        
        <Typography 
          variant="body1" 
          align="center" 
          className="css-1ptfgyl"
          sx={{ '--Typography-textAlign': 'center' }}
        >
          Already have an account?
          <br />
          <Link 
            href="https://online.brxperformance.com/ex4/login"
            className="css-ryndpl"
            // TODO: Add proper hover effects
          >
            Sign in
          </Link>
        </Typography>
        
        <Typography 
          variant="body2" 
          align="center" 
          className="css-4fsjkc"
          sx={{ '--Typography-textAlign': 'center' }}
        >
          By signing up you agree to the{' '}
          <Link 
            href="https://online.brxperformance.com/terms-of-service"
            target="_blank"
            className="css-ryndpl"
            // TODO: Add proper hover effects
            // TODO: Implement modal instead of external link
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link 
            href="https://online.brxperformance.com/privacy-policy"
            target="_blank"
            className="css-ryndpl"
            // TODO: Add proper hover effects
            // TODO: Implement modal instead of external link
          >
            Privacy Policy
          </Link>
          .
        </Typography>
      </AuthCard>
    </AuthLayout>
  );
};

