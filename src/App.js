import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';
import LoadingBar from 'react-redux-loading-bar';

import { styled } from '@mui/material';
import { muiTheme } from './styles/muiTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { history, store } from './store/createStore';

import Layout from './routes/Layout';
import Accounts from './routes/Accounts';
import Dashboard from './routes/Dashboard';
import Summary from './routes/Summary';
import Networth from './routes/Networth';
import Search from './routes/Search';
import Settings from './routes/Settings';
import Assets from './routes/Assets';
import Debts from './routes/Debts';
import Calendar from './routes/Calendar';
import './styles/index.css';

console.log('_package.version: ', _package.version);

const ReduxLoader = styled(LoadingBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '3px',
  position: 'absolute',
  zIndex: 99999,
  top: 0,
}));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/summary' element={<Summary />} />
        <Route path='/summary/:year' element={<Summary />} />
        <Route path='/summary/:year/:month' element={<Summary />} />
        <Route path='/networth' element={<Networth />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/:type' element={<Search />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings/:option' element={<Settings />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/accounts/:accountId' element={<Accounts />} />
        <Route path='/assets' element={<Assets />} />
        <Route path='/assets/:assetId' element={<Assets />} />
        <Route path='/debts' element={<Debts />} />
        <Route path='/debts/:debtId' element={<Debts />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/calendar/:year/:month' element={<Calendar />} />
      </Route>
      <Route path='*'>
        <Route index element={<Navigate to='/dashboard' />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <HistoryRouter history={history}>
          <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ReduxLoader />
              <div className='App'>{<AppRoutes />}</div>
            </LocalizationProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;
