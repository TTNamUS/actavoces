import type { JSX } from 'preact';
import { SettingsProvider } from '../context/SettingsContext';
import { useSettingsPage } from '../hooks/useSettingsPage.hook';
import { SettingsView } from '../ui/Settings.view';

interface SettingsContainerProps {
  section?: string;
}

export const SettingsContainer = ({ section }: SettingsContainerProps): JSX.Element => (
  <SettingsProvider value={useSettingsPage(section)}>
    <SettingsView />
  </SettingsProvider>
);
