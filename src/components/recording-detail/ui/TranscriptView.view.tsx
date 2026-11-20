import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { Markdown } from '../../shared/ui/Markdown.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface TranscriptViewProps {
  detail: RecordingDetailModel;
}

export const TranscriptView = ({ detail }: TranscriptViewProps): JSX.Element => {
  if (detail.data.mode === 'raw') {
    return detail.data.rawBlocks === null ? (
      <p class='text-ink-2'>No raw transcript yet.</p>
    ) : (
      <Markdown blocks={detail.data.rawBlocks} />
    );
  }

  if (detail.data.hasUtterances) {
    return (
      <div class='select-text flex flex-col gap-5'>
        {detail.data.groups.map((group) => (
          <section class='flex flex-col gap-1' key={group.lines[0].index}>
            <h3 class='flex items-center gap-2 font-semibold text-sm'>
              <span class={clsx('h-2 w-2 rounded-full', group.colorClass)} />
              {group.speaker}
            </h3>
            {group.lines.map((line) => (
              <div
                class={clsx(
                  'flex gap-3 rounded-lg px-2 py-1 leading-relaxed',
                  detail.data.activeLine === line.index && 'bg-ember-soft'
                )}
                key={line.index}
              >
                <button
                  class='focus-ring h-6 shrink-0 rounded-md font-mono text-[12px] text-ink-3 tabular-nums hover:text-ember'
                  onClick={line.onSeek}
                  type='button'
                >
                  {line.timeLabel}
                </button>
                <p class='text-[15px]'>{line.text}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    );
  }

  return detail.data.transcriptBlocks === null ? (
    <p class='text-ink-2'>
      {detail.status.contentLoading ? 'Loading transcript…' : 'No transcript yet.'}
    </p>
  ) : (
    <Markdown blocks={detail.data.transcriptBlocks} />
  );
};
