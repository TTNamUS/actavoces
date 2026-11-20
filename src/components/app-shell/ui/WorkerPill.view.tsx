import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { StatusTone } from '../../../utils/status';

interface WorkerPillProps {
  data: { label: string; tone: StatusTone };
  actions: { onSelect: () => void };
}

const DOT_CLASS: Record<StatusTone, string> = {
  ember: 'bg-ember',
  amber: 'bg-amber',
  moss: 'bg-moss',
  neutral: 'bg-ink-3'
};

export const WorkerPill = ({ data, actions }: WorkerPillProps): JSX.Element => (
  <button
    class='focus-ring flex h-8 items-center gap-2 rounded-full border border-line bg-canvas px-3 text-[12px] text-ink-2 transition-colors duration-fast hover:bg-canvas-3'
    onClick={actions.onSelect}
    type='button'
  >
    <span class={clsx('h-2 w-2 rounded-full', DOT_CLASS[data.tone])} />
    {data.label}
  </button>
);
