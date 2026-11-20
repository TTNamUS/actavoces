import type { JSX } from 'preact';
import { SetupPage } from '../../../pages/SetupPage';
import { AppRoutes } from '../../../routes/AppRoutes';
import type { ShellModel } from '../hooks/useShell.hook';
import { AppToasts } from './AppToasts.view';
import { ShellSidebar } from './ShellSidebar.view';

interface AppViewProps {
  shell: ShellModel;
}

export const AppView = ({ shell }: AppViewProps): JSX.Element => (
  <main class='flex h-screen overflow-hidden bg-canvas text-ink'>
    {shell.status.showChrome ? <ShellSidebar shell={shell} /> : null}
    <section class='min-w-0 flex-1 overflow-y-auto'>
      {shell.status.setupReady ? <AppRoutes /> : <SetupPage />}
    </section>
    <AppToasts shell={shell} />
  </main>
);
