import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { StatusTone } from '../../../utils/status';

interface ToneDotProps {
  class?: string;
  tone: StatusTone;
}

const DOT_CLASS: Record<StatusTone, string> = {
  ember: 'bg-ember',
  amber: 'bg-amber',
  moss: 'bg-moss',
  neutral: 'bg-line-2'
};

export const ToneDot = ({ class: classProp, tone }: ToneDotProps): JSX.Element => (
  <span class={clsx('h-1.5 w-1.5 shrink-0 rounded-full', DOT_CLASS[tone], classProp)} />
);
