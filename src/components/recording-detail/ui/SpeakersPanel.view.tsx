import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Input } from '../../shared/ui/Input.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface SpeakersPanelProps {
  detail: RecordingDetailModel;
}

export const SpeakersPanel = ({ detail }: SpeakersPanelProps): JSX.Element | null =>
  detail.data.speakers.length === 0 ? null : (
    <section class='flex flex-col gap-3'>
      <SectionTitle>Speakers</SectionTitle>
      <ul class='flex flex-col gap-2'>
        {detail.data.speakers.map((speaker) => (
          <li class='flex items-center gap-2 text-[13px]' key={speaker.name}>
            <span class={clsx('h-2 w-2 shrink-0 rounded-full', speaker.colorClass)} />
            {speaker.draft === null ? (
              <>
                <span class='min-w-0 flex-1 truncate font-medium'>{speaker.name}</span>
                <span class='text-ink-3'>{speaker.lineCount} lines</span>
                <Button onClick={speaker.onRename} size='sm' variant='ghost'>
                  Rename
                </Button>
              </>
            ) : (
              <form
                class='flex flex-1 items-center gap-2'
                onSubmit={detail.actions.onSubmitSpeaker}
              >
                <Input
                  aria-label={`New name for ${speaker.name}`}
                  autofocus
                  class='h-8 min-w-0 flex-1'
                  onInput={detail.actions.onSpeakerInput}
                  onKeyDown={detail.actions.onSpeakerKeyDown}
                  value={speaker.draft}
                />
                <Button disabled={detail.status.busy} size='sm' type='submit' variant='primary'>
                  Save
                </Button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
