import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AutocompleteListItem from '../List/AutocompleteListItem';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { deleteAsset, postAsset, putAsset } from '../../store/assets';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AccountSelect from '../Selector/AccountSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';

const defaultAsset = {
  asset_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  account_id: '',
  _type: 'asset',
  name: '',
  value: '',
  category: '',
  shares: '',
  price: '',
};

function AssetDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const assets = useSelector((state) => state.assets.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.asset);
  const [asset, setAsset] = useState(defaultAsset);

  const hasShares = asset.category === 'stock' || asset.category === 'crypto';
  const assetCategories = find(optionLists, {
    option_type: 'asset_category',
  });

  useEffect(() => {
    if (id) {
      let _asset = find(assets, { asset_id: id });
      setAsset(_asset);
    }
  }, [id, assets]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setAsset((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let _asset = { ...asset };

    if (!hasShares) {
      _asset.shares = null;
      _asset.price = null;
    }

    if (mode === 'create') {
      dispatch(postAsset(_asset));
    } else dispatch(putAsset(_asset));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteAsset(asset.asset_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('asset'));
    setAsset(defaultAsset);
  };

  return (
    <BaseDialog
      type={defaultAsset._type}
      title={`${mode} ${defaultAsset._type}`}
      handleClose={handleClose}
      titleOptions={[
        <MenuItem key='purchase' onClick={() => {}}>
          purchase
        </MenuItem>,
        <MenuItem key='sale' onClick={() => {}}>
          sale
        </MenuItem>,
        <MenuItem key='delete' onClick={handleDelete}>
          delete
        </MenuItem>,
      ]}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='asset_id'
              label='asset_id'
              value={asset.asset_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <AccountSelect resource={asset} setResource={setAsset} />
          <TextFieldListItem
            id='name'
            label='name'
            value={asset.name}
            onChange={handleChange}
          />
          <DecimalFieldListItem id='value' item={asset} setItem={setAsset} />
          <AutocompleteListItem
            id='category'
            label='category'
            value={asset.category}
            options={get(assetCategories, 'options', [])}
            onChange={handleChange}
          />
          {hasShares && (
            <DecimalFieldListItem
              id='shares'
              item={asset}
              setItem={setAsset}
              startAdornment={null}
            />
          )}
          {hasShares && (
            <DecimalFieldListItem id='price' item={asset} setItem={setAsset} />
          )}

          <ListItem
            key='buttons'
            disableGutters
            sx={{ justifyContent: 'space-around' }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              color='info'
              sx={{ width: '45%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '45%' }}
            >
              submit
            </Button>
          </ListItem>
        </List>
      </form>
    </BaseDialog>
  );
}

export default AssetDialog;
