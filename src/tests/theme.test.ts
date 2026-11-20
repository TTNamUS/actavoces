import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { themeStore } from '../stores/theme.store';
import {
  applyTheme,
  installTheme,
  readStoredTheme,
  resolveTheme,
  setThemeMode,
  THEME_STORAGE_KEY
} from '../utils/theme';

const mockSystemDark = (dark: boolean) => {
  const listeners: (() => void)[] = [];
  const media = {
    matches: dark,
    addEventListener: (_: string, cb: () => void) => listeners.push(cb),
    removeEventListener: vi.fn()
  };
  vi.stubGlobal('matchMedia', () => media);
  return {
    flip: () => {
      media.matches = !media.matches;
      for (const cb of listeners) {
        cb();
      }
    }
  };
};

describe('theme utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    themeStore.mode.value = 'system';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to system for missing or invalid stored values', () => {
    expect(readStoredTheme()).toBe('system');
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(readStoredTheme()).toBe('system');
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(readStoredTheme()).toBe('dark');
  });

  it('resolves system mode from the OS preference', () => {
    mockSystemDark(true);
    expect(resolveTheme('system')).toBe('dark');
    expect(resolveTheme('light')).toBe('light');
  });

  it('applies and persists the chosen mode', () => {
    mockSystemDark(false);
    setThemeMode('dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(themeStore.mode.value).toBe('dark');
  });

  it('follows OS changes only in system mode and syncs other windows via storage', () => {
    const system = mockSystemDark(false);
    const dispose = installTheme();
    expect(document.documentElement.dataset.theme).toBe('light');

    system.flip();
    expect(document.documentElement.dataset.theme).toBe('dark');

    applyTheme('light');
    system.flip();
    expect(document.documentElement.dataset.theme).toBe('light');

    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY }));
    expect(document.documentElement.dataset.theme).toBe('dark');

    dispose();
  });
});
