import type { JSX } from 'preact';
import { SettingsContainer } from '../components/settings/containers/Settings.container';

interface SettingsPageProps {
  section?: string;
}

export const SettingsPage = ({ section }: SettingsPageProps): JSX.Element => (
  <SettingsContainer section={section} />
);
