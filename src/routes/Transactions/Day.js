import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { openDialog } from '../../store/dialogs';
import { findAmount, findColor, findSource } from '../../helpers/transactions';
import { numberToCurrency } from '../../helpers/currency';

export default function Day(props) {
  const {
    month,
    date,
    recurrings = [],
    transactions,
    setMode,
    setSelectedRecurring,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isToday = dayjs().isSame(date, 'day');

  const handleClick = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        attrs: transaction,
      })
    );
  };

  const handleRecurringClick = (recurring) => {
    setSelectedRecurring(recurring);
    setMode('edit');
  };

  const showAll = (transactions) => {
    dispatch(
      openDialog({
        id: date,
        type: 'transactions',
        attrs: transactions,
      })
    );
  };

  const dateColor = (() => {
    if (isToday) return theme.palette.primary.main;
    if (date.isSame(month, 'month')) return theme.palette.text.primary;
    return theme.palette.surface[400];
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 155,
        py: 0.5,
        px: 0.25,
        position: 'relative',
        width: '100%',
      }}
    >
      <Typography
        align='center'
        variant='h6'
        sx={{
          color: dateColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          right: 4,
          mr: 1,
        }}
        fontWeight={isToday ? 'bold' : 'regular'}
      >
        {date.date() === 1 ? date.format('MMM D') : date.date()}
      </Typography>
      <Stack
        direction='column'
        justifyContent='flex-start'
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginTop: 3,
          gap: 0.25,
        }}
      >
        {recurrings.map((recurring, idx) => {
          const color = findColor(recurring.item_type, theme);
          let source = findSource(
            get(recurring, `${recurring.item_type}_attributes`)
          );
          let amount = findAmount(
            get(recurring, `${recurring.item_type}_attributes`)
          );
          return (
            <Box
              key={idx}
              onClick={() => handleRecurringClick(recurring)}
              sx={{
                backgroundColor: alpha(color, 0.5),
                width: '100%',
                borderRadius: 1,
                border: '1px solid',
                cursor: 'pointer',
                '&:hover': {
                  backgroundImage: `linear-gradient(to bottom, ${color}, ${theme.palette.surface[300]})`,
                },
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                px: 0.5,
              }}
            >
              <Typography
                variant='caption'
                color='textSecondary'
                align='left'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {source}
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                align='right'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {numberToCurrency.format(amount)}
              </Typography>
            </Box>
          );
        })}
        {transactions.map((transaction, idx) => {
          const color = findColor(transaction._type, theme);
          const merchant = findSource(transaction);
          const amount = findAmount(transaction);

          if (idx > 4 - recurrings.length) return null;

          return (
            <Box
              key={idx}
              onClick={() => handleClick(transaction)}
              sx={{
                backgroundColor: alpha(color, 0.5),
                width: '100%',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundImage: `linear-gradient(to bottom, ${color}, ${theme.palette.surface[300]})`,
                },
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                px: 0.5,
              }}
            >
              <Typography
                variant='caption'
                color='textSecondary'
                align='left'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {merchant}
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                align='right'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {transaction?.pending && (
                  <Tooltip title='Pending' placement='top'>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        backgroundColor: 'warning.main',
                        borderRadius: '50%',
                        mr: 0.25,
                      }}
                    />
                  </Tooltip>
                )}
                {numberToCurrency.format(amount)}
              </Typography>
            </Box>
          );
        })}
        {transactions.length > 5 - recurrings.length && (
          <Typography
            variant='caption'
            color='textSecondary'
            onClick={() => showAll(transactions)}
            sx={{
              '&:hover': { textDecoration: 'underline' },
              cursor: 'pointer',
            }}
          >
            {transactions.length - (5 - recurrings.length)} more...
          </Typography>
        )}
      </Stack>
    </Box>
  );
}