import React, { useState } from 'react';
import { get, map } from 'lodash';

import { useTheme } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../../../helpers/currency';

export default function ExpensesByType(props) {
  const { expenses, expenseTotal } = props;
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card raised>
      <CardHeader
        title={
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h5'>Expenses</Typography>
            <Typography variant='h6' color='text.secondary'>
              {numberToCurrency.format(expenseTotal)}
            </Typography>
          </Stack>
        }
        action={
          <IconButton
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent sx={{ pt: 0, paddingBottom: '8px !important' }}>
          <Grid
            container
            sx={{ paddingTop: '0 !important' }}
            alignItems='center'
            spacing={1}
          >
            {map(expenses, (expense) => {
              return (
                <React.Fragment key={expense.type}>
                  <Grid item xs={4}>
                    <Typography align='left'>{expense.type}</Typography>
                  </Grid>

                  <Grid item xs={8} alignItems='center'>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.blue[600],
                        width: `${
                          (expense.sum / get(expenses, '0.sum', 1000)) * 100
                        }%`,
                        borderRadius: '5px',
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Typography ml={2}>
                        {numberToCurrency.format(expense.sum)}
                      </Typography>
                    </Box>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}
