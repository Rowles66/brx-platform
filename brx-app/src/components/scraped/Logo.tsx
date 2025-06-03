import React from 'react';
import Image from 'next/image';

interface LogoProps {
  maxHeight?: number;
  alt?: string;
}

/**
 * BRX Performance logo component
 * 
 * TODO: Design polish needed:
 * - Add dark mode variant
 * - Implement SVG version for better scaling
 * - Add loading placeholder
 * - Consider different sizes (small, medium, large)
 * - Add proper error handling for image load failures
 */
export const Logo: React.FC<LogoProps> = ({ 
  maxHeight = 80,
  alt = "BRX Performance Logo" 
}) => {
  return (
    <Image
      src="https://cdn.exercise.com/images/1154147/6f7da32581c89ca25d665dc3aae533e4f14fe3ef_original.svg"
      alt={alt}
      width={200}
      height={maxHeight}
      style={{ maxHeight: `${maxHeight}px` }}
      // Next/Image handles lazy loading automatically
    />
  );
};

