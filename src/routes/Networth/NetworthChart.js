import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { blue, grey } from '@mui/material/colors';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { numberToCurrency } from '../../helpers/currency';

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const networth = find(payload, (p) => p.dataKey === 'networth');
    return (
      <Card sx={{ p: 0 }}>
        <CardContent sx={{ p: 1, pb: '4px !important' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 200,
            }}
          >
            <Typography>{dayjs(Number(label)).format('YYYY MMM')}</Typography>
            <Typography>{numberToCurrency.format(networth.value)}</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
  return null;
}

export default function NetworthChart(props) {
  const { setSelectedId } = props;
  const allNetworths = useSelector((state) => state.networths.data);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState({
    start: { month: 10, year: 2018 },
    end: { month: 1, year: 2030 },
  });

  useEffect(() => {
    let _range = { start: {}, end: {} };

    if (allNetworths.length) {
      const lastMonthData = allNetworths[allNetworths.length - 1];
      let lastMonth = dayjs(`${lastMonthData.year}-${lastMonthData.month}-01`);
      lastMonth = lastMonth.add(1, 'month');

      _range = {
        start: { month: 10, year: 2018 },
        end: { month: lastMonth.month(), year: lastMonth.year() },
      };
      setRange(_range);
    }

    let _data = map(allNetworths, (networth) => {
      const assetSum = reduce(
        networth.assets,
        (sum, asset) => sum + asset.value,
        0
      );
      const debtSum = reduce(
        networth.debts,
        (sum, debt) => sum + debt.value,
        0
      );

      return {
        timestamp: dayjs(networth.date).date(15).unix() * 1000,
        networth: assetSum - debtSum,
        id: networth.networth_id,
      };
    });
    _data = sortBy(_data, 'timestamp');
    setChartData(_data);
  }, [allNetworths]);

  return (
    <ResponsiveContainer
      width='100%'
      height={200}
      style={{ '& .recharts-surface': { overflow: 'visible' } }}
    >
      <ComposedChart
        width='100%'
        height={200}
        data={chartData}
        onClick={(e) => {
          if (e?.activeTooltipIndex) {
            setSelectedId(chartData[e.activeTooltipIndex].id);
          } else {
            setSelectedId(null);
          }
        }}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis
          hide
          axisLine={false}
          tickLine={false}
          type='number'
          dataKey='timestamp'
          domain={[
            dayjs()
              .year(range.start.year)
              .month(range.start.month)
              .date(1)
              .unix() * 1000,
            dayjs().year(range.end.year).month(range.end.month).date(1).unix() *
              1000,
          ]}
          tickFormatter={(unixTime) => {
            return dayjs(unixTime).format('YYYY MMM');
          }}
        />

        <Tooltip content={<ChartTooltip />} />
        <ReferenceLine y={0} stroke={grey[300]} strokeDasharray='3 3' />
        <Line
          dot={false}
          type='monotone'
          dataKey='networth'
          stroke={blue[500]}
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
