import React from 'react';

import { styled } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
  minHeight: 'unset',
}));

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  paddingBottom: 4,
  minHeight: 'unset',
  '&.Mui-selected': {
    color: 'white',
    fontWeight: 'bold',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export { StyledTabs, StyledTab };
