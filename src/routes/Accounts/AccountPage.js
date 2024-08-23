import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import AccountBox from './AccountBox';
import ItemBox from '../../components/ItemBox';
import AccountChart from '../Networth/AccountChart';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function AccountPage(props) {
  const { account } = props;

  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [tabIdx, setTabIdx] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [debts, setDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    if (assets.length > 0) {
      setTabIdx('assets');
    } else if (debts.length > 0) {
      setTabIdx('debts');
    } else {
      setTabIdx('history');
    }
  }, [assets.length, debts.length]);

  useEffect(() => {
    const accountAssets = filter(allAssets, { account_id: account.account_id });
    setAssetSum(reduce(accountAssets, (acc, asset) => acc + asset.value, 0));
    setAssets(sortBy(accountAssets, 'value').reverse());
  }, [allAssets, account.account_id]);

  useEffect(() => {
    const accountDebts = filter(allDebts, { account_id: account.account_id });
    setDebtSum(reduce(accountDebts, (acc, debt) => acc + debt.amount, 0));
    setDebts(sortBy(accountDebts, 'amount'));
  }, [allDebts, account.account_id]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1}>
        <Card raised sx={{ py: 1 }}>
          <AccountBox account={{ ...account, net: assetSum - debtSum }} />
        </Card>
      </Grid>
      {tabIdx !== null && (
        <Grid item xs={12} mx={2}>
          <StyledTabs
            value={tabIdx}
            onChange={handleChange}
            variant='fullWidth'
          >
            {assets.length > 0 && <StyledTab label='assets' value='assets' />}
            {debts.length > 0 && <StyledTab label='debts' value='debts' />}
            <StyledTab label='history' value='history' />
          </StyledTabs>
        </Grid>
      )}

      {tabIdx === 'assets' && assets.length !== 0 && (
        <Grid item xs={12} mx={1} pt='2px !important'>
          {assets.length > 1 && (
            <Grid item xs={12} mx={1} pt='2px !important'>
              <BoxFlexCenter>
                <Typography variant='h5' color='text.secondary'>
                  $
                </Typography>
                <Typography variant='h5' color='white' fontWeight='bold'>
                  {_numberToCurrency.format(assetSum)}
                </Typography>
              </BoxFlexCenter>
            </Grid>
          )}
          <Card raised>
            <Stack spacing={1} direction='column' py={1}>
              {map(assets, (asset, idx) => {
                return (
                  <React.Fragment key={asset.asset_id}>
                    <ItemBox item={asset} />
                    {idx < assets.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      )}
      {tabIdx === 'debts' && debts.length !== 0 && (
        <Grid item xs={12} mx={1} pt='2px !important'>
          {debts.length > 1 && (
            <Grid item xs={12} mx={1} pt='2px !important'>
              <BoxFlexCenter>
                <Typography variant='h5' color='text.secondary'>
                  $
                </Typography>
                <Typography variant='h5' color='white' fontWeight='bold'>
                  {_numberToCurrency.format(debtSum)}
                </Typography>
              </BoxFlexCenter>
            </Grid>
          )}
          <Card raised>
            <Stack spacing={1} direction='column' py={1}>
              {map(debts, (debt, idx) => {
                return (
                  <React.Fragment key={debt.debt_id}>
                    <ItemBox item={debt} />
                    {idx < debts.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      )}
      {tabIdx === 'history' && (
        <Grid item xs={12} mx={1} pt='2px !important'>
          <AccountChart account={account} />
        </Grid>
      )}
    </>
  );
}
