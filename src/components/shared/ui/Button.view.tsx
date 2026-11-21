import { Button as BaseButton } from '@base-ui/react/button';
import { clsx } from 'clsx';
import type { ComponentChildren, JSX, MouseEventHandler } from 'preact';

export type ButtonVariant =
  | 'primary'
  | 'ember'
  | 'soft'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'iconSm';

interface ButtonProps {
  children: ComponentChildren;
  'aria-label'?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  type?: 'button' | 'submit';
  class?: string;
}

const OUTLINE = 'border border-line-2 bg-canvas text-ink hover:bg-canvas-2';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-canvas shadow-card hover:opacity-90',
  ember: 'bg-ember text-on-ember shadow-card hover:bg-ember-2',
  soft: 'bg-canvas-3 text-ink hover:bg-line',
  ghost: 'text-ink-2 hover:bg-canvas-3 hover:text-ink',
  outline: OUTLINE,
  secondary: OUTLINE,
  danger: 'border border-line-2 bg-canvas text-ember hover:bg-ember-soft'
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-[13px]',
  md: 'h-9 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-sm',
  icon: 'h-9 w-9',
  iconSm: 'h-7 w-7'
};

export const Button = ({
  children,
  'aria-label': ariaLabel,
  disabled = false,
  variant = 'outline',
  size = 'md',
  onClick,
  title,
  type = 'button',
  class: classProp
}: ButtonProps): JSX.Element => (
  <BaseButton
    aria-label={ariaLabel}
    className={clsx(
      'focus-ring inline-flex shrink-0 items-center justify-center rounded-md font-semibold transition duration-fast active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40',
      VARIANT_CLASS[variant],
      SIZE_CLASS[size],
      classProp
    )}
    disabled={disabled}
    onClick={onClick}
    title={title}
    type={type}
  >
    {children}
  </BaseButton>
);
