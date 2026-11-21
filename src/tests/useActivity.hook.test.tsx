import { renderHook } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useActivity } from '../components/activity/hooks/useActivity.hook';
import { useAppContext } from '../components/app-shell/context/AppContext';
import type { PipelineJob, Recording } from '../types/desktop';

vi.mock('../components/app-shell/context/AppContext', () => ({ useAppContext: vi.fn() }));

const recording: Recording = {
  id: 'r1',
  title: 'Weekly sync',
  startedAt: '1717938012',
  endedAt: null,
  durationSeconds: 60,
  status: 'processing',
  artifactDirectory: '/r/r1',
  captureErrors: [],
  stages: [
    { id: 'recording', label: 'Capture', status: 'complete', progress: 100, message: 'done' },
    {
      id: 'transcription',
      label: 'Raw transcript',
      status: 'running',
      progress: 40,
      message: 'busy'
    }
  ],
  artifacts: [],
  speakerLabels: []
};
const job: PipelineJob = {
  id: 'j1',
  recordingId: 'r1',
  stage: 'transcription',
  status: 'running',
  progress: 40,
  message: 'busy'
};

const laterJob: PipelineJob = {
  ...job,
  id: 'j2',
  stage: 'diarization',
  status: 'pending',
  progress: 0
};

const navigateTo = vi.fn();
const onRetry = vi.fn();
const onOpenFolder = vi.fn();

const mockApp = (latest: Recording | null) =>
  vi.mocked(useAppContext).mockImplementation(
    () =>
      ({
        data: {
          latestRecording: { value: latest },
          latestRecordingProgress: { value: 70 },
          latestRecordingPipelineStatus: {
            value: { status: 'running', label: 'running', message: 'Processing recording' }
          },
          latestRecordingActions: {
            value: latest === null ? null : { canRetry: false, onOpenFolder, onRetry }
          },
          groupedJobRows: {
            value:
              latest === null
                ? []
                : [
                    {
                      recording: latest,
                      progress: 70,
                      pipelineStatus: { status: 'running', label: 'running', message: 'x' },
                      jobs: [laterJob, job],
                      onOpenFolder,
                      onRetry
                    }
                  ]
          }
        },
        status: { loading: { value: false } },
        navigation: { navigateTo }
      }) as unknown as ReturnType<typeof useAppContext>
  );

beforeEach(() => vi.clearAllMocks());

describe('useActivity', () => {
  it('describes the current pipeline with stage percentages only while running', () => {
    mockApp(recording);
    const { result } = renderHook(() => useActivity());
    const current = result.current.data.current;

    expect(current?.title).toBe('Weekly sync');
    expect(current?.progress).toBe(70);
    expect(current?.stages.map((stage) => stage.percentLabel)).toEqual([null, '40%']);
  });

  it('labels jobs with the stage label and opens the recording detail', () => {
    mockApp(recording);
    const { result } = renderHook(() => useActivity());
    const group = result.current.data.groups[0];

    expect(group.jobs.map((item) => item.id)).toEqual(['j1', 'j2']);
    expect(group.jobs[0].label).toBe('Raw transcript');
    group.onOpen();
    expect(navigateTo).toHaveBeenCalledWith('/recordings/r1');
  });

  it('is empty without recordings', () => {
    mockApp(null);
    const { result } = renderHook(() => useActivity());

    expect(result.current.data.current).toBeNull();
    expect(result.current.data.groups).toEqual([]);
  });
});
