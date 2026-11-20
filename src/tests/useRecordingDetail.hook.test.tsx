import { act, renderHook, waitFor } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { useRecordingDetail } from '../components/recording-detail/hooks/useRecordingDetail.hook';
import { getRecordingContent } from '../services/desktop/recording-content.service';
import type { Recording, RecordingContent } from '../types/desktop';

vi.mock('../components/app-shell/context/AppContext', () => ({ useAppContext: vi.fn() }));
vi.mock('../services/desktop/recording-content.service', () => ({
  getRecordingContent: vi.fn(),
  audioSourceUrl: () => null
}));

const makeRecording = (summaryStatus: 'pending' | 'complete' = 'pending'): Recording => ({
  id: 'r1',
  title: 'Weekly sync',
  startedAt: '1717938012',
  endedAt: '1717938072',
  durationSeconds: 60,
  status: 'processing',
  artifactDirectory: '/records/r1',
  captureErrors: [],
  stages: [
    {
      id: 'transcription',
      label: 'Raw transcript',
      status: 'complete',
      progress: 100,
      message: ''
    },
    { id: 'summary', label: 'Summary', status: summaryStatus, progress: 0, message: '' }
  ],
  artifacts: [{ kind: 'summary', label: 'Summary', path: '/records/r1/summary.md', ready: true }],
  speakerLabels: [{ name: 'Alex' }, { name: 'Priya' }]
});

const content: RecordingContent = {
  transcriptMarkdown: '# Diarized',
  rawTranscriptMarkdown: null,
  summaryMarkdown: '## Decisions\n\n- Ship it',
  utterances: [
    { speaker: 'Alex', start: 0, end: 4, text: 'Hi' },
    { speaker: 'Alex', start: 4, end: 8, text: 'there' },
    { speaker: 'Priya', start: 9, end: 12, text: 'Hello' }
  ],
  audioPath: null
};

const fake = {
  snapshot: { value: { recordings: [makeRecording()], settings: { summaryEnabled: true } } },
  actions: {
    recording: {
      openPath: vi.fn(),
      retry: vi.fn(),
      rerunSummary: vi.fn(),
      removeConfirmed: vi.fn(),
      renameTitleTo: vi.fn(),
      renameSpeakerTo: vi.fn()
    }
  },
  navigateTo: vi.fn()
};

beforeEach(() => {
  vi.clearAllMocks();
  fake.snapshot.value = { recordings: [makeRecording()], settings: { summaryEnabled: true } };
  vi.mocked(getRecordingContent).mockResolvedValue(content);
  vi.mocked(useAppContext).mockImplementation(
    () =>
      ({
        data: { snapshot: fake.snapshot },
        status: { loading: { value: false } },
        actions: fake.actions,
        navigation: { navigateTo: fake.navigateTo }
      }) as unknown as ReturnType<typeof useAppContext>
  );
});

describe('useRecordingDetail', () => {
  it('loads content and groups utterances by speaker', async () => {
    const { result } = renderHook(() => useRecordingDetail('r1'));

    await waitFor(() => expect(result.current.data.hasUtterances).toBe(true));

    expect(getRecordingContent).toHaveBeenCalledWith('r1');
    expect(result.current.data.groups.map((group) => group.lines.length)).toEqual([2, 1]);
    expect(result.current.data.summaryBlocks?.[0]).toMatchObject({ type: 'heading', level: 2 });
    expect(result.current.data.speakers.map((speaker) => speaker.lineCount)).toEqual([2, 1]);
  });

  it('reloads content when the pipeline of that recording advances', async () => {
    const { result, rerender } = renderHook(() => useRecordingDetail('r1'));

    await waitFor(() => expect(result.current.data.hasUtterances).toBe(true));
    fake.snapshot.value = {
      recordings: [makeRecording('complete')],
      settings: { summaryEnabled: true }
    };
    act(() => rerender({}));

    await waitFor(() => expect(getRecordingContent).toHaveBeenCalledTimes(2));
  });

  it('reports a missing recording without loading content', () => {
    const { result } = renderHook(() => useRecordingDetail('nope'));

    expect(result.current.status.notFound).toBe(true);
    expect(getRecordingContent).not.toHaveBeenCalled();
  });

  it('renames the title and leaves edit mode only on success', async () => {
    fake.actions.recording.renameTitleTo.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const { result } = renderHook(() => useRecordingDetail('r1'));
    const submit = { preventDefault: vi.fn() } as never;

    act(() => result.current.actions.onStartTitleEdit());
    expect(result.current.data.titleDraft).toBe('Weekly sync');

    await act(() => result.current.actions.onSubmitTitle(submit));
    expect(result.current.status.editingTitle).toBe(true);

    await act(() => result.current.actions.onSubmitTitle(submit));
    expect(result.current.status.editingTitle).toBe(false);
  });

  it('asks for confirmation before deleting, then returns to the library', async () => {
    fake.actions.recording.removeConfirmed.mockResolvedValue(true);
    const { result } = renderHook(() => useRecordingDetail('r1'));

    act(() => result.current.actions.onAskDelete());
    expect(result.current.data.deleteTitle).toBe('Weekly sync');
    expect(fake.actions.recording.removeConfirmed).not.toHaveBeenCalled();

    await act(() => result.current.actions.onConfirmDelete());

    expect(fake.actions.recording.removeConfirmed).toHaveBeenCalledTimes(1);
    expect(fake.navigateTo).toHaveBeenCalledWith('/');
  });
});
