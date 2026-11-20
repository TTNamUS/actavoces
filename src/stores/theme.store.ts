import { type Signal, signal } from '@preact/signals';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeStore {
  mode: Signal<ThemeMode>;
}

export const themeStore: ThemeStore = {
  mode: signal<ThemeMode>('system')
};
