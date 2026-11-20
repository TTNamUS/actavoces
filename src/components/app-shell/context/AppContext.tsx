import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { useApp } from '../hooks/useApp.hook';

export type AppContextValue = ReturnType<typeof useApp>;

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = AppContext.Provider;

export const useAppContext = (): AppContextValue => {
  const value = useContext(AppContext);

  if (value === null) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return value;
};
