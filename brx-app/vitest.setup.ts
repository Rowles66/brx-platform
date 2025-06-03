import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement('img', {
      ...props,
      src: props.src || '',
      alt: props.alt || '',
    });
  },
}));

