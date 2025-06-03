import React from 'react';

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
  error?: string;
  showError?: boolean;
}

/**
 * Authentication card component with title and error handling
 * 
 * TODO: Design polish needed:
 * - Add card hover effects
 * - Implement loading state overlay
 * - Add proper focus management
 * - Consider adding success state styling
 * - Improve error message animation
 * - Add card shadow customization
 */
export const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  children, 
  error, 
  showError = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {title}
        </h1>
      </div>
      
      {/* Error Alert */}
      {showError && error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md animate-in slide-in-from-top duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

