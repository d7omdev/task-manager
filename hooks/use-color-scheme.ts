import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function useColorScheme(): 'light' | 'dark' | null {
  const systemScheme = useRNColorScheme();
  const { themeMode, activeTheme } = useTheme();

  if (themeMode === 'system') {
    return systemScheme;
  }

  return activeTheme;
}
