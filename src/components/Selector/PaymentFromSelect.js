import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

function PaymentFromSelect(props) {
  const { resource, setResource } = props;

  const allDebts = useSelector((state) => state.debts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    let _assets = filter(allAssets, (asset) => {
      return asset.can_pay_from;
    });
    setAssets(sortBy(_assets, 'name'));
  }, [allAssets]);

  useEffect(() => {
    let _debts = filter(allDebts, (debt) => {
      return debt.can_pay_from;
    });
    setDebts(sortBy(_debts, 'name'));
  }, [allDebts]);

  const handleChangeDebt = (e) => {
    setResource((prevResource) => ({
      ...prevResource,
      payment_from_id: e.target.value,
    }));
  };

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel id='payment_from-label'>payment from</InputLabel>
      <Select
        labelId='payment_from-label'
        id='payment_from'
        value={get(resource, 'payment_from_id', '')}
        onChange={handleChangeDebt}
        label='Debt'
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        MenuProps={{
          MenuListProps: {
            disablePadding: true,
            sx: { bgcolor: 'surface.300' },
          },
        }}
      >
        <MenuItem key='none' id='none-menu-item' value=''>
          None
        </MenuItem>
        <Divider sx={{ mx: 1 }} />
        {debts.map((debt) => (
          <MenuItem
            key={debt.debt_id}
            id={`${debt.debt_id}-menu-item`}
            value={debt.debt_id}
          >
            {debt.name}
          </MenuItem>
        ))}
        <Divider sx={{ mx: 1 }} />
        {assets.map((asset) => (
          <MenuItem
            key={asset.asset_id}
            id={`${asset.asset_id}-menu-item`}
            value={asset.asset_id}
          >
            {asset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PaymentFromSelect;
