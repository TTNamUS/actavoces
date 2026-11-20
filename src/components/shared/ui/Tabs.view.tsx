import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { clsx } from 'clsx';
import type { JSX } from 'preact';

export interface TabItem {
  disabled?: boolean;
  label: string;
  title?: string;
  value: string;
}

interface TabsProps {
  class?: string;
  items: TabItem[];
  onValueChange: (value: string) => void;
  value: string;
}

export const Tabs = ({ class: classProp, items, onValueChange, value }: TabsProps): JSX.Element => (
  <BaseTabs.Root onValueChange={(next) => onValueChange(String(next))} value={value}>
    <BaseTabs.List
      class={clsx('inline-flex items-center gap-1 rounded-lg bg-canvas-3 p-1', classProp)}
    >
      {items.map((item) => (
        <BaseTabs.Tab
          class='focus-ring h-7 rounded-md px-3 font-medium text-[13px] text-ink-2 transition-colors duration-fast data-active:bg-canvas data-active:text-ink data-active:shadow-card disabled:cursor-not-allowed disabled:opacity-50'
          disabled={item.disabled}
          key={item.value}
          title={item.title}
          value={item.value}
        >
          {item.label}
        </BaseTabs.Tab>
      ))}
    </BaseTabs.List>
  </BaseTabs.Root>
);
