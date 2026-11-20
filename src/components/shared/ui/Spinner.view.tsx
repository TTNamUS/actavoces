import { IconLoader2 } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { JSX } from 'preact';

interface SpinnerProps {
  class?: string;
  size?: number;
}

export const Spinner = ({ class: classProp, size = 16 }: SpinnerProps): JSX.Element => (
  <IconLoader2
    aria-hidden='true'
    class={clsx('animate-spin text-ink-3', classProp)}
    size={size}
    stroke={1.75}
  />
);
