import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';
import type { StatusTone } from '../../../utils/status';

interface BadgeProps {
  children: ComponentChildren;
  class?: string;
  pulse?: boolean;
  tone?: StatusTone;
}

const TONE_CLASS: Record<StatusTone, string> = {
  ember: 'bg-ember-soft text-ember-2',
  amber: 'bg-amber-soft text-ink-2',
  moss: 'bg-moss-soft text-moss',
  neutral: 'bg-canvas-3 text-ink-2'
};

const DOT_CLASS: Record<StatusTone, string> = {
  ember: 'bg-ember',
  amber: 'bg-amber',
  moss: 'bg-moss',
  neutral: 'bg-ink-3'
};

export const Badge = ({
  children,
  class: classProp,
  pulse = false,
  tone = 'neutral'
}: BadgeProps): JSX.Element => (
  <span
    class={clsx(
      'inline-flex h-5 items-center gap-1.5 rounded-full px-2 font-semibold text-[11px] uppercase tracking-[0.06em]',
      TONE_CLASS[tone],
      classProp
    )}
  >
    <span class={clsx('h-1.5 w-1.5 rounded-full', DOT_CLASS[tone], pulse && 'rec-dot')} />
    {children}
  </span>
);
