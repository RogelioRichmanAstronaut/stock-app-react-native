import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Mock ThemeContext
const ThemeContext = React.createContext({
  isDark: false,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
