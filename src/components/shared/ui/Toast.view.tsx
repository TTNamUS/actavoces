import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface ToastProps {
  actions?: ComponentChildren;
  children?: ComponentChildren;
  class?: string;
  title: string;
  tone?: 'default' | 'error';
}

export const Toast = ({
  actions,
  children,
  class: classProp,
  title,
  tone = 'default'
}: ToastProps): JSX.Element => (
  <div
    class={clsx(
      'rise flex w-full flex-col gap-3 rounded-lg border bg-canvas p-4 shadow-float',
      tone === 'error' ? 'border-ember' : 'border-line',
      classProp
    )}
    role={tone === 'error' ? 'alert' : 'status'}
  >
    <div class='flex flex-col gap-1'>
      <p class='font-semibold text-sm'>{title}</p>
      {children === undefined ? null : <div class='text-[13px] text-ink-2'>{children}</div>}
    </div>
    {actions === undefined ? null : (
      <div class='flex items-center justify-end gap-2'>{actions}</div>
    )}
  </div>
);
