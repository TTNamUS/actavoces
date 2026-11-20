import { Menu as BaseMenu } from '@base-ui/react/menu';
import { IconDots } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { JSX } from 'preact';

export interface MenuItem {
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onSelect: () => void;
}

interface MenuProps {
  ariaLabel: string;
  class?: string;
  items: MenuItem[];
}

export const Menu = ({ ariaLabel, class: classProp, items }: MenuProps): JSX.Element => (
  <BaseMenu.Root>
    <BaseMenu.Trigger
      aria-label={ariaLabel}
      class={clsx(
        'focus-ring inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-2 transition-colors duration-fast hover:bg-canvas-3 hover:text-ink',
        classProp
      )}
    >
      <IconDots aria-hidden='true' size={16} stroke={1.75} />
    </BaseMenu.Trigger>
    <BaseMenu.Portal>
      <BaseMenu.Positioner align='end' class='z-50 outline-none' sideOffset={4}>
        <BaseMenu.Popup class='min-w-44 rounded-lg border border-line bg-canvas p-1 shadow-float outline-none'>
          {items.map((item) => (
            <BaseMenu.Item
              class={clsx(
                'flex cursor-pointer items-center rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-canvas-3 data-disabled:cursor-not-allowed data-disabled:opacity-50',
                item.danger ? 'text-ember' : 'text-ink'
              )}
              disabled={item.disabled}
              key={item.label}
              onClick={item.onSelect}
            >
              {item.label}
            </BaseMenu.Item>
          ))}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  </BaseMenu.Root>
);
