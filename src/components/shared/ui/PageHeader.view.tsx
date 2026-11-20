import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface PageHeaderProps {
  actions?: ComponentChildren;
  class?: string;
  subtitle?: string;
  title: string;
}

export const PageHeader = ({
  actions,
  class: classProp,
  subtitle,
  title
}: PageHeaderProps): JSX.Element => (
  <header class={clsx('flex items-end justify-between gap-6', classProp)}>
    <div class='flex min-w-0 flex-col gap-1.5'>
      <h1 class='font-serif text-[34px] leading-none tracking-tight'>{title}</h1>
      {subtitle === undefined ? null : <p class='text-ink-2'>{subtitle}</p>}
    </div>
    {actions === undefined ? null : <div class='flex shrink-0 items-center gap-2'>{actions}</div>}
  </header>
);
