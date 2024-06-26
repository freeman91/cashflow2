import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { concat, get, remove } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { setSnackbar } from '../appSettings';

const getDebts = createAsyncThunk(
  'debts/getDebts',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'debts'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postDebt = createAsyncThunk(
  'debts/postDebt',
  async (newDebt, { dispatch, getState }) => {
    try {
      const { data: debts } = getState().debts;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newDebt);

      if (result) {
        dispatch(setSnackbar({ message: 'debt created' }));
      }
      return {
        data: [result].concat(debts),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const putDebt = createAsyncThunk(
  'debts/putDebt',
  async (updatedDebt, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedDebt);
      const { data: debts } = getState().debts;
      if (result) {
        dispatch(setSnackbar({ message: 'debt updated' }));
      }
      let _debts = [...debts];
      remove(_debts, {
        debt_id: get(result, 'debt_id'),
      });
      return {
        data: concat(_debts, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deleteDebt = createAsyncThunk(
  'debts/deleteDebt',
  async (id, { dispatch, getState }) => {
    try {
      const { data: debts } = getState().debts;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'debt', id);

      if (result) {
        dispatch(setSnackbar({ message: 'debt deleted' }));
      }
      let _debts = [...debts];
      remove(_debts, { debt_id: id });
      return {
        data: _debts,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    setDebts: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getDebts, postDebt, putDebt, deleteDebt]);
  },
});

const { setDebts } = actions;

export { getDebts, postDebt, deleteDebt, putDebt, setDebts };
export default reducer;
