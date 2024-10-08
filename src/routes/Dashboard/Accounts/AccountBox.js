import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@emotion/react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LaunchIcon from '@mui/icons-material/Launch';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexColumn from '../../../components/BoxFlexColumn';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import { openDialog } from '../../../store/dialogs';

export default function AccountBox(props) {
  const { account } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClick = (account) => {
    dispatch(push('/dashboard/accounts', { accountId: account.account_id }));
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    window.open(account.url, '_blank');
  };

  const openAccountDialog = (e) => {
    e.stopPropagation();
    dispatch(
      openDialog({
        type: 'account',
        mode: 'edit',
        id: account.account_id,
      })
    );
  };

  return (
    <Box
      key={account.account_id}
      onClick={() => handleClick(account)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        pl: 1,
        pr: 2,
        cursor: 'pointer',
      }}
    >
      <IconButton
        onClick={openAccountDialog}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
          boxShadow: 6,
          borderRadius: '50%',
          p: '4px',
          color: 'grey',
        }}
      >
        <AccountBalanceIcon />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 2,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            color='grey.0'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {account.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {account.account_type}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexCenter>
          <Typography variant='h5' color='grey.10'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(account.net)}
          </Typography>
        </BoxFlexCenter>
      </Box>
      <IconButton
        color='primary'
        onClick={handleLinkClick}
        disabled={!account.url}
        sx={{ p: '4px', ml: 2 }}
      >
        <LaunchIcon />
      </IconButton>
    </Box>
  );
}
