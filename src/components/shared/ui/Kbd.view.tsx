import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface KbdProps {
  children: ComponentChildren;
  class?: string;
}

export const Kbd = ({ children, class: classProp }: KbdProps): JSX.Element => (
  <kbd
    class={clsx(
      'inline-flex h-5 items-center rounded-md border border-line-2 bg-canvas-2 px-1.5 font-mono text-[11px] text-ink-2 tabular-nums',
      classProp
    )}
  >
    {children}
  </kbd>
);
