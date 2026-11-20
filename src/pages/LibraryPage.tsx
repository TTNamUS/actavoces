import type { JSX } from 'preact';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { RecordingsSection } from '../components/recordings/ui/RecordingsSection.view';

export const LibraryPage = (): JSX.Element => (
  <div class='mx-auto flex max-w-5xl flex-col gap-5 px-8 py-8'>
    <RecordingsSection app={useAppContext()} />
  </div>
);
