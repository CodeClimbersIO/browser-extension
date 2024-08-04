import React from "react";
import type { PaletteOptions } from "@mui/material";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { configStore } from "./configStore";
import type { CodeClimbers } from "@src/types/codeclimbers";

// Needs to be kept in sync with CodeClimbers/cli/packages/app theme
const palette: PaletteOptions = {};

const lightTheme = createTheme({
  palette: {
    mode: "light",
    ...palette,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    ...palette,
  },
});

const getTheme = (theme: CodeClimbers.Style["theme"]) => {
  return theme === "light" ? lightTheme : darkTheme;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useStore(configStore, (s) => s.theme);

  return (
    <MuiThemeProvider theme={getTheme(theme)}>{children}</MuiThemeProvider>
  );
};

type LocalThemeProviderProps = ThemeProviderProps & {
  theme: CodeClimbers.Style["theme"];
};

export const LocalThemeProvider = ({
  children,
  theme,
}: LocalThemeProviderProps) => (
  <MuiThemeProvider theme={getTheme(theme)}>{children}</MuiThemeProvider>
);
