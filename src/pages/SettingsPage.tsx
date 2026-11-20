import type { JSX } from 'preact';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { SettingsRoute } from '../components/settings/ui/SettingsRoute.view';

export const SettingsPage = (): JSX.Element => (
  <div class='mx-auto flex max-w-3xl flex-col gap-5 px-8 py-8'>
    <SettingsRoute app={useAppContext()} />
  </div>
);
