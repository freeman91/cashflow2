import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import { concat, get, remove } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';

const getAccounts = createAsyncThunk(
  'accounts/getAccounts',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'accounts'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postAccount = createAsyncThunk(
  'accounts/postAccountAPI',
  async (newAccount, { dispatch, getState }) => {
    try {
      const { data: accounts } = getState().accounts;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newAccount);

      if (result) {
        toastr.success('Account created');
      }
      return {
        data: [result].concat(accounts),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putAccount = createAsyncThunk(
  'accounts/putAccount',
  async (updatedAccount, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedAccount);
      const { data: accounts } = getState().accounts;
      if (result) {
        toastr.success('Account updated');
      }
      let _accounts = [...accounts];
      remove(_accounts, {
        account_id: get(result, 'account_id'),
      });
      return {
        data: concat(_accounts, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (id, { getState }) => {
    try {
      const { data: accounts } = getState().accounts;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'account', id);

      if (result) {
        toastr.success('Account deleted');
      }
      let _accounts = [...accounts];
      remove(_accounts, { account_id: id });
      return {
        data: _accounts,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getAccounts, postAccount, putAccount]);
  },
});

const { setAccounts } = actions;

export { getAccounts, postAccount, putAccount, deleteAccount, setAccounts };
export default reducer;
