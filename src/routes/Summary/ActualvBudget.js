import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import filter from 'lodash/filter';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import FullBar from '../Budgets/FullBar';
import FillBar from '../Budgets/FillBar';
import OverageBar from '../Budgets/OverageBar';

export default function ActualvBudget(props) {
  const { category, year, month, actual } = props;

  const allBudgets = useSelector((state) => state.budgets.data);
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const [goal, setGoal] = useState(0);
  const [color, setColor] = useState('');

  useEffect(() => {
    const _category = find(expenseCategories.categories, {
      name: category,
    });
    setColor(_category?.color || '');
  }, [expenseCategories, category]);

  useEffect(() => {
    let budgets = [];
    if (isNaN(month)) {
      budgets = filter(allBudgets, {
        year: year,
      });
    } else {
      budgets = [
        find(allBudgets, {
          year: year,
          month: month,
        }),
      ];
    }
    const _goal = budgets.reduce((acc, budget) => {
      return (
        acc + budget?.categories?.find((c) => c.category === category)?.goal
      );
    }, 0);
    setGoal(_goal);
  }, [allBudgets, category, year, month]);

  if (goal === 0) return null;
  const diff = goal - actual;
  return (
    <>
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Card sx={{ width: '100%', p: 1 }}>
          <BoxFlexCenter
            sx={{ alignItems: 'flex-end', px: 2 }}
            justifyContent='space-between'
          >
            <Typography
              variant='h6'
              color='text.secondary'
              align='left'
              fontWeight='bold'
              sx={{ width: '33%' }}
            >
              budget
            </Typography>
            <Typography
              variant='body1'
              color={diff >= 0 ? 'success.main' : 'error.main'}
              fontWeight='bold'
              align='center'
              sx={{ width: '33%' }}
            >
              {numberToCurrency.format(diff)}
            </Typography>
            <BoxFlexCenter sx={{ width: '33%' }}>
              <Typography variant='h6' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h5' color='white' fontWeight='bold'>
                {_numberToCurrency.format(goal)}
              </Typography>
            </BoxFlexCenter>
          </BoxFlexCenter>
          <FullBar>
            <FillBar fillValue={actual} goalSum={goal} color={color} />
            <OverageBar expenseSum={actual} goal={goal} />
          </FullBar>
        </Card>
      </Grid>
    </>
  );
}