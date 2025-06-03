import React from 'react';

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
  
  const baseClasses = "px-4 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const widthClasses = fullWidth ? "w-full" : "";
  
  let variantClasses = "";
  if (variant === 'contained') {
    variantClasses = color === 'primary' 
      ? "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 disabled:bg-gray-300 disabled:text-gray-500" 
      : "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300 disabled:text-gray-500";
  } else if (variant === 'outlined') {
    variantClasses = color === 'primary'
      ? "bg-white text-orange-600 border border-orange-600 hover:bg-orange-50 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
      : "bg-white text-gray-600 border border-gray-600 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300";
  } else {
    variantClasses = color === 'primary'
      ? "text-orange-600 hover:bg-orange-50 focus:ring-orange-500 disabled:text-gray-400"
      : "text-gray-600 hover:bg-gray-50 focus:ring-gray-500 disabled:text-gray-400";
  }
  
  const disabledClasses = isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${widthClasses} ${variantClasses} ${disabledClasses}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span>{loading ? 'Loading...' : children}</span>
      </div>
    </button>
  );
};

