import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { SettingsPageModel } from '../hooks/useSettingsPage.hook';

interface SettingsNavProps {
  items: SettingsPageModel['data']['nav'];
}

export const SettingsNav = ({ items }: SettingsNavProps): JSX.Element => (
  <nav class='flex flex-col gap-1' aria-label='Settings sections'>
    {items.map((item) => (
      <button
        aria-current={item.isActive ? 'page' : undefined}
        class={clsx(
          'focus-ring h-9 rounded-md px-3 text-left font-medium text-sm transition-colors duration-fast',
          item.isActive ? 'bg-canvas-3 text-ink' : 'text-ink-2 hover:bg-canvas-2 hover:text-ink'
        )}
        key={item.id}
        onClick={item.onSelect}
        type='button'
      >
        {item.label}
      </button>
    ))}
  </nav>
);
