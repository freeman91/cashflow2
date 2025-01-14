import React, { useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import CreateTransactionButton from './CreateTransactionButton';
import TransactionsTable from '../../Transactions/Table';

export default function Transactions() {
  const [range] = useState({
    start: dayjs().subtract(7, 'day'),
    end: dayjs(),
  });

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          pt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mr: 2,
            py: 1,
          }}
        >
          <Typography
            variant='body1'
            fontWeight='bold'
            color='textSecondary'
            sx={{ px: 2 }}
          >
            TRANSACTIONS
          </Typography>
          <CreateTransactionButton />
        </Box>

        <Typography variant='h5' fontWeight='bold' sx={{ px: 2, pb: 2 }}>
          Recent
        </Typography>
        <TransactionsTable range={range} types={[]} borderRadius={0} />
      </Box>
    </Grid>
  );
}
