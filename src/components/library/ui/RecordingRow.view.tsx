import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Input } from '../../shared/ui/Input.view';
import { Menu } from '../../shared/ui/Menu.view';
import { StatusBadge } from '../../shared/ui/StatusBadge.view';
import type { LibraryModel } from '../hooks/useLibrary.hook';

type Row = LibraryModel['data']['groups'][number]['rows'][number];

interface RecordingRowProps {
  row: Row;
}

export const RecordingRow = ({ row }: RecordingRowProps): JSX.Element => (
  <div class='flex items-center gap-2 rounded-lg border-line border-b px-3 py-3 transition-colors duration-fast hover:bg-canvas-2'>
    {row.isRenaming ? (
      <form class='flex min-w-0 flex-1 items-center gap-2' onSubmit={row.onRenameSubmit}>
        <Input
          aria-label='Recording title'
          autofocus
          class='min-w-0 flex-1'
          onInput={row.onRenameInput}
          onKeyDown={row.onRenameKeyDown}
          value={row.renameValue}
        />
        <Button type='submit' variant='primary'>
          Save
        </Button>
      </form>
    ) : (
      <button
        class='focus-ring flex min-w-0 flex-1 items-center gap-4 rounded-md text-left'
        onClick={row.onOpen}
        type='button'
      >
        <div class='flex w-16 shrink-0 flex-col text-[12px] text-ink-3'>
          <span>{row.dateLabel}</span>
          <span>{row.timeLabel}</span>
        </div>
        <div class='flex min-w-0 flex-1 flex-col gap-0.5'>
          <span class='truncate font-medium text-[15px]'>{row.title}</span>
          {row.meta === '' ? null : <span class='truncate text-[12px] text-ink-3'>{row.meta}</span>}
        </div>
        <StatusBadge status={row.status} />
        <span class='w-14 shrink-0 text-right font-mono text-[13px] text-ink-2 tabular-nums'>
          {row.durationLabel}
        </span>
      </button>
    )}
    <Menu ariaLabel={`Actions for ${row.title}`} items={row.menuItems} />
  </div>
);
