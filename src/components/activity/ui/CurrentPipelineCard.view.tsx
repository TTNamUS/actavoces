import { IconFolderOpen, IconRefresh } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { StatusBadge } from '../../shared/ui/StatusBadge.view';
import type { ActivityModel } from '../hooks/useActivity.hook';

type Current = NonNullable<ActivityModel['data']['current']>;

interface CurrentPipelineCardProps {
  busy: boolean;
  current: Current;
}

export const CurrentPipelineCard = ({ busy, current }: CurrentPipelineCardProps): JSX.Element => (
  <Card class='flex flex-col gap-5 p-5'>
    <div class='flex items-start justify-between gap-4'>
      <div class='flex min-w-0 flex-col gap-1'>
        <SectionTitle>Current pipeline</SectionTitle>
        <button
          class='focus-ring w-fit max-w-full truncate rounded-md text-left font-serif text-[24px] leading-tight hover:text-ember'
          onClick={current.onOpen}
          type='button'
        >
          {current.title}
        </button>
        <p class='text-[13px] text-ink-3'>{current.dateLabel}</p>
      </div>
      <div class='flex shrink-0 items-center gap-2'>
        <StatusBadge label={current.status.label} status={current.status.status} />
        <Button
          aria-label='Open recording folder'
          onClick={current.onOpenFolder}
          size='iconSm'
          variant='ghost'
        >
          <IconFolderOpen aria-hidden='true' size={16} stroke={1.75} />
        </Button>
        <Button
          aria-label='Retry failed jobs'
          disabled={busy || !current.canRetry}
          onClick={current.onRetry}
          size='iconSm'
          variant='ghost'
        >
          <IconRefresh aria-hidden='true' size={16} stroke={1.75} />
        </Button>
      </div>
    </div>
    <div class='flex flex-col gap-2'>
      <ProgressBar label='Pipeline progress' tone={current.tone} value={current.progress} />
      <p class='flex justify-between text-[13px] text-ink-2'>
        {current.status.message}
        <span class='font-mono tabular-nums'>{current.progress}%</span>
      </p>
    </div>
    <ul class='grid grid-cols-2 gap-3 lg:grid-cols-4'>
      {current.stages.map((stage) => (
        <li
          class='flex flex-col gap-2 rounded-lg border border-line bg-canvas-2 p-3'
          key={stage.id}
        >
          <div class='flex items-center justify-between gap-2'>
            <span class='font-medium text-sm'>{stage.label}</span>
            {stage.percentLabel === null ? null : (
              <span class='font-mono text-[12px] text-ink-2 tabular-nums'>
                {stage.percentLabel}
              </span>
            )}
          </div>
          <StatusBadge status={stage.status} />
          <p class='line-clamp-2 text-[12px] text-ink-3'>{stage.message}</p>
        </li>
      ))}
    </ul>
  </Card>
);
