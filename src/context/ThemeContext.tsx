import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem('theme').then((savedTheme) => {
      if (savedTheme) {
        setThemeState(savedTheme as ThemeMode);
      }
    });
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  // Fix: Properly determine dark mode based on theme selection
  const isDark = React.useMemo(() => {
    switch (theme) {
      case 'dark':
        return true;
      case 'light':
        return false;
      case 'system':
        return systemColorScheme === 'dark';
      default:
        return true;
    }
  }, [theme, systemColorScheme]);

  const contextValue = {
    theme,
    isDark,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
