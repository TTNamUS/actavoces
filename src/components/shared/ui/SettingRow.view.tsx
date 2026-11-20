import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface SettingRowProps {
  children: ComponentChildren;
  class?: string;
  description?: string;
  label: string;
}

export const SettingRow = ({
  children,
  class: classProp,
  description,
  label
}: SettingRowProps): JSX.Element => (
  <div
    class={clsx(
      'flex items-center justify-between gap-6 border-line border-b py-4 last:border-b-0',
      classProp
    )}
  >
    <div class='flex min-w-0 flex-col gap-0.5'>
      <span class='font-medium text-sm'>{label}</span>
      {description === undefined ? null : <span class='text-[13px] text-ink-3'>{description}</span>}
    </div>
    <div class='flex shrink-0 items-center gap-2'>{children}</div>
  </div>
);
