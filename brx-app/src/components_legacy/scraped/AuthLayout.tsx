import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

/**
 * Authentication layout component with branded background and logo
 * 
 * TODO: Design polish needed:
 * - Optimize SVG background for better performance
 * - Make background responsive for mobile devices
 * - Add proper loading states
 * - Consider adding animation variants
 * - Improve accessibility with proper ARIA labels
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, maxWidth = 'sm' }) => {
  return (
    <Box className="css-1ato6fa">
      <Box className="css-8atqhb">
        {/* Background SVG - TODO: Extract to separate component and optimize */}
        <div className="css-dwjtvr">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1920"
            height="502"
            fill="none"
            viewBox="0 0 1920 502"
            style={{ transition: '1s' }}
          >
            <g clipPath="url(#clip0_11776_128604)" opacity="0.8">
              <g filter="url(#filter0_f_11776_128604)" opacity="0.3">
                <path
                  fill="url(#paint0_linear_11776_128604)"
                  fillRule="evenodd"
                  d="M1516.45 318.144l-62.1 98.231-386.64-457.292 62.1-98.232 386.64 457.293z"
                  clipRule="evenodd"
                />
              </g>
              {/* Additional gradient paths... */}
            </g>
            <defs>
              {/* Gradient definitions - TODO: Extract to separate constants */}
              <linearGradient
                id="paint0_linear_11776_128604"
                x1="1099.27"
                x2="1468.23"
                y1="-113.525"
                y2="326.183"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fe3f00" style={{ transition: '1s' }} />
                <stop offset="1" stopColor="#fe3f00" stopOpacity="0" style={{ transition: '1s' }} />
              </linearGradient>
              <clipPath id="clip0_11776_128604">
                <path fill="#fff" d="M0 0H1920V502H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <div className="css-e3ogfx">
          <Box className="css-ua6qkm">
            <Container maxWidth="lg" className="css-1yct6bq">
              <Stack className="css-14rgmkt">
                <Logo />
              </Stack>
            </Container>
            <Container maxWidth={maxWidth} className="css-qmchvv">
              {children}
            </Container>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

