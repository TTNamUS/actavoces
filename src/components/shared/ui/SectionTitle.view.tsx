import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface SectionTitleProps {
  children: ComponentChildren;
  class?: string;
  hint?: string;
}

export const SectionTitle = ({
  children,
  class: classProp,
  hint
}: SectionTitleProps): JSX.Element => (
  <div class={clsx('flex flex-col gap-1', classProp)}>
    <h2 class='font-semibold text-[11px] text-ink-3 uppercase tracking-[0.12em]'>{children}</h2>
    {hint === undefined ? null : <p class='text-[13px] text-ink-3'>{hint}</p>}
  </div>
);
