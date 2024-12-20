import React, { useEffect, useState } from 'react';
import map from 'lodash/map';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Cell, PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../BoxFlexCenter';

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    selectedFill,
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={5}
        textAnchor='middle'
        fill={selectedFill}
        fontSize={16}
        fontWeight={700}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={selectedFill}
        cornerRadius={4}
      />
    </g>
  );
};

export default function ExpensesByCategory(props) {
  const { groupedExpenses, expenseTotal } = props;

  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const _selected = groupedExpenses[activeIndex];
    setSelected(_selected);
  }, [activeIndex, groupedExpenses]);

  if (groupedExpenses.length === 0) {
    return (
      <Grid
        item
        xs={12}
        pt={'0 !important'}
        height={125}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography align='center' color='text.secondary'>
          no data
        </Typography>
      </Grid>
    );
  }

  const height = 125;
  return (
    <>
      <Grid
        item
        xs={6}
        display='flex'
        justifyContent='center'
        sx={{ width: '100%' }}
      >
        <ResponsiveContainer width='100%' height={height}>
          <PieChart width='100%' height={height}>
            <Pie
              data={groupedExpenses}
              dataKey='value'
              paddingAngle={2}
              minAngle={10}
              innerRadius={40}
              outerRadius={60}
              cornerRadius={4}
              cx='60%'
              cy='50%'
              startAngle={360}
              endAngle={0}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onPointerOver={(_, index) => {
                setActiveIndex(index);
              }}
            >
              {map(groupedExpenses, (group, idx) => {
                const lightColor = alpha(group.color, 0.5);
                return (
                  <Cell
                    key={`cell-${idx}`}
                    selectedFill={group.color}
                    fill={lightColor}
                    stroke={lightColor}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid
        item
        xs={6}
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: `${height}px` }}
      >
        {selected && (
          <Box sx={{ width: '100%', pr: 6 }}>
            <BoxFlexCenter>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(selected.value)}
              </Typography>
            </BoxFlexCenter>
            <Typography variant='h6' color='text.secondary' align='center'>
              {selected.name}
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='center'
        sx={{ width: '100%' }}
      >
        <Typography
          variant='h6'
          color='text.secondary'
          align='center'
          fontWeight='bold'
          sx={{ mr: 2 }}
        >
          total
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(expenseTotal)}
          </Typography>
        </BoxFlexCenter>
      </Grid>
      {/* {selected && (
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              transform: 'translate(-55%, 80%)',
              height: 'fit-content',
            }}
          >
            <ListItem
              disablePadding
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                openTransactionsDialog(selected.name, selected.expenses)
              }
            >
              <ListItemIcon
                sx={{
                  minWidth: 'unset',
                  mr: 2,
                  backgroundColor: selected.color,
                  borderRadius: '5px',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MenuIcon
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'surface.100',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                sx={{ width: '100px' }}
                primary={
                  <BoxFlexCenter sx={{ justifyContent: 'flex-start' }}>
                    <Typography variant='body2' color='text.secondary'>
                      $
                    </Typography>
                    <Typography variant='body1' color='white' fontWeight='bold'>
                      {_numberToCurrency.format(selected.value)}
                    </Typography>
                  </BoxFlexCenter>
                }
                secondary={selected.name}
                secondaryTypographyProps={{ align: 'left' }}
              />
            </ListItem>
          </Box>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='center'
        mx={12}
        pt='0 !important'
      >
        <LabelValueBox label='total' value={expenseTotal} />
      </Grid> */}
    </>
  );
}
