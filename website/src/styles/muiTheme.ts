import { createMuiTheme } from '@material-ui/core';

import colors from './colors';

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary['500'],
      light: colors.primary['700'],
      dark: colors.primary['300'],
      contrastText: 'white',
    },
    secondary: {
      main: colors.basic['500'],
      light: colors.basic['700'],
      dark: colors.basic['300'],
      contrastText: 'white',
    },
    success: {
      main: colors.success['500'],
      light: colors.success['700'],
      dark: colors.success['300'],
      contrastText: 'white',
    },
    info: {
      main: colors.info['500'],
      light: colors.info['700'],
      dark: colors.info['300'],
      contrastText: 'white',
    },
    warning: {
      main: colors.warning['500'],
      light: colors.warning['700'],
      dark: colors.warning['300'],
      contrastText: 'white',
    },
    error: {
      main: colors.danger['500'],
      light: colors.danger['700'],
      dark: colors.danger['300'],
      contrastText: 'white',
    },
  },
});
