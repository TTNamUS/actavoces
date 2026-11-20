import type { JSX } from 'preact';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { DashboardContainer } from '../components/dashboard/containers/Dashboard.container';

export const OverviewPage = (): JSX.Element => (
  <div class='mx-auto flex max-w-5xl flex-col gap-5 px-8 py-8'>
    <DashboardContainer app={useAppContext()} />
  </div>
);
