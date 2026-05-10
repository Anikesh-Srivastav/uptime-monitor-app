import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState(null);

  const isDark = override !== null ? override : systemScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setOverride(prev => {
    if (prev === null) return !( systemScheme === 'dark');
    return !prev;
  });

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
