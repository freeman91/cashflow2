import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';

import RecordGenerationDialog from '../Dialog/GenerateRecordDialog';

export default function GenerateRecordButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label='create'
        color='primary'
        onClick={handleButtonClick}
        component='span'
        variant='contained'
      >
        <AddCircleIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
      <RecordGenerationDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
}