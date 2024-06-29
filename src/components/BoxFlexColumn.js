import React from 'react';
import Box from '@mui/material/Box';

export default function BoxFlexColumn({ alignItems = 'center', children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems,
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
}
