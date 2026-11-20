import type { JSX } from 'preact';
import { Card } from '../../shared/ui/Card.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { Spinner } from '../../shared/ui/Spinner.view';
import { ToneDot } from '../../shared/ui/ToneDot.view';
import type { LibraryModel } from '../hooks/useLibrary.hook';

type Processing = NonNullable<LibraryModel['data']['nowProcessing']>;

interface NowProcessingCardProps {
  processing: Processing;
}

export const NowProcessingCard = ({ processing }: NowProcessingCardProps): JSX.Element => (
  <Card class='rise flex flex-col gap-3 p-4'>
    <SectionTitle>Now processing</SectionTitle>
    <button
      class='focus-ring flex flex-col gap-3 rounded-md text-left'
      onClick={processing.onOpen}
      type='button'
    >
      <div class='flex items-center justify-between gap-4'>
        <span class='flex min-w-0 items-center gap-2'>
          <Spinner size={14} />
          <span class='max-w-60 shrink-0 truncate font-medium'>{processing.title}</span>
          <span class='min-w-0 flex-1 truncate text-[13px] text-ink-3'>{processing.message}</span>
        </span>
        <span class='font-mono text-[13px] text-ink-2 tabular-nums'>{processing.progress}%</span>
      </div>
      <ProgressBar label='Processing progress' value={processing.progress} />
      <ul class='flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-3'>
        {processing.stages.map((stage) => (
          <li class='flex items-center gap-1.5' key={stage.id}>
            <ToneDot tone={stage.tone} />
            {stage.label}
          </li>
        ))}
      </ul>
    </button>
  </Card>
);
