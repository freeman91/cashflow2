import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function DebtCard({ debt }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push(`/app/debts/${debt.debt_id}`));
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={() => handleClick()}
      key={debt.debt_id}
    >
      <CardHeader
        title={debt.name}
        subheader={debt.description}
        titleTypographyProps={{ align: 'left' }}
        subheaderTypographyProps={{ align: 'left' }}
        sx={{
          '.MuiCardHeader-action': { alignSelf: 'center' },
          p: 1,
          pl: 2,
          pr: 2,
        }}
        action={
          <Stack
            direction='row'
            mr={2}
            spacing={2}
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography align='center'>
              {numberToCurrency.format(debt.amount)}
            </Typography>
            <IconButton
              color='primary'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'debt',
                    mode: 'edit',
                    attrs: debt,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
}
