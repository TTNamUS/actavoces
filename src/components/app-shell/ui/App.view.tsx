import type { JSX } from 'preact';
import { AppRoutes } from '../../../routes/AppRoutes';
import { RouteBoundaryContainer } from '../containers/RouteBoundary.container';
import type { ShellModel } from '../hooks/useShell.hook';
import { AppToasts } from './AppToasts.view';
import { ShellSidebar } from './ShellSidebar.view';

interface AppViewProps {
  shell: ShellModel;
}

export const AppView = ({ shell }: AppViewProps): JSX.Element => (
  <main class='flex h-screen overflow-hidden bg-canvas text-ink'>
    <ShellSidebar shell={shell} />
    <section class='min-w-0 flex-1 overflow-y-auto'>
      <RouteBoundaryContainer>
        <AppRoutes />
      </RouteBoundaryContainer>
    </section>
    <AppToasts shell={shell} />
  </main>
);
