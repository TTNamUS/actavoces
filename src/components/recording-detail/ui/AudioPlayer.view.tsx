import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRewindBackward10,
  IconRewindForward10
} from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface AudioPlayerProps {
  detail: RecordingDetailModel;
}

export const AudioPlayer = ({ detail }: AudioPlayerProps): JSX.Element =>
  detail.data.player.available ? (
    <div class='flex flex-col gap-3'>
      <div class='flex items-center gap-2'>
        <Button
          aria-label='Back 10 seconds'
          onClick={detail.actions.onSkipBack}
          size='iconSm'
          variant='ghost'
        >
          <IconRewindBackward10 aria-hidden='true' size={18} stroke={1.75} />
        </Button>
        <Button
          aria-label={detail.data.player.playing ? 'Pause' : 'Play'}
          onClick={detail.actions.onTogglePlay}
          size='icon'
          variant='primary'
        >
          {detail.data.player.playing ? (
            <IconPlayerPauseFilled aria-hidden='true' size={16} />
          ) : (
            <IconPlayerPlayFilled aria-hidden='true' size={16} />
          )}
        </Button>
        <Button
          aria-label='Forward 10 seconds'
          onClick={detail.actions.onSkipForward}
          size='iconSm'
          variant='ghost'
        >
          <IconRewindForward10 aria-hidden='true' size={18} stroke={1.75} />
        </Button>
        <span class='ml-auto whitespace-nowrap font-mono text-[12px] text-ink-2 tabular-nums'>
          {detail.data.player.currentLabel} / {detail.data.player.durationLabel}
        </span>
      </div>
      <input
        aria-label='Seek'
        class='focus-ring h-1 w-full cursor-pointer accent-ember'
        max={detail.data.player.duration}
        min={0}
        onInput={detail.actions.onSeekInput}
        step={0.1}
        type='range'
        value={detail.data.player.currentTime}
      />
    </div>
  ) : (
    <p class='text-[13px] text-ink-3'>Audio is not available for this recording.</p>
  );
