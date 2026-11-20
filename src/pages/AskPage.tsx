import { IconSparkles } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { EmptyState } from '../components/shared/ui/EmptyState.view';

export const AskPage = (): JSX.Element => (
  <div class='mx-auto max-w-3xl px-8 py-8'>
    <EmptyState
      body='Ask questions across every recording on this computer. Coming soon.'
      icon={<IconSparkles aria-hidden='true' size={22} stroke={1.75} />}
      title='Ask your library'
    />
  </div>
);
