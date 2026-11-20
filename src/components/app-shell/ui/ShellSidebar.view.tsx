import { IconMoon, IconSun } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { AppLogo } from '../../shared/ui/AppLogo.view';
import { Button } from '../../shared/ui/Button.view';
import type { ShellModel } from '../hooks/useShell.hook';
import { RecordCard } from './RecordCard.view';
import { WorkerPill } from './WorkerPill.view';

interface ShellSidebarProps {
  shell: ShellModel;
}

export const ShellSidebar = ({ shell }: ShellSidebarProps): JSX.Element => (
  <aside class='flex w-[232px] shrink-0 flex-col justify-between gap-4 border-line border-r bg-canvas-2/60 p-3 backdrop-blur'>
    <div class='flex flex-col gap-5'>
      <div class='flex items-center justify-between px-2 pt-1'>
        <div class='flex items-center gap-2.5'>
          <AppLogo class='h-7 w-7' />
          <span class='font-serif text-[22px] leading-none'>ActaVoces</span>
        </div>
        <Button
          aria-label='Toggle theme'
          onClick={shell.actions.toggleTheme}
          size='iconSm'
          variant='ghost'
        >
          {shell.data.themeIsDark ? (
            <IconSun aria-hidden='true' size={16} stroke={1.75} />
          ) : (
            <IconMoon aria-hidden='true' size={16} stroke={1.75} />
          )}
        </Button>
      </div>

      <nav class='flex flex-col gap-1'>
        {shell.data.navItems.map((item) => (
          <button
            aria-current={item.isActive ? 'page' : undefined}
            class={clsx(
              'focus-ring flex h-9 items-center gap-2.5 rounded-md px-3 text-left font-medium text-sm transition-colors duration-fast',
              item.isActive
                ? 'bg-canvas text-ink shadow-card'
                : 'text-ink-2 hover:bg-canvas-3 hover:text-ink'
            )}
            key={item.path}
            onClick={item.onSelect}
            type='button'
          >
            <item.icon aria-hidden='true' size={16} stroke={1.75} />
            <span class='flex-1'>{item.label}</span>
            {item.badge === null ? null : (
              <span class='rounded-full bg-amber-soft px-1.5 font-mono text-[11px] tabular-nums'>
                {item.badge}
              </span>
            )}
            {item.comingSoon ? (
              <span class='font-semibold text-[10px] text-ink-3 uppercase tracking-[0.12em]'>
                Soon
              </span>
            ) : null}
          </button>
        ))}
      </nav>
    </div>

    <div class='flex flex-col gap-3'>
      <WorkerPill
        actions={{ onSelect: shell.actions.openSystemSettings }}
        data={shell.data.worker}
      />
      <RecordCard
        actions={{ onStart: shell.actions.startRecording, onStop: shell.actions.stopRecording }}
        data={{ elapsedLabel: shell.data.elapsedLabel, hotkey: shell.data.hotkey }}
        status={{ isRecording: shell.status.isRecording, loading: shell.status.loading }}
      />
      <div class='flex items-center justify-between px-1 text-[12px] text-ink-3'>
        <a
          class='hover:text-ink'
          href='https://insigh.to/b/actavoces'
          rel='noreferrer'
          target='_blank'
        >
          Suggest feedback
        </a>
        <span class='font-mono'>v{shell.data.appVersion}</span>
      </div>
    </div>
  </aside>
);
