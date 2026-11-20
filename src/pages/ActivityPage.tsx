import type { JSX } from 'preact';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { JobsRoute } from '../components/jobs/ui/JobsRoute.view';

export const ActivityPage = (): JSX.Element => (
  <div class='mx-auto flex max-w-4xl flex-col gap-5 px-8 py-8'>
    <JobsRoute app={useAppContext()} />
  </div>
);
