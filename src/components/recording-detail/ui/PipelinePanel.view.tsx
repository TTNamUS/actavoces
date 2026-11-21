import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { ToneDot } from '../../shared/ui/ToneDot.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface PipelinePanelProps {
  detail: RecordingDetailModel;
}

export const PipelinePanel = ({ detail }: PipelinePanelProps): JSX.Element => (
  <section class='flex flex-col gap-3'>
    <SectionTitle>Pipeline</SectionTitle>
    <ProgressBar label='Recording pipeline progress' value={detail.data.progress} />
    <ul class='flex flex-col gap-2'>
      {detail.data.stages.map((stage) => (
        <li class='flex items-center gap-2 text-[13px]' key={stage.id}>
          <ToneDot tone={stage.tone} />
          <span class='font-medium'>{stage.label}</span>
          <span class='min-w-0 flex-1 truncate text-ink-3'>{stage.message}</span>
          {stage.percentLabel === null ? null : (
            <span class='font-mono text-ink-2 tabular-nums'>{stage.percentLabel}</span>
          )}
        </li>
      ))}
    </ul>
    {detail.status.canRetry ? (
      <Button
        disabled={detail.status.busy}
        onClick={detail.actions.onRetry}
        size='sm'
        variant='outline'
      >
        Retry failed jobs
      </Button>
    ) : null}
  </section>
);
