import React, { useEffect, useState } from 'react';
import { push } from 'redux-first-history';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'lodash/filter';

import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function AccountCard({ account }) {
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);
  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setAssets(filter(allAssets, { account_id: account.account_id }));
  }, [account.account_id, allAssets]);

  useEffect(() => {
    setDebts(filter(allDebts, { account_id: account.account_id }));
  }, [account.account_id, allDebts]);

  useEffect(() => {
    const assetSum = assets.reduce((sum, asset) => sum + asset.value, 0);
    const debtSum = debts.reduce((sum, debt) => sum + debt.amount, 0);
    setValue(assetSum - debtSum);
  }, [assets, debts]);

  const handleClick = (account) => {
    dispatch(push(`/app/accounts/${account.account_id}`));
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={() => handleClick(account)}
      key={account.account_id}
    >
      <CardHeader
        title={account.name}
        subheader={account.description}
        titleTypographyProps={{ align: 'left', width: '15rem' }}
        sx={{
          '.MuiCardHeader-action': { alignSelf: 'center' },
          p: 1,
          pl: 2,
          pr: 2,
        }}
        action={
          <Stack
            direction='row'
            mr={2}
            spacing={2}
            alignItems='center'
            justifyContent='space-between'
            sx={{ width: '100%' }}
          >
            <Typography align='center'>
              {numberToCurrency.format(value)}
            </Typography>
            <IconButton
              color='primary'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'account',
                    mode: 'edit',
                    attrs: account,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Stack>
        }
      />
    </Card>
  );
}