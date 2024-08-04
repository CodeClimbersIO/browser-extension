import React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteOptions } from '@mui/material';
import { useSelector } from 'react-redux';
import { ConfigReducer, ReduxSelector } from '../types/store';

// Needs to be kept in sync with CodeClimbers/cli/packages/app theme
const palette: PaletteOptions = {};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...palette,
  },
});

const getTheme = (theme: ConfigReducer['theme']) => {
  return theme === 'light' ? lightTheme : darkTheme;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme }: ConfigReducer = useSelector((selector: ReduxSelector) => selector.config);

  console.log({ theme });

  return <MuiThemeProvider theme={getTheme(theme)}>{children}</MuiThemeProvider>;
};

type NoReduxThemeProviderProps = ThemeProviderProps & {
  theme: ConfigReducer['theme'];
};

export const NoReduxThemeProvider = ({ children, theme }: NoReduxThemeProviderProps) => (
  <MuiThemeProvider theme={getTheme(theme)}>{children}</MuiThemeProvider>
);
