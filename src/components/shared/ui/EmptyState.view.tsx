import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface EmptyStateProps {
  action?: ComponentChildren;
  body: string;
  class?: string;
  icon: ComponentChildren;
  title: string;
}

export const EmptyState = ({
  action,
  body,
  class: classProp,
  icon,
  title
}: EmptyStateProps): JSX.Element => (
  <div class={clsx('rise flex flex-col items-center gap-4 py-16 text-center', classProp)}>
    <div class='flex h-12 w-12 items-center justify-center rounded-full bg-canvas-3 text-ink-2'>
      {icon}
    </div>
    <div class='flex max-w-sm flex-col gap-1.5'>
      <h2 class='font-serif text-[28px] leading-tight'>{title}</h2>
      <p class='text-ink-2'>{body}</p>
    </div>
    {action}
  </div>
);
