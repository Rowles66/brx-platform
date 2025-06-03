import React from 'react';
import { Card, Stack, Typography, Alert, Collapse } from '@mui/material';

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
    <Card 
      className="css-1c7sxo3"
      elevation={1}
      sx={{
        '--Paper-shadow': 'var(--mui-shadows-1)',
        '--Paper-overlay': 'var(--mui-overlays-1)'
      }}
    >
      <Stack className="css-14rgmkt">
        <Typography 
          variant="h4" 
          className="css-1sr0jiv"
          component="h1"
          // TODO: Add proper heading hierarchy
        >
          {title}
        </Typography>
      </Stack>
      
      {/* Error Alert */}
      <Collapse 
        in={showError} 
        className="css-30ign1"
        // TODO: Add proper transition timing
      >
        <Alert 
          severity="error" 
          className="css-1traryl"
          sx={{
            '--Paper-shadow': 'var(--mui-shadows-0)',
            '--Paper-overlay': 'var(--mui-overlays-0)'
          }}
          // TODO: Add proper close button functionality
        >
          {error}
        </Alert>
      </Collapse>
      
      {children}
    </Card>
  );
};

