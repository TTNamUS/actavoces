import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { SettingsPageModel } from '../hooks/useSettingsPage.hook';

const SettingsContext = createContext<SettingsPageModel | null>(null);

export const SettingsProvider = SettingsContext.Provider;

export const useSettingsContext = (): SettingsPageModel => {
  const value = useContext(SettingsContext);

  if (value === null) {
    throw new Error('useSettingsContext must be used inside SettingsProvider');
  }

  return value;
};
