import { IconFolderOpen, IconPencil, IconRefresh, IconTrash } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Input } from '../../shared/ui/Input.view';
import { StatusBadge } from '../../shared/ui/StatusBadge.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface RecordingHeaderProps {
  detail: RecordingDetailModel;
  title: string;
}

export const RecordingHeader = ({ detail, title }: RecordingHeaderProps): JSX.Element => (
  <header class='flex items-start justify-between gap-6'>
    <div class='flex min-w-0 flex-1 flex-col gap-2'>
      {detail.status.editingTitle ? (
        <form class='flex items-center gap-2' onSubmit={detail.actions.onSubmitTitle}>
          <Input
            aria-label='Recording title'
            autofocus
            class='h-11 flex-1 font-serif text-[22px]'
            onInput={detail.actions.onTitleInput}
            onKeyDown={detail.actions.onTitleKeyDown}
            value={detail.data.titleDraft ?? ''}
          />
          <Button disabled={detail.status.busy} type='submit' variant='primary'>
            Save
          </Button>
        </form>
      ) : (
        <div class='flex items-center gap-2'>
          <h1 class='truncate font-serif text-[32px] leading-none tracking-tight'>{title}</h1>
          <Button
            aria-label='Rename recording'
            onClick={detail.actions.onStartTitleEdit}
            size='iconSm'
            variant='ghost'
          >
            <IconPencil aria-hidden='true' size={16} stroke={1.75} />
          </Button>
        </div>
      )}
      <p class='flex items-center gap-2 text-ink-2'>
        {detail.data.dateLabel}
        <span class='font-mono text-[13px] tabular-nums'>{detail.data.durationLabel}</span>
        <StatusBadge status={detail.data.status} />
      </p>
    </div>
    <div class='flex shrink-0 items-center gap-2'>
      <Button onClick={detail.actions.onOpenFolder} size='sm' variant='outline'>
        <IconFolderOpen aria-hidden='true' size={15} stroke={1.75} />
        Open folder
      </Button>
      <Button
        disabled={detail.status.busy || !detail.status.canRerunSummary}
        onClick={detail.actions.onRerunSummary}
        size='sm'
        variant='outline'
      >
        <IconRefresh aria-hidden='true' size={15} stroke={1.75} />
        Re-run summary
      </Button>
      <Button
        aria-label='Delete recording'
        onClick={detail.actions.onAskDelete}
        size='iconSm'
        variant='danger'
      >
        <IconTrash aria-hidden='true' size={15} stroke={1.75} />
      </Button>
    </div>
  </header>
);
