import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import AccountDialog from '../../components/Dialog/AccountDialog';
import AssetDialog from '../../components/Dialog/AssetDialog';
import BillDialog from '../../components/Dialog/BillDialog ';
import BorrowDialog from '../../components/Dialog/BorrowDialog';
import DebtDialog from '../../components/Dialog/DebtDialog';
import ExpenseDialog from '../../components/Dialog/ExpenseDialog';
import IncomeDialog from '../../components/Dialog/IncomeDialog';
import NetworthDialog from '../../components/Dialog/NetworthDialog';
import PaycheckDialog from '../../components/Dialog/PaycheckDialog';
import PurchaseDialog from '../../components/Dialog/PurchaseDialog';
import RepaymentDialog from '../../components/Dialog/RepaymentDialog';
import SaleDialog from '../../components/Dialog/SaleDialog';
import TransactionsDialog from '../../components/Dialog/TransactionsDialog';

import { getUser } from '../../store/user';
import CustomBottomNavigation from './CustomBottomNavigation';
import CustomSnackbar from './CustomSnackbar';

const USER_ID = process.env.REACT_APP_USER_ID;

function Layout() {
  const dispatch = useDispatch();

  /* onMount */
  useEffect(() => {
    dispatch(getUser(USER_ID));
    /* eslint-disable-next-line */
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <CssBaseline />
      <Outlet />
      <CustomBottomNavigation />
      <AccountDialog />
      <AssetDialog />
      <BillDialog />
      <BorrowDialog />
      <DebtDialog />
      <ExpenseDialog />
      <IncomeDialog />
      <NetworthDialog />
      <PaycheckDialog />
      <PurchaseDialog />
      <RepaymentDialog />
      <SaleDialog />
      <TransactionsDialog />
      <CustomSnackbar />
    </Box>
  );
}

export default Layout;
