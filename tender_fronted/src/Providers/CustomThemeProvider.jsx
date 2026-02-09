import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { getThemePreferenceFromLocal, setThemePreferenceToLocal } from '../Utils/LocalStorageUtil';

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => getThemePreferenceFromLocal() || 'dark');

    const colorMode = useMemo(() => ({
        mode,
        toggleColorMode: () => {
            setMode((prev) => {
                const theme = prev === 'light' ? 'dark' : 'light';
                setThemePreferenceToLocal(theme);
                return theme;
            });
        },
    }), [mode]);

    const theme = useMemo(() =>
        createTheme({
            palette: mode === 'dark'
                ? {
                        mode: 'dark',
                        primary: { main: '#5893df' },
                        secondary: { main: '#2ec5d3' },
                        background: {
                            default: '#192231',
                            paper: '#24344d',
                        },
                        text: {
                            primary: '#ffffff',
                            secondary: '#a0aec0',
                        },
                        divider: '#2e3c52',
                        success: {
                            main: '#44d48c',
                            contrastText: '#1e1e1e',
                        },
                        error: {
                            main: '#f6685e',
                            contrastText: '#1e1e1e',
                        },
                        warning: {
                            main: '#ffb74d',
                            contrastText: '#1e1e1e',
                        },
                        info: {
                            main: '#64b5f6',
                            contrastText: '#1e1e1e',
                        },
                    }
                : {
                        mode: 'light',
                        primary: { main: '#4d7cd6' },
                        secondary: { main: '#27bfc9' },
                        background: {
                            default: '#eef2f6',
                            paper: '#ffffff',
                        },
                        text: {
                            primary: '#1c1c1e',
                            secondary: '#5a5a5a',
                        },
                        divider: '#d6dbe2',
                        success: {
                            main: '#2eaf7d',
                            contrastText: '#ffffff',
                        },
                        error: {
                            main: '#e53935',
                            contrastText: '#ffffff',
                        },
                        warning: {
                            main: '#f57c00',
                            contrastText: '#ffffff',
                        },
                        info: {
                            main: '#2196f3',
                            contrastText: '#ffffff',
                        },
                    },
            shape: {
                borderRadius: 10,
            },
            typography: {
                fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
                button: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
            components: {
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                            boxShadow:
                                mode === 'light'
                                    ? '0 2px 4px rgba(0,0,0,0.05)'
                                    : '0 2px 4px rgba(0,0,0,0.2)',
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        containedPrimary: {
                            '&:hover': {
                                backgroundColor: mode === 'light' ? '#3a66c3' : '#417fcc',
                            },
                        },
                        containedSuccess: {
                            '&:hover': {
                                backgroundColor: mode === 'light' ? '#24996b' : '#36be91',
                            },
                        },
                        containedError: {
                            '&:hover': {
                                backgroundColor: mode === 'light' ? '#c62828' : '#e05a52',
                            },
                        },
                    },
                },
                MuiAlert: {
                    styleOverrides: {
                        standardSuccess: {
                            backgroundColor: mode === 'light' ? '#2eaf7d' : '#44d48c',
                            color: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        },
                        standardError: {
                            backgroundColor: mode === 'light' ? '#e53935' : '#f6685e',
                            color: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        },
                        standardWarning: {
                            backgroundColor: mode === 'light' ? '#f57c00' : '#ffb74d',
                            color: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        },
                        standardInfo: {
                            backgroundColor: mode === 'light' ? '#2196f3' : '#64b5f6',
                            color: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        },
                    },
                },
            },
        }),
    [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
