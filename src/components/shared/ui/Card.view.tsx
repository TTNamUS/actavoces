import { clsx } from 'clsx';
import type { ComponentChildren, JSX } from 'preact';

interface CardProps {
  children: ComponentChildren;
  class?: string;
}

export const Card = ({ children, class: classProp }: CardProps): JSX.Element => (
  <section class={clsx('min-w-0 rounded-lg border border-line bg-canvas shadow-card', classProp)}>
    {children}
  </section>
);
