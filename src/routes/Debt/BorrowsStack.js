import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

const BorrowBox = (props) => {
  const { borrow } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: borrow._type,
        mode: 'edit',
        id: borrow.borrow_id,
        attrs: borrow,
      })
    );
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {borrow.lender}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            lender
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='text.secondary'>
            {dayjs(borrow.date).format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='body1' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {_numberToCurrency.format(borrow.amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function BorrowsStack(props) {
  const { debtId } = props;
  const allBorrows = useSelector((state) => state.borrows.data);
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    let _borrows = filter(allBorrows, { debt_id: debtId });
    setBorrows(sortBy(_borrows, 'date').reverse());
  }, [allBorrows, debtId]);

  return borrows.map((borrow) => {
    return (
      <Grid item xs={12} key={borrow.borrow_id} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <BorrowBox borrow={borrow} />
        </Card>
      </Grid>
    );
  });
}
