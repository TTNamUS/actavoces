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
  <main class='app-root flex h-screen overflow-hidden bg-canvas text-ink'>
    <ShellSidebar shell={shell} />
    <section class='scroll-pane min-w-0 flex-1'>
      <RouteBoundaryContainer>
        <AppRoutes />
      </RouteBoundaryContainer>
    </section>
    <AppToasts shell={shell} />
  </main>
);
