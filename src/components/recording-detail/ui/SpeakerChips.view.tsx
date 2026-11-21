import { IconUsers } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface SpeakerChipsProps {
  detail: RecordingDetailModel;
}

export const SpeakerChips = ({ detail }: SpeakerChipsProps): JSX.Element | null =>
  detail.data.speakers.length === 0 ? null : (
    <div class='flex flex-wrap items-center gap-2'>
      <IconUsers aria-hidden='true' className='text-ink-3' size={16} stroke={1.75} />
      {detail.data.speakers.map((speaker) => (
        <button
          class='focus-ring flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[13px] hover:bg-canvas-2'
          key={speaker.name}
          onClick={speaker.onRename}
          title='Rename speaker'
          type='button'
        >
          <span class={clsx('h-2 w-2 rounded-full', speaker.colorClass)} />
          {speaker.name}
        </button>
      ))}
    </div>
  );
