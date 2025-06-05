import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardReplica from '../components/DashboardReplica';

// Create a theme that matches the original design
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Adjust this to match the blue from your screenshots
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

const DashboardDemo = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardReplica />
    </ThemeProvider>
  );
};

export default DashboardDemo;

