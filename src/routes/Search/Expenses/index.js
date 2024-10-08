import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { findId } from '../../../helpers/transactions';
import { getExpenses } from '../../../store/expenses';
import RangeSelect, {
  RANGE_OPTIONS,
} from '../../../components/Selector/RangeSelect';
import FilterDialog from './FilterDialog';
import ExpensesSummary from './ExpensesSummary';
import TransactionBox from '../../../components/TransactionBox';

export default function Expenses() {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [typeFilter, setTypeFilter] = useState(['expense', 'repayment']);
  const [amountFilter, setAmountFilter] = useState({
    comparator: '',
    amount: '',
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [billFilter, setBillFilter] = useState('');
  const [pendingFilter, setPendingFilter] = useState(['pending', 'paid']);

  useEffect(() => {
    let _expenses = [...allExpenses, ...allRepayments];

    // filter by date
    _expenses = filter(_expenses, (expense) => {
      return dayjs(expense.date).isBetween(range.start, range.end);
    });

    // filter by type
    _expenses = filter(_expenses, (expense) => {
      return includes(typeFilter, expense._type);
    });

    // filter by pending
    if (pendingFilter.length === 1) {
      _expenses = filter(_expenses, (expense) => {
        const filterString = pendingFilter[0];
        if (filterString === 'paid') {
          return !expense.pending;
        } else if (filterString === 'pending') {
          return expense.pending;
        }
      });
    } else if (pendingFilter.length === 0) {
      _expenses = [];
    }

    // filter by amount
    if (amountFilter.comparator && amountFilter.amount) {
      _expenses = filter(_expenses, (expense) => {
        const filterAmount = Number(amountFilter.amount);
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

        if (amountFilter.comparator === '>') {
          return amount > filterAmount;
        } else if (amountFilter.comparator === '<') {
          return amount < filterAmount;
        } else if (amountFilter.comparator === '=') {
          return amount === filterAmount;
        }
      });
    }

    // filter by category
    if (categoryFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.category === categoryFilter;
      });
    }

    // filter by subcategory
    if (subcategoryFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.subcategory === subcategoryFilter;
      });
    }

    // filter by vendor
    if (vendorFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.vendor === vendorFilter;
      });
    }

    // filter by bill
    if (billFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.bill_id === billFilter.bill_id;
      });
    }

    _expenses = sortBy(_expenses, 'date');
    setFilteredExpenses(_expenses);
  }, [
    allExpenses,
    allRepayments,
    range,
    typeFilter,
    amountFilter,
    categoryFilter,
    subcategoryFilter,
    vendorFilter,
    billFilter,
    pendingFilter,
  ]);

  useEffect(() => {
    dispatch(getExpenses({ range }));
  }, [range, dispatch]);

  return (
    <>
      <Box sx={{ px: 1, mb: 1 }}>
        <Card
          raised
          sx={{
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <RangeSelect range={range} setRange={setRange} />
          <IconButton onClick={() => setOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Card>
        <ExpensesSummary expenses={filteredExpenses} />
      </Box>

      <Card raised>
        <Stack spacing={1} direction='column' py={1}>
          {map(filteredExpenses, (expense, idx) => {
            const key = findId(expense);
            return (
              <React.Fragment key={key}>
                <TransactionBox transaction={expense} />
                {idx < filteredExpenses.length - 1 && (
                  <Divider sx={{ mx: '8px !important' }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </Card>
      <FilterDialog
        title='filter options'
        open={open}
        setOpen={setOpen}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        pendingFilter={pendingFilter}
        setPendingFilter={setPendingFilter}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        subcategoryFilter={subcategoryFilter}
        setSubcategoryFilter={setSubcategoryFilter}
        vendorFilter={vendorFilter}
        setVendorFilter={setVendorFilter}
        billFilter={billFilter}
        setBillFilter={setBillFilter}
      />
    </>
  );
}
