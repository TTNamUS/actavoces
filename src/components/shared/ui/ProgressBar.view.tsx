import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { StatusTone } from '../../../utils/status';

interface ProgressBarProps {
  class?: string;
  label?: string;
  tone?: StatusTone;
  value: number | null;
}

const FILL_CLASS: Record<StatusTone, string> = {
  ember: 'bg-ember',
  amber: 'bg-amber',
  moss: 'bg-moss',
  neutral: 'bg-ink-3'
};

export const ProgressBar = ({
  class: classProp,
  label = 'Progress',
  tone = 'amber',
  value
}: ProgressBarProps): JSX.Element => {
  const percent = value === null ? null : Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percent ?? undefined}
      class={clsx('h-1 w-full overflow-hidden rounded-full bg-line', classProp)}
      role='progressbar'
    >
      <div
        class={clsx(
          'h-full rounded-full',
          FILL_CLASS[tone],
          percent === null ? 'indeterminate w-2/5' : 'transition-[width] duration-slow'
        )}
        style={percent === null ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
};
