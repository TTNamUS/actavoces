import { type ThemeMode, themeStore } from '../stores/theme.store';

export const THEME_STORAGE_KEY = 'actavoces.theme';

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

export const isThemeMode = (value: unknown): value is ThemeMode =>
  THEME_MODES.includes(value as ThemeMode);

export const readStoredTheme = (): ThemeMode => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
};

export const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode !== 'system') {
    return mode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (mode: ThemeMode) => {
  themeStore.mode.value = mode;
  document.documentElement.dataset.theme = resolveTheme(mode);
};

export const setThemeMode = (mode: ThemeMode) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // storage unavailable: theme still applies for this session
  }

  applyTheme(mode);
};

export const installTheme = (): (() => void) => {
  applyTheme(readStoredTheme());

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = () => {
    if (themeStore.mode.value === 'system') {
      applyTheme('system');
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(readStoredTheme());
    }
  };

  media.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);

  return () => {
    media.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
  };
};
