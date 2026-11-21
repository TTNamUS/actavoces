import { Input as BaseInput } from '@base-ui/react/input';
import { clsx } from 'clsx';
import type { JSX, KeyboardEventHandler } from 'preact';

interface InputProps {
  'aria-label'?: string;
  autofocus?: boolean;
  class?: string;
  disabled?: boolean;
  invalid?: boolean;
  min?: string;
  onInput?: JSX.InputEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  surface?: 'input' | 'card';
  type?: 'number' | 'password' | 'text';
  value?: number | string;
}

export const Input = ({
  'aria-label': ariaLabel,
  autofocus = false,
  class: classProp,
  disabled = false,
  invalid = false,
  min,
  onInput,
  onKeyDown,
  placeholder,
  readOnly = false,
  surface = 'input',
  type = 'text',
  value
}: InputProps): JSX.Element => (
  <BaseInput
    aria-label={ariaLabel}
    autoFocus={autofocus}
    className={clsx(
      'focus-ring h-9 select-text rounded-md border px-3 text-sm text-ink outline-none transition-colors duration-fast placeholder:text-ink-3 focus:border-ember disabled:cursor-not-allowed disabled:opacity-50',
      surface === 'card' ? 'bg-canvas-2' : 'bg-canvas',
      invalid ? 'border-ember' : 'border-line-2',
      classProp
    )}
    disabled={disabled}
    min={min}
    onInput={onInput}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    readOnly={readOnly}
    type={type}
    value={value}
  />
);
