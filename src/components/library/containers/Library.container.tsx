import type { JSX } from 'preact';
import { useLibrary } from '../hooks/useLibrary.hook';
import { LibraryView } from '../ui/Library.view';

export const LibraryContainer = (): JSX.Element => <LibraryView library={useLibrary()} />;
