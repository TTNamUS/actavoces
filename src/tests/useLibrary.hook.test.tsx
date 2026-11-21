import { act, renderHook } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { useLibrary } from '../components/library/hooks/useLibrary.hook';
import type { Recording } from '../types/desktop';

vi.mock('../components/app-shell/context/AppContext', () => ({ useAppContext: vi.fn() }));

const make = (id: string, title: string, status: Recording['status'] = 'complete'): Recording => ({
  id,
  title,
  startedAt: String(Math.floor(Date.now() / 1000)),
  endedAt: null,
  durationSeconds: 90,
  status,
  artifactDirectory: `/r/${id}`,
  captureErrors: [],
  stages:
    status === 'processing'
      ? [
          {
            id: 'transcription',
            label: 'Raw transcript',
            status: 'running',
            progress: 30,
            message: ''
          }
        ]
      : [],
  artifacts: [],
  speakerLabels: []
});

const actions = {
  openPath: vi.fn(),
  retry: vi.fn(),
  rerunSummary: vi.fn(),
  removeConfirmed: vi.fn(),
  renameTitleTo: vi.fn()
};
const navigateTo = vi.fn();
let recordings: Recording[] = [];

beforeEach(() => {
  vi.clearAllMocks();
  recordings = [make('a', 'Weekly sync'), make('b', 'Design review', 'processing')];
  vi.mocked(useAppContext).mockImplementation(
    () =>
      ({
        data: {
          snapshot: { value: { recordings, settings: { summaryEnabled: true, hotkey: 'X' } } },
          displayHotkey: (value: string) => value
        },
        status: { loading: { value: false }, isRecording: { value: false } },
        actions: { recording: actions, startRecording: vi.fn() },
        navigation: { navigateTo }
      }) as unknown as ReturnType<typeof useAppContext>
  );
});

const rowById = (result: { current: ReturnType<typeof useLibrary> }, id: string) =>
  result.current.data.groups.flatMap((group) => group.rows).find((row) => row.id === id);

describe('useLibrary', () => {
  it('filters by title and reports empty search results', () => {
    const { result } = renderHook(() => useLibrary());

    act(() =>
      result.current.actions.onSearchInput({ currentTarget: { value: 'design' } } as never)
    );
    expect(result.current.data.groups.flatMap((group) => group.rows)).toHaveLength(1);

    act(() => result.current.actions.onSearchInput({ currentTarget: { value: 'zzz' } } as never));
    expect(result.current.status.noResults).toBe(true);
  });

  it('shows the in-flight recording in the now-processing card', () => {
    const { result } = renderHook(() => useLibrary());

    expect(result.current.data.nowProcessing?.title).toBe('Design review');
  });

  it('renames inline and leaves edit mode only on success', async () => {
    actions.renameTitleTo.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const { result } = renderHook(() => useLibrary());
    const submit = { preventDefault: vi.fn() } as never;

    act(() => rowById(result, 'a')?.menuItems[0].onSelect());
    expect(rowById(result, 'a')?.isRenaming).toBe(true);
    expect(rowById(result, 'a')?.renameValue).toBe('Weekly sync');

    await act(() => rowById(result, 'a')?.onRenameSubmit(submit));
    expect(rowById(result, 'a')?.isRenaming).toBe(true);

    await act(() => rowById(result, 'a')?.onRenameSubmit(submit));
    expect(rowById(result, 'a')?.isRenaming).toBe(false);
  });

  it('cancels inline rename with Escape without saving', () => {
    const { result } = renderHook(() => useLibrary());

    act(() => rowById(result, 'a')?.menuItems[0].onSelect());
    act(() => rowById(result, 'a')?.onRenameKeyDown({ key: 'Escape' } as never));

    expect(rowById(result, 'a')?.isRenaming).toBe(false);
    expect(actions.renameTitleTo).not.toHaveBeenCalled();
  });

  it('deletes only after the dialog is confirmed', async () => {
    const { result } = renderHook(() => useLibrary());
    const deleteItem = rowById(result, 'a')?.menuItems.find((item) => item.label === 'Delete');

    act(() => deleteItem?.onSelect());
    expect(result.current.data.deleteTitle).toBe('Weekly sync');
    expect(actions.removeConfirmed).not.toHaveBeenCalled();

    await act(() => result.current.actions.onConfirmDelete());
    expect(actions.removeConfirmed).toHaveBeenCalledWith(recordings[0]);
    expect(result.current.data.deleteTitle).toBeNull();
  });

  it('opens the recording detail from a row', () => {
    const { result } = renderHook(() => useLibrary());

    rowById(result, 'a')?.onOpen();
    expect(navigateTo).toHaveBeenCalledWith('/recordings/a');
  });
});
