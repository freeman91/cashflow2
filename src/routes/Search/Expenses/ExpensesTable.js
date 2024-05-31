import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import map from 'lodash/map';

import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

export default function ExpensesTable(props) {
  const { expenses } = props;
  const dispatch = useDispatch();

  const handleClick = (expense) => {
    dispatch(
      openDialog({
        type: expense._type,
        mode: 'edit',
        id: expense.expense_id,
        attrs: expense,
      })
    );
  };

  return (
    <TableContainer component='div'>
      <Table>
        <TableHead>
          <TableRow key='headers'>
            <TableCell sx={{ p: 1, pl: 2, pb: 0 }}>date</TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='right'>
              amount
            </TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='right'>
              vendor
            </TableCell>
            <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
              paid
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(
            expenses.map((expense, idx, array) => {
              const sameDateAsPrevious =
                idx === 0
                  ? false
                  : dayjs(expense.date).isSame(
                      dayjs(array[idx - 1].date),
                      'day'
                    );
              const amount = (() => {
                if (expense._type === 'expense') {
                  return expense.amount;
                } else if (expense._type === 'repayment') {
                  return (
                    get(expense, 'principal', 0) +
                    get(expense, 'interest', 0) +
                    get(expense, 'escrow', 0)
                  );
                } else {
                  return 0;
                }
              })();
              return (
                <TableRow
                  key={expense.expense_id || expense.repayment_id}
                  hover={true}
                  onClick={() => handleClick(expense)}
                >
                  <CustomTableCell idx={idx} column='date'>
                    {sameDateAsPrevious
                      ? ''
                      : dayjs(expense.date).format('MMM D')}
                  </CustomTableCell>
                  <CustomTableCell idx={idx} align='right'>
                    {numberToCurrency.format(amount)}
                  </CustomTableCell>
                  <CustomTableCell
                    idx={idx}
                    align='right'
                    sx={{ maxWidth: 150 }}
                  >
                    {expense.vendor ? expense.vendor : expense.lender}
                  </CustomTableCell>
                  <TableCell scope='row' align='right'>
                    <Checkbox
                      edge='start'
                      checked={!expense.pending}
                      tabIndex={-1}
                      size='small'
                      sx={{
                        '&.MuiButtonBase-root': { padding: 0 },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
