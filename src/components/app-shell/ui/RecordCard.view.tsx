import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Kbd } from '../../shared/ui/Kbd.view';

interface RecordCardProps {
  data: { elapsedLabel: string; hotkey: string };
  status: { isRecording: boolean; loading: boolean };
  actions: { onStart: () => void; onStop: () => void };
}

export const RecordCard = ({ data, status, actions }: RecordCardProps): JSX.Element =>
  status.isRecording ? (
    <div class='flex flex-col gap-3 rounded-lg border border-ember/30 bg-ember-soft p-3'>
      <div class='flex items-center justify-between'>
        <span class='flex items-center gap-2 font-semibold text-sm'>
          <span class='rec-dot h-2 w-2 rounded-full bg-ember' />
          Recording
        </span>
        <span class='font-mono text-sm tabular-nums'>{data.elapsedLabel}</span>
      </div>
      <Button disabled={status.loading} onClick={actions.onStop} variant='ember'>
        <span class='h-2.5 w-2.5 rounded-xs bg-on-ember' />
        Stop
      </Button>
    </div>
  ) : (
    <div class='flex flex-col gap-3 rounded-lg border border-line bg-canvas p-3 shadow-card'>
      <p class='font-serif text-[20px] leading-tight'>Ready when you are.</p>
      <Button disabled={status.loading} onClick={actions.onStart} variant='primary'>
        <span class='h-2.5 w-2.5 rounded-full bg-ember' />
        Record now
      </Button>
      <p class='flex items-center gap-1.5 text-[12px] text-ink-3'>
        or press <Kbd>{data.hotkey}</Kbd>
      </p>
    </div>
  );
