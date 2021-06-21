import React, { useState } from 'react';
import { useLifecycles } from 'react-use';
import { useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  ClickAwayListener,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import {
  AccountBox,
  DateRange,
  Dashboard,
  TrendingUp,
} from '@material-ui/icons/';
import { useWindowSize } from 'react-use';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: theme.drawerWidth,
      flexShrink: 0,
    },
  },
  smallDrawer: {
    paddingLeft: '6px',
  },
  grow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  drawerPaperSmall: {
    width: 35,
    display: 'flex',
    overflow: 'visible',
    height: 30,
  },
  drawerPaper: {
    width: theme.drawerWidth,
    display: 'flex',
    overflow: 'visible',
    height: 136,
  },
  content: {
    flexGrow: 1,
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [showDrawer, setShowDrawer] = useState(false);
  // const user = useSelector((state) => state.user);

  const isClient = typeof window === 'object';
  const { height } = useWindowSize();
  // eslint-disable-next-line
  const [windowSize, setWindowSize] = useState(getSize);

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  function handleResize() {
    setWindowSize(getSize());
  }

  useLifecycles(
    () => {
      //mount
      if (!isClient) {
        return false;
      }

      window.addEventListener('resize', handleResize);
    },
    () => {
      //unmount
      window.removeEventListener('resize', handleResize);
    }
  );

  console.log('theme: ', theme);

  const drawer = !showDrawer ? (
    <div className={classes.grow}>
      <List dense={true} style={{ margin: '0px', padding: '0px' }}>
        <ListItem
          dense={true}
          divider={true}
          button
          onClick={() => setShowDrawer(!showDrawer)}
          className={classes.smallDrawer}
        >
          <ListItemIcon style={{ minWidth: '34px' }}>
            <Dashboard />
          </ListItemIcon>
        </ListItem>{' '}
      </List>{' '}
    </div>
  ) : (
    <ClickAwayListener onClickAway={() => setShowDrawer(false)}>
      <div className={classes.grow}>
        <List dense={true} style={{ margin: '0px', padding: '0px' }}>
          <ListItem
            dense={true}
            divider={true}
            button
            onClick={() => history.push('/dashboard')}
          >
            <ListItemIcon style={{ minWidth: '34px' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItem>
          <ListItem
            dense={true}
            divider={true}
            button
            onClick={() => history.push('/summary')}
          >
            <ListItemIcon style={{ minWidth: '34px' }}>
              <DateRange />
            </ListItemIcon>
            <ListItemText>Summary</ListItemText>
          </ListItem>
          <ListItem
            dense={true}
            divider={true}
            button
            onClick={() => history.push('/networth')}
          >
            <ListItemIcon style={{ minWidth: '34px' }}>
              <TrendingUp />
            </ListItemIcon>
            <ListItemText>Net Worth</ListItemText>
          </ListItem>
          <ListItem
            dense={true}
            divider={true}
            button
            onClick={() => history.push('/user')}
          >
            <ListItemIcon style={{ minWidth: '34px' }}>
              <AccountBox />
            </ListItemIcon>
            <ListItemText>User</ListItemText>
          </ListItem>
        </List>
      </div>
    </ClickAwayListener>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label='drawer'>
        <Drawer
          classes={{
            paper: showDrawer ? classes.drawerPaper : classes.drawerPaperSmall,
          }}
          variant='permanent'
          open
          style={{ zIndex: 1200 }}
        >
          {drawer}
        </Drawer>
      </nav>
      <main
        className={classes.content}
        style={{ height: `${height}`, overflow: 'auto' }}
      >
        <Switch>
          <Route path='/dashboard'>
            <p>dashboard</p>
          </Route>
          <Route path='/summary'>
            <p>summary</p>
          </Route>
          <Route path='/networth'>
            <p>networth</p>
          </Route>
          <Route path='/user'>
            <p>user</p>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
