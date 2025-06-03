import React, { useState } from 'react';
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
          
          <div className="flex justify-between items-center mb-6">
            <CheckboxField
              name="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleInputChange('rememberMe')}
            />
            
            <a 
              href="https://online.brxperformance.com/ex4/reset-password/"
              className="text-sm text-orange-600 hover:text-orange-700 focus:outline-none focus:underline"
            >
              Forgot password?
            </a>
          </div>
          
          <AuthButton
            type="submit"
            disabled={!isFormValid}
            loading={loading}
          >
            Sign In
          </AuthButton>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don&apos;t have an account?
            <br />
            <a 
              href="https://online.brxperformance.com/ex4/sign-up"
              className="text-orange-600 hover:text-orange-700 focus:outline-none focus:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

