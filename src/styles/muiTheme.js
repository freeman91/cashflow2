import { createTheme } from '@mui/material/styles';
import {
  grey,
  blue,
  green,
  red,
  yellow,
  orange,
  purple,
} from '@mui/material/colors';

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      dark: '#272727',
      light: '#2e2e2e',
    },
    primary: { main: '#0067F5' },
    secondary: { main: green[500] },
    grey,
    blue,
    green,
    red,
    yellow,
    orange,
    purple,
    black: '#121212',
  },
  typography: {
    fontFamily: '"Helvetica", "Arial", sans-serif',
    defaultFontSize: '0.875rem',
    button: {
      textTransform: 'none',
    },
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: breakpoints,
    maxWidth: 1000,
  },
  drawerWidth: 175,
  chartColors: {
    housing: '#006633',
    utility: '#CCCC33',
    food: '#00CC66',
    transportation: '#CC6600',
    health: '#0099FF',
    entertainment: '#666666',
    project: '#FF6633',
    shopping: '#FFFF00',
    travel: '#6633FF',
    other: ' 	#808080',
  },
});
