import { IconFolderOpen, IconRefresh } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import { StatusBadge } from '../../shared/ui/StatusBadge.view';
import type { ActivityModel } from '../hooks/useActivity.hook';

type Group = ActivityModel['data']['groups'][number];

interface JobGroupCardProps {
  busy: boolean;
  group: Group;
}

export const JobGroupCard = ({ busy, group }: JobGroupCardProps): JSX.Element => (
  <Card class='flex flex-col gap-4 p-4'>
    <div class='flex items-center justify-between gap-4'>
      <div class='flex min-w-0 items-center gap-3'>
        <button
          class='focus-ring truncate rounded-md text-left font-medium text-[15px] hover:text-ember'
          onClick={group.onOpen}
          type='button'
        >
          {group.title}
        </button>
        <StatusBadge label={group.status.label} status={group.status.status} />
        <span class='shrink-0 text-[12px] text-ink-3'>{group.dateLabel}</span>
      </div>
      <div class='flex shrink-0 items-center gap-1'>
        <Button
          aria-label='Open recording folder'
          onClick={group.onOpenFolder}
          size='iconSm'
          variant='ghost'
        >
          <IconFolderOpen aria-hidden='true' size={16} stroke={1.75} />
        </Button>
        <Button
          aria-label='Retry failed jobs'
          disabled={busy || !group.canRetry}
          onClick={group.onRetry}
          size='iconSm'
          variant='ghost'
        >
          <IconRefresh aria-hidden='true' size={16} stroke={1.75} />
        </Button>
      </div>
    </div>
    <ul class='flex flex-col'>
      {group.jobs.map((job) => (
        <li
          class='grid grid-cols-[120px_auto_minmax(0,1fr)_120px] items-center gap-4 border-line border-t py-2.5 text-[13px]'
          key={job.id}
        >
          <span class='font-medium'>{job.label}</span>
          <StatusBadge status={job.status} />
          <span class='truncate text-ink-3'>{job.message}</span>
          <ProgressBar label={`${job.label} progress`} value={job.progress} />
        </li>
      ))}
    </ul>
  </Card>
);
