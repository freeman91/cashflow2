import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'redux-first-history';

import find from 'lodash/find';

import BackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import { saveNetworth } from '../../store/networths';
import AccountsTable from './AccountsTable';
import AccountPage from './AccountPage';
import CurrentNetworth from '../Dashboard/Networth/CurrentNetworth';
import PageSelect from '../../components/Selector/PageSelect';

export default function Accounts() {
  const dispatch = useDispatch();
  const location = useLocation();
  const accounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState(null);
  const [id, setId] = useState('');

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/accounts', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      let _account = find(accounts, { account_id: id });
      setAccount(_account);
    } else {
      setAccount(null);
    }
  }, [accounts, id]);

  const handleSaveNetworth = () => {
    dispatch(saveNetworth());
  };

  const renderComponent = () => {
    if (account) {
      return <AccountPage account={account} />;
    }
    return <AccountsTable />;
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar sx={{ minHeight: '40px' }}>
          <IconButton onClick={() => dispatch(goBack())}>
            <BackIcon />
          </IconButton>
          <Typography
            align='center'
            variant='h6'
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              ml: account ? 'unset' : '40px',
            }}
          >
            accounts
          </Typography>
          {account ? (
            <IconButton
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'account',
                    mode: 'edit',
                    id: account.account_id,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleSaveNetworth} sx={{ mr: 1 }}>
              <SaveIcon />
            </IconButton>
          )}
          {!account && <PageSelect />}
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={1}
        sx={{
          pl: 1,
          pr: 1,
          pt: 1,
          mb: 8,
        }}
      >
        {!account && (
          <Grid item xs={12}>
            <Card raised>
              <CardContent sx={{ p: 1, pt: '4px', pb: '0 !important' }}>
                <CurrentNetworth />
              </CardContent>
            </Card>
          </Grid>
        )}

        {renderComponent()}
      </Grid>
    </>
  );
}
