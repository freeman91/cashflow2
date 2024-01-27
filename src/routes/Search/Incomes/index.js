import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import toLower from 'lodash/toLower';

import Box from '@mui/material/Box';

// import { getIncomes } from '../../../store/incomes';
import NewTransactionButton from '../../../components/NewTransactionButton';
import { RANGE_OPTIONS } from '../../../components/Selector/RangeSelect';
import IncomesTable from './IncomesTable';
import FilterOptions from './FilterOptions';

export default function Incomes() {
  // const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [total, setTotal] = useState(0);
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);

  const [typeFilter, setTypeFilter] = useState(['income', 'paycheck']);
  const [amountFilter, setAmountFilter] = useState({
    comparator: '',
    amount: '',
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  useEffect(() => {
    let _incomes = [...allIncomes, ...allPaychecks];

    // filter by date
    _incomes = filter(_incomes, (income) => {
      return dayjs(income.date).isBetween(range.start, range.end);
    });

    // filter by type
    _incomes = filter(_incomes, (income) => {
      return includes(typeFilter, income._type);
    });

    // filter by amount
    if (amountFilter.comparator && amountFilter.amount) {
      _incomes = filter(_incomes, (income) => {
        const filterAmount = Number(amountFilter.amount);
        const amount = (() => {
          if (income._type === 'income') {
            return income.amount;
          } else if (income._type === 'paycheck') {
            return get(income, 'take_home', 0);
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
      _incomes = filter(_incomes, (income) => {
        if (categoryFilter === 'paycheck') {
          return income._type === 'paycheck';
        }
        return income.category === categoryFilter;
      });
    }

    // filter by source
    if (sourceFilter) {
      _incomes = filter(_incomes, (income) => {
        if (income._type === 'paycheck') {
          return includes(toLower(income.employer), toLower(sourceFilter));
        }
        return includes(toLower(income.source), toLower(sourceFilter));
      });
    }

    _incomes = sortBy(_incomes, 'date');
    setFilteredIncomes(_incomes);
  }, [
    allIncomes,
    allPaychecks,
    range,
    typeFilter,
    amountFilter,
    categoryFilter,
    sourceFilter,
  ]);

  // useEffect(() => {
  // dispatch(getIncomes({ range }));
  // }, [range, dispatch]);

  useEffect(() => {
    const _total = reduce(
      filteredIncomes,
      (sum, income) => {
        const amount = (() => {
          if (income._type === 'income') {
            return income.amount;
          } else if (income._type === 'paycheck') {
            return get(income, 'take_home', 0);
          } else {
            return 0;
          }
        })();
        return sum + amount;
      },
      0
    );
    setTotal(_total);
  }, [filteredIncomes]);

  return (
    <Box sx={{ mt: 1 }}>
      <FilterOptions
        total={total}
        range={range}
        setRange={setRange}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
      />
      <IncomesTable incomes={filteredIncomes} />
      <NewTransactionButton transactionTypes={['income', 'paycheck']} />
    </Box>
  );
}
