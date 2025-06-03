import React from 'react';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

/**
 * Authentication layout component with branded background and logo
 * 
 * TODO: Design polish needed:
 * - Optimize background gradients for better performance
 * - Make background responsive for mobile devices
 * - Add proper loading states
 * - Consider adding animation variants
 * - Improve accessibility with proper ARIA labels
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, maxWidth = 'sm' }) => {
  const maxWidthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-xl'
  }[maxWidth];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-400"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <Logo />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className={`w-full ${maxWidthClass}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

