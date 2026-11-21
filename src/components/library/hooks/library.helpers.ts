import type { Recording } from '../../../types/desktop';
import { timestampMs } from '../../../utils/format';
import type { AnyStatus } from '../../../utils/status';
import { recordingPipelineStatus } from '../../recordings/hooks/recording.helpers';

export type DayGroupLabel = 'Today' | 'Yesterday' | 'This week' | 'Earlier';

export interface RecordingGroup {
  label: DayGroupLabel;
  recordings: Recording[];
}

const GROUP_ORDER: DayGroupLabel[] = ['Today', 'Yesterday', 'This week', 'Earlier'];
const DAY_MS = 86_400_000;

const startOfDay = (ms: number): number => {
  const date = new Date(ms);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

const dayGroupLabel = (startedAt: string, now: number): DayGroupLabel => {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestampMs(startedAt))) / DAY_MS);

  if (daysAgo <= 0) {
    return 'Today';
  }

  if (daysAgo === 1) {
    return 'Yesterday';
  }

  return daysAgo < 7 ? 'This week' : 'Earlier';
};

export const groupRecordingsByDay = (recordings: Recording[], now: number): RecordingGroup[] => {
  const buckets = new Map<DayGroupLabel, Recording[]>();

  for (const recording of recordings) {
    const label = dayGroupLabel(recording.startedAt, now);

    buckets.set(label, [...(buckets.get(label) ?? []), recording]);
  }

  return GROUP_ORDER.flatMap((label) => {
    const items = buckets.get(label);

    return items === undefined ? [] : [{ label, recordings: items }];
  });
};

export const filterRecordings = (recordings: Recording[], query: string): Recording[] => {
  const needle = query.trim().toLowerCase();

  return needle === ''
    ? recordings
    : recordings.filter((recording) => recording.title.toLowerCase().includes(needle));
};

export const recordingRowStatus = (recording: Recording): AnyStatus => {
  if (recording.status === 'recording') {
    return 'recording';
  }

  const pipeline = recordingPipelineStatus(recording);

  if (pipeline.status === 'failed' || pipeline.status === 'needsSetup') {
    return pipeline.status;
  }

  return pipeline.status === 'complete' ? 'complete' : 'processing';
};

export const recordingMeta = (recording: Recording): string => {
  const speakers = recording.speakerLabels.length;
  const hasSummary = recording.artifacts.some(
    (artifact) => artifact.kind === 'summary' && artifact.ready
  );
  const parts = [
    speakers > 0 ? `${speakers} ${speakers === 1 ? 'speaker' : 'speakers'}` : null,
    hasSummary ? 'summary' : null,
    recording.captureErrors.length > 0 ? 'capture issue' : null
  ];

  return parts.filter((part) => part !== null).join(' · ');
};
