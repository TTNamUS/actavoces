import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { useId } from 'preact/hooks';

interface SwitchProps {
  checked: boolean;
  children: string;
  class?: string;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({
  checked,
  children,
  class: classProp,
  disabled = false,
  onCheckedChange
}: SwitchProps): JSX.Element => {
  const id = useId();

  return (
    <label class={clsx('flex items-center gap-3 text-sm', classProp)} htmlFor={id}>
      <BaseSwitch.Root
        aria-label={children}
        checked={checked}
        className='focus-ring relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-line-2 transition-colors duration-fast data-checked:bg-ink disabled:cursor-not-allowed disabled:opacity-50'
        disabled={disabled}
        id={id}
        onCheckedChange={onCheckedChange}
      >
        <BaseSwitch.Thumb className='block h-4 w-4 translate-x-1 rounded-full bg-canvas shadow-card transition-transform duration-fast data-checked:translate-x-5' />
      </BaseSwitch.Root>
      <span class={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>{children}</span>
    </label>
  );
};
