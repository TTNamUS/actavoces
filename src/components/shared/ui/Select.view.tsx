import { Select as BaseSelect } from '@base-ui/react/select';
import { IconCheck, IconSelector } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { useCallback } from 'preact/hooks';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  class?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  value: string;
}

export const Select = ({
  class: classProp,
  disabled = false,
  onValueChange,
  options,
  value
}: SelectProps): JSX.Element => {
  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      if (nextValue !== null) {
        onValueChange(nextValue);
      }
    },
    [onValueChange]
  );

  return (
    <BaseSelect.Root<string>
      disabled={disabled}
      items={options}
      onValueChange={handleValueChange}
      value={value}
    >
      <BaseSelect.Trigger
        className={clsx(
          'focus-ring flex h-9 w-full items-center justify-between gap-3 rounded-md border border-line-2 bg-canvas px-3 text-ink text-sm outline-none transition-colors duration-fast hover:bg-canvas-2 disabled:cursor-not-allowed disabled:opacity-50',
          classProp
        )}
      >
        <BaseSelect.Value />
        <BaseSelect.Icon className='text-ink-3'>
          <IconSelector aria-hidden='true' size={16} stroke={1.75} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className='z-50 outline-none' sideOffset={4}>
          <BaseSelect.Popup className='max-h-72 min-w-(--anchor-width) overflow-y-auto rounded-lg border border-line bg-canvas p-1 text-ink shadow-float'>
            {options.map((option) => (
              <BaseSelect.Item
                className='flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-canvas-3 data-disabled:cursor-not-allowed data-disabled:opacity-50'
                key={option.value}
                value={option.value}
              >
                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className='text-ember'>
                  <IconCheck aria-hidden='true' size={14} stroke={2} />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
};
