import type { JSX } from 'preact';
import { Router } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { AppProvider } from '../context/AppContext';
import { useApp } from '../hooks/useApp.hook';
import { useShell } from '../hooks/useShell.hook';
import { AppView } from '../ui/App.view';

const ShellContainer = (): JSX.Element => <AppView shell={useShell()} />;

export const AppContainer = (): JSX.Element => (
  <AppProvider value={useApp()}>
    <Router hook={useHashLocation}>
      <ShellContainer />
    </Router>
  </AppProvider>
);
