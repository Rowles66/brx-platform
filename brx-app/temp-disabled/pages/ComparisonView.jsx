import React, { useState } from 'react';
import { Box, Button, Stack, Typography, Slider } from '@mui/material';
import DashboardReplica from '../components/DashboardReplica';

const ComparisonView = () => {
  const [opacity, setOpacity] = useState(0.5);
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Controls */}
      <Box sx={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        zIndex: 9999, 
        bgcolor: 'white', 
        p: 2, 
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Stack spacing={2}>
          <Typography variant="h6">Visual Comparison</Typography>
          
          <Button 
            variant={showOverlay ? 'contained' : 'outlined'}
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {showOverlay ? 'Hide' : 'Show'} Reference
          </Button>
          
          {showOverlay && (
            <Box>
              <Typography gutterBottom>Reference Opacity</Typography>
              <Slider
                value={opacity}
                onChange={(e, value) => setOpacity(value)}
                min={0}
                max={1}
                step={0.1}
                marks
              />
            </Box>
          )}
        </Stack>
      </Box>

      {/* Your Component */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <DashboardReplica />
      </Box>

      {/* Reference Overlay */}
      {showOverlay && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          opacity: opacity,
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          <img 
            src="/reference-dashboard.png" 
            alt="Reference"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top left'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ComparisonView;

