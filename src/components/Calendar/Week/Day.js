import React from 'react';
import { IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/styles';
import dayjs from 'dayjs';
import Record from './Record';
import { map, filter, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateDialog } from '../../../store/settings';

export default function Day({ date }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  let isToday = dayjs().isSame(date, 'day');

  const expenses = useSelector((state) =>
    filter(state.expenses.data, (expense) => {
      return get(expense, 'date') === date.format('YYYY-MM-DD');
    })
  );

  const incomes = useSelector((state) =>
    filter(state.incomes.data, (income) => {
      return get(income, 'date') === date.format('YYYY-MM-DD');
    })
  );

  const hours = useSelector((state) =>
    filter(state.hours.data, (hour) => {
      return get(hour, 'date') === date.format('YYYY-MM-DD');
    })
  );

  const handleClick = () => {
    dispatch(
      setCreateDialog({
        date: date,
        open: true,
      })
    );
  };

  return (
    <Paper
      variant='outlined'
      sx={{
        width: '10rem',
        height: '10rem',
        backgroundColor: theme.palette.grey[900],
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          float: 'left',
          height: '1rem',
          width: '1rem',
          mt: '.3rem',
          ml: '.5rem',
        }}
      >
        <AddIcon />
      </IconButton>
      <Typography
        sx={{
          float: 'right',
          width: '1.5rem',
          mt: '.2rem',
          mb: '1rem',
          mr: '.5rem',
          bgcolor: isToday
            ? theme.palette.red[800]
            : theme.palette.background.paper,
          borderRadius: '.5rem',
        }}
      >
        {date.date()}
      </Typography>
      <div style={{ marginTop: '2.5rem' }} />
      {map(hours, (hour) => {
        return <Record key={hour.id} data={hour} />;
      })}
      {map(incomes, (income) => {
        return <Record key={income.id} data={income} />;
      })}
      {map(expenses, (expense) => {
        return <Record key={expense.id} data={expense} />;
      })}
    </Paper>
  );
}
