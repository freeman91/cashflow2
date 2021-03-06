import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get, map, reduce } from 'lodash';
import { Typography } from '@mui/material';
import { ComposedChart, XAxis, YAxis, Tooltip, Bar, Line } from 'recharts';

import { NetworthTooltip } from './NetworthTooltip';
import { divStyle } from '../containers/styles';
import { numberToCurrency } from '../../helpers/currency';
import NetworthDialog from '../Dialog/NetworthDialog';

const compileData = (networths) => {
  return map(networths, (month) => {
    let assetTotal = reduce(
      get(month, 'assets'),
      (sum, asset) => {
        return sum + get(asset, 'amount');
      },
      0
    );
    let debtTotal = reduce(
      get(month, 'debts'),
      (sum, debt) => {
        return sum + get(debt, 'amount');
      },
      0
    );

    return {
      month: `${get(month, 'month')}-${get(month, 'year')}`,
      assetTotal,
      debtTotal: debtTotal,
      networth: assetTotal - debtTotal,
    };
  });
};

const TiltedAxisTick = (props) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor='end'
        fill='#666'
        transform='rotate(-45)'
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function NetworthChart() {
  const { data: networths } = useSelector((state) => state.networths);
  const [chartData, setChartData] = useState([]);
  const [selecteMonth, setSelectedMonth] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setChartData(compileData(networths));
  }, [networths]);

  const handleClick = (e) => {
    setSelectedMonth(e.activeLabel);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMonth('');
  };

  return (
    <>
      <div style={divStyle}>
        <Typography variant='h4'>Net Worth over time</Typography>
      </div>
      <ComposedChart
        width={950}
        height={300}
        data={chartData}
        margin={{ top: 30, right: 0, bottom: 25, left: 20 }}
        onClick={handleClick}
      >
        <XAxis dataKey='month' tick={<TiltedAxisTick />} />
        <YAxis
          tickFormatter={(val, _axis) => {
            return numberToCurrency.format(val);
          }}
        />
        <Tooltip content={<NetworthTooltip />} />
        <Bar dataKey='assetTotal' barSize={4} fill='#38b000' />
        <Bar dataKey='debtTotal' barSize={4} fill='#a22c29' />
        <Line dataKey='networth' type='monotone' stroke='#fde424' dot={false} />
      </ComposedChart>
      <NetworthDialog
        open={open}
        handleClose={handleClose}
        selectedMonth={selecteMonth}
      />
    </>
  );
}
