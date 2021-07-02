import React, { useEffect, useState } from 'react';
// import { useBreakpoints } from 'react-use-breakpoints';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import { filter, forEach } from 'lodash';

import Table from '../../components/Table';
import { getRecentRecords } from '../../store/records';
import GenerateRecordButton from '../../components/GenerateRecord';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: '1rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
    },
    button: {
      marginLeft: 'auto',
    },
  };
});

const prepareRecentRecords = (expenses, incomes, hours) => {
  let records = [];
  let days = [];
  for (var i = 0; i <= 7; i++) {
    days.push(dayjs().subtract(i, 'day').format('MM-DD-YYYY'));
  }

  forEach(days, (day) => {
    let dayRecords = [];
    let dayExpenses = filter(expenses, (expense) => {
      return expense.date === day;
    });
    let dayIncomes = filter(incomes, (income) => {
      return income.date === day;
    });
    let dayHours = filter(hours, (hour) => {
      return hour.date === day;
    });
    dayRecords = dayRecords
      .concat(dayExpenses)
      .concat(dayIncomes)
      .concat(dayHours);
    dayRecords = dayRecords.map((record, i) => {
      if (i === 0) return { ...record, displayDate: day };
      return record;
    });
    records = records.concat(dayRecords);
  });
  return records.slice(0, 15);
};

export default function Dashboard() {
  const classes = useStyles();
  // const { breakpoint, windowSize } = useBreakpoints();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const { expenses, incomes, hours } = useSelector((state) => state.records);

  useEffect(() => {
    dispatch(getRecentRecords());
  }, [dispatch]);

  useEffect(() => {
    setTableData(prepareRecentRecords(expenses, incomes, hours));
  }, [expenses, incomes, hours]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs>
          <Paper className={classes.paper}>
            <Typography align='right' variant='h4'>
              {dayjs().format('dddd, MMMM D YYYY')}
            </Typography>
            <div className={classes.button}>
              <GenerateRecordButton />
            </div>
          </Paper>
        </Grid>
        <Grid item xs>
          <Table data={tableData} title='Recent Records' />
        </Grid>
      </Grid>
    </>
  );
}