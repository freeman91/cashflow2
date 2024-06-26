import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CashflowContainer from '../../components/CashflowContainer';
dayjs.extend(advancedFormat);

export default function Cashflow() {
  const dispatch = useDispatch();

  const [date] = useState(dayjs().hour(12).minute(0));
  const [daysLeftInMonth, setDaysLeftInMonth] = useState(0);

  useEffect(() => {
    let endOfMonth = date.endOf('month');
    setDaysLeftInMonth(endOfMonth.diff(date, 'day'));
  }, [date]);

  return (
    <>
      <Card raised>
        <CardHeader
          disableTypography
          title={
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Typography variant='body1' align='center' fontWeight='bold'>
                {date.format('MMMM YYYY')}
              </Typography>

              <Typography variant='body1' align='center' sx={{ ml: 3 }}>
                {daysLeftInMonth} days left
              </Typography>
            </div>
          }
          sx={{ p: 1, pt: '4px', pb: 0 }}
          action={
            <IconButton
              size='small'
              onClick={() =>
                dispatch(push(`/summary/${date.year()}/${date.month() + 1}`))
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          }
        />
        <CashflowContainer year={date.year()} month={date.month() + 1} />
      </Card>
    </>
  );
}
