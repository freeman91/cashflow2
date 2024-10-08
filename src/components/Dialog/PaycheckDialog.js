import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  deletePaycheck,
  postPaycheck,
  putPaycheck,
} from '../../store/paychecks';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import DepositToSelect from '../Selector/DepositToSelect';
import AutocompleteListItem from '../List/AutocompleteListItem';

const defaultPaycheck = {
  paycheck_id: '',
  deposit_to_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  employer: '',
  _type: 'paycheck',
  take_home: '',
  taxes: '',
  retirement: '',
  benefits: '',
  other: '',
  description: '',
};

function PaycheckDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const paychecks = useSelector((state) => state.paychecks.data);
  const templates = useSelector((state) => {
    return state.paychecks.data.filter((paycheck) =>
      paycheck.paycheck_id.startsWith('paycheck:template')
    );
  });
  const { mode, id, attrs } = useSelector((state) => state.dialogs.paycheck);

  const [paycheck, setPaycheck] = useState(defaultPaycheck);

  const incomeSources = find(optionLists, { option_type: 'income_source' });

  useEffect(() => {
    if (id) {
      let _paycheck = find(paychecks, { paycheck_id: id });
      setPaycheck({
        ..._paycheck,
        date: dayjs(_paycheck.date),
      });
    }
  }, [id, paychecks]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setPaycheck((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setPaycheck({ ...paycheck, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postPaycheck(paycheck));
    } else dispatch(putPaycheck(paycheck));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deletePaycheck(paycheck.paycheck_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('paycheck'));
    setPaycheck(defaultPaycheck);
  };

  const handleTemplateClick = (e, template) => {
    e.preventDefault();
    setPaycheck((prevPaycheck) => ({
      ...prevPaycheck,
      deposit_to_id: template.deposit_to_id,
      employer: template.employer,
      take_home: template.take_home,
      taxes: template.taxes,
      retirement: template.retirement,
      benefits: template.benefits,
      other: template.other,
      description: template.description,
    }));
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
    ...templates.map((template) => (
      <MenuItem
        key={template.paycheck_id}
        onClick={(e) => handleTemplateClick(e, template)}
      >
        {template.employer}
      </MenuItem>
    )),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultPaycheck._type}
      title={`${mode} ${defaultPaycheck._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          <ListItem disableGutters>
            <DepositToSelect resource={paycheck} setResource={setPaycheck} />
          </ListItem>
          <ListItem disableGutters>
            <DatePicker
              label='date'
              value={paycheck.date}
              onChange={(value) => {
                setPaycheck({
                  ...paycheck,
                  date: value.hour(12).minute(0).second(0),
                });
              }}
              slotProps={{
                textField: {
                  variant: 'standard',
                  fullWidth: true,
                },
              }}
            />
          </ListItem>
          <AutocompleteListItem
            id='employer'
            label='employer'
            value={paycheck.employer}
            options={get(incomeSources, 'options', [])}
            onChange={handleChange}
          />
          {['take_home', 'taxes', 'retirement', 'benefits', 'other'].map(
            (attr) => (
              <DecimalFieldListItem
                key={attr}
                id={attr}
                item={paycheck}
                setItem={setPaycheck}
              />
            )
          )}
          <TextFieldListItem
            id='description'
            label='description'
            value={paycheck.description ? paycheck.description : ''}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />
          <ListItem
            key='buttons'
            disableGutters
            sx={{ justifyContent: 'space-around' }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              color='info'
              sx={{ width: '30%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '30%' }}
            >
              submit
            </Button>
          </ListItem>
        </List>
      </form>
    </BaseDialog>
  );
}

export default PaycheckDialog;
