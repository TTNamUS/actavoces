import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';

interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  surface?: 'input' | 'card';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ class: classProp, invalid = false, surface = 'input', ...rest }, ref): JSX.Element => (
    <textarea
      class={clsx(
        'focus-ring select-text rounded-md border p-3 text-sm text-ink outline-none transition-colors duration-fast placeholder:text-ink-3 focus:border-ember disabled:cursor-not-allowed disabled:opacity-50',
        surface === 'card' ? 'bg-canvas-2' : 'bg-canvas',
        invalid ? 'border-ember' : 'border-line-2',
        classProp
      )}
      ref={ref}
      {...rest}
    />
  )
);
