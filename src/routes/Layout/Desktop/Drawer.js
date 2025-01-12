import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';

import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import TableRowsIcon from '@mui/icons-material/TableRows';

import { useColorScheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoImg from '../../../components/LogoImg';

const PageButton = (props) => {
  const { pageName, currentPage, icon } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push(`/${pageName.toLowerCase()}`, {}));
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        m: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: (theme) =>
          currentPage === pageName.toLowerCase()
            ? theme.palette.surface[250]
            : 'unset',
      }}
    >
      <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={pageName}
        slotProps={{
          primary: {
            variant: 'body2',
          },
        }}
      />
    </ListItemButton>
  );
};

export default function DesktopDrawer(props) {
  const { PaperProps } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const { mode, setMode } = useColorScheme();
  const [page, setPage] = useState('');

  useEffect(() => {
    const _page = location.pathname.split('/')[1];
    setPage(_page);
  }, [location]);

  return (
    <Drawer variant='permanent' PaperProps={PaperProps}>
      <List disablePadding>
        <ListItem
          sx={{ display: 'flex', justifyContent: 'space-between', pr: 0 }}
        >
          <ListItemIcon sx={{ minWidth: 'fit-content' }}>
            <LogoImg />
          </ListItemIcon>
          <Box>
            <IconButton
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            >
              {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton onClick={() => dispatch(push('/settings'))}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </ListItem>
        <PageButton
          pageName='Dashboard'
          currentPage={page}
          icon={<HomeIcon />}
        />
        <PageButton
          pageName='Accounts'
          currentPage={page}
          icon={<LayersIcon />}
        />
        <PageButton
          pageName='Transactions'
          currentPage={page}
          icon={<TableRowsIcon />}
        />
        <PageButton
          pageName='Reports'
          currentPage={page}
          icon={<AssessmentIcon />}
        />
        <PageButton
          pageName='Budgets'
          currentPage={page}
          icon={<AssignmentIcon />}
        />
        <PageButton
          pageName='Recurring'
          currentPage={page}
          icon={<ScheduleIcon />}
        />
      </List>
    </Drawer>
  );
}
