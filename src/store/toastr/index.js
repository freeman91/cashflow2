import React from 'react';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { thunkReducer } from '../thunkTemplate';
import { actions as toastrActions } from 'react-redux-toastr';
import { isArray } from 'lodash';
import Typography from '@material-ui/core/Typography';

const { add } = toastrActions;

export const types = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  light: 'light',
  error: 'error',
};

const addToastr = createAsyncThunk(
  '@@toastr/add',
  (
    {
      title = '',
      message = '',
      type = 'success',
      position = 'bottom-right',
      useBullets = true,
      options = {},
    },
    { dispatch }
  ) => {
    // Additional toastr options
    /*
    {
      attention?: boolean;
      className?: string;
      component?: Component | JSX.Element;
      icon?: JSX.Element;
      onCloseButtonClick?: () => void;
      onHideComplete?: () => void;
      onShowComplete?: () => void;
      onToastrClick?: () => void;
      progressBar?: boolean;
      removeOnHover?: boolean;
      showCloseButton?: boolean;
      timeOut?: number;
      transitionIn?: transitionInType;
      transitionOut?: transitionOutType;
      getState?: (state: ToastrState) => ToastrState;
    }
    */

    options.timeOut = 10000;

    message =
      message &&
      (isArray(message)
        ? message.map((line) =>
            useBullets ? '\u00A0\u00A0• '.concat(line) : line
          )
        : [message]);
    options.component = (props) => {
      return (
        <div>
          {title && (
            <Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          )}
          {message &&
            message.map((line, i) => (
              <Typography key={i} variant='subtitle1'>
                {line}
              </Typography>
            ))}
        </div>
      );
    };

    let toastrOptions = {
      message: '',
      title: '',
      type,
      position,
      options,
    };

    dispatch(add(toastrOptions));
  }
);

// NOTE: "Mutating" state is safe in redux toolkit because it uses Immer
let initialState = {}; // NOTE placeholder for now
const { reducer } = createSlice({
  name: '@@toastr',
  initialState,
  extraReducers: {
    ...thunkReducer(addToastr),
  },
});

// Export the reducer, either as a default or named export
export { addToastr };
export default reducer;