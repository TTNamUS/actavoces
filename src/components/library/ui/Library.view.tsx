import { IconMicrophone, IconSearch } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { ConfirmDeleteDialog } from '../../shared/ui/ConfirmDeleteDialog.view';
import { EmptyState } from '../../shared/ui/EmptyState.view';
import { Input } from '../../shared/ui/Input.view';
import { Kbd } from '../../shared/ui/Kbd.view';
import { PageHeader } from '../../shared/ui/PageHeader.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import type { LibraryModel } from '../hooks/useLibrary.hook';
import { NowProcessingCard } from './NowProcessingCard.view';
import { RecordingRow } from './RecordingRow.view';

interface LibraryViewProps {
  library: LibraryModel;
}

export const LibraryView = ({ library }: LibraryViewProps): JSX.Element => (
  <div class='mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-8 px-8 py-8'>
    <PageHeader
      actions={
        library.status.isEmpty ? undefined : (
          <div class='relative flex w-72 items-center'>
            <IconSearch
              aria-hidden='true'
              class='pointer-events-none absolute left-3 text-ink-3'
              size={16}
              stroke={1.75}
            />
            <Input
              aria-label='Search recordings'
              class='w-full pl-9'
              onInput={library.actions.onSearchInput}
              placeholder='Search titles'
              value={library.data.query}
            />
          </div>
        )
      }
      subtitle={library.data.subtitle}
      title='Library'
    />

    {library.data.nowProcessing === null ? null : (
      <NowProcessingCard processing={library.data.nowProcessing} />
    )}

    {library.status.isEmpty ? (
      <EmptyState
        action={
          <div class='flex flex-col items-center gap-2'>
            <Button
              disabled={library.status.busy || library.status.isRecording}
              onClick={library.actions.onRecord}
              variant='primary'
            >
              <span class='h-2.5 w-2.5 rounded-full bg-ember' />
              Record now
            </Button>
            <p class='flex items-center gap-1.5 text-[12px] text-ink-3'>
              or press <Kbd>{library.status.hotkey}</Kbd>
            </p>
          </div>
        }
        body='Start a recording and it will show up here, transcribed and summarized on this computer.'
        icon={<IconMicrophone aria-hidden='true' size={22} stroke={1.75} />}
        title='Nothing recorded yet'
      />
    ) : null}

    {library.status.noResults ? (
      <p class='py-12 text-center text-ink-2'>No recordings match this search.</p>
    ) : null}

    {library.data.groups.map((group) => (
      <section class='flex flex-col gap-1' key={group.label}>
        <SectionTitle class='px-3 pb-2'>{group.label}</SectionTitle>
        {group.rows.map((row) => (
          <RecordingRow key={row.id} row={row} />
        ))}
      </section>
    ))}

    <ConfirmDeleteDialog
      onCancel={library.actions.onCancelDelete}
      onConfirm={library.actions.onConfirmDelete}
      title={library.data.deleteTitle}
    />
  </div>
);
