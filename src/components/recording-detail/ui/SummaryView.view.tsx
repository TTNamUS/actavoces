import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Markdown } from '../../shared/ui/Markdown.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface SummaryViewProps {
  detail: RecordingDetailModel;
}

export const SummaryView = ({ detail }: SummaryViewProps): JSX.Element => {
  if (detail.data.summaryBlocks !== null) {
    return <Markdown blocks={detail.data.summaryBlocks} onSeek={detail.actions.onSeekTimestamp} />;
  }

  if (!detail.data.summaryEnabled) {
    return (
      <div class='flex flex-col items-start gap-3'>
        <p class='text-ink-2'>Summaries are turned off. Add an AI provider to generate them.</p>
        <Button onClick={detail.actions.onOpenAiSettings} size='sm' variant='outline'>
          Open AI settings
        </Button>
      </div>
    );
  }

  return <p class='text-ink-2'>No summary yet.</p>;
};
