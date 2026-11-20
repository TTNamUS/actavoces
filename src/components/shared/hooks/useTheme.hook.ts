import { type ThemeMode, themeStore } from '../../../stores/theme.store';
import { resolveTheme, setThemeMode } from '../../../utils/theme';

const NEXT_MODE: Record<'light' | 'dark', ThemeMode> = { light: 'dark', dark: 'light' };

export const useTheme = () => {
  const mode = themeStore.mode.value;
  const resolved = resolveTheme(mode);

  return {
    mode,
    resolved,
    setMode: setThemeMode,
    toggle: () => setThemeMode(NEXT_MODE[resolved])
  };
};
