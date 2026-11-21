import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import type { useRecordingOverlay } from '../hooks/useRecordingOverlay.hook';

interface RecordingOverlayViewProps {
  overlay: ReturnType<typeof useRecordingOverlay>;
}

export const RecordingOverlayView = ({ overlay }: RecordingOverlayViewProps): JSX.Element => (
  <main class='overlay-root flex h-screen items-center bg-transparent p-2 text-ink'>
    {overlay.status.displayMode.value === 'none' ? null : overlay.status.displayMode.value ===
      'minimal' ? (
      <div class='flex h-full w-full items-center justify-center gap-2 rounded-full border border-line bg-canvas shadow-float'>
        <span class='rec-dot h-2.5 w-2.5 rounded-full bg-ember' />
        <span class='font-mono text-sm tabular-nums'>{overlay.data.elapsedLabel}</span>
      </div>
    ) : (
      <div class='flex h-full w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-line bg-canvas pr-2 pl-4 shadow-float'>
        <span class='flex min-w-0 items-center gap-2.5'>
          <span class='rec-dot h-2.5 w-2.5 shrink-0 rounded-full bg-ember' />
          <span class='font-mono text-sm tabular-nums'>{overlay.data.elapsedLabel}</span>
          <span class='truncate text-[12px] text-ink-3'>
            {overlay.status.stopping.value ? 'Stopping…' : 'Recording'}
          </span>
        </span>
        <Button
          disabled={overlay.status.stopping.value}
          onClick={overlay.actions.stopRecording}
          size='sm'
          variant='ember'
        >
          Stop
        </Button>
      </div>
    )}
  </main>
);
