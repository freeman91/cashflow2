import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { get, reduce, filter as filter_ } from 'lodash';
import { Divider, Typography } from '@mui/material';
import { numberToCurrency } from '../../helpers/currency';

import AssetForm from '../Form/AssetForm';
import CreateButton from '../Button/CreateButton';
import CreateDialog from '../Dialog/CreateDialog';
import AssetDebtDialog from '../Dialog/AssetDebtDialog';
import { divStyle, textStyle } from './styles';

export default function AssetsContainer() {
  const { data: assets } = useSelector((state) => state.assets);
  const [open, setOpen] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    if (selectedFilter === 'crypto') {
      setTitle('Crpyto');
      setSelectedAssets(
        filter_(assets, (asset) => {
          return get(asset, 'type') === 'crypto';
        })
      );
    } else if (selectedFilter === 'stock') {
      setTitle('Credit');
      setSelectedAssets(
        filter_(assets, (asset) => {
          return get(asset, 'type') === 'stock';
        })
      );
    } else if (selectedFilter === 'else') {
      setTitle('All Other Assets');
      setSelectedAssets(
        filter_(assets, (asset) => {
          return (
            get(asset, 'type') !== 'crypto' && get(asset, 'type') !== 'stock'
          );
        })
      );
    } else if (selectedFilter === 'all') {
      setTitle('All Assets');
      setSelectedAssets(assets);
    } else {
      setTitle('');
      setSelectedAssets([]);
    }
  }, [assets, selectedFilter]);

  const handleClick = (filter) => {
    setSelectedFilter(filter);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFilter('');
  };

  let cryptoValue = 0;
  let stocksValue = 0;
  let elseValue = 0;
  let totalValue = reduce(
    assets,
    (sum, asset) => {
      let value = get(asset, 'value');
      if (get(asset, 'type') === 'crypto') {
        cryptoValue += value;
      } else if (get(asset, 'type') === 'stock') {
        stocksValue += value;
      } else {
        elseValue += value;
      }
      return sum + value;
    },
    0
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          minWidth: 275,
        }}
      >
        <Typography
          variant='h4'
          gutterBottom
          onClick={() => handleClick('all')}
        >
          Assets
        </Typography>
        <CreateButton>
          <CreateDialog title='Create Asset'>
            <AssetForm mode='create' />
          </CreateDialog>
        </CreateButton>
      </div>

      <Divider sx={{ mb: '1rem' }} />

      <div style={divStyle} onClick={() => handleClick('all')}>
        <Typography variant='h5' sx={textStyle}>
          Total Value...
        </Typography>
        <Typography variant='h5' sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(totalValue)}
        </Typography>
      </div>

      <div style={divStyle} onClick={() => handleClick('crypto')}>
        <Typography sx={textStyle}>Crypto Value...</Typography>
        <Typography sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(cryptoValue)}
        </Typography>
      </div>

      <div style={divStyle} onClick={() => handleClick('stock')}>
        <Typography sx={textStyle}>Stocks Value...</Typography>
        <Typography sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(stocksValue)}
        </Typography>
      </div>

      <div style={divStyle} onClick={() => handleClick('else')}>
        <Typography sx={textStyle}>Everything Else...</Typography>
        <Typography sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(elseValue)}
        </Typography>
      </div>
      <AssetDebtDialog
        open={open}
        handleClose={handleClose}
        records={selectedAssets}
        title={title}
      />
    </>
  );
}
