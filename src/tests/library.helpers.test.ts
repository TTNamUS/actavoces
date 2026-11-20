import { describe, expect, it } from 'vitest';
import {
  filterRecordings,
  groupRecordingsByDay,
  recordingMeta,
  recordingRowStatus
} from '../components/library/hooks/library.helpers';
import type { Recording } from '../types/desktop';

const NOW = new Date(2026, 10, 18, 15, 0, 0).getTime();
const secondsAt = (daysAgo: number, hour = 9): string =>
  String(Math.floor(new Date(2026, 10, 18 - daysAgo, hour, 0, 0).getTime() / 1000));

const recording = (id: string, title: string, startedAt: string): Recording => ({
  id,
  title,
  startedAt,
  endedAt: null,
  durationSeconds: 60,
  status: 'complete',
  artifactDirectory: `/r/${id}`,
  captureErrors: [],
  stages: [],
  artifacts: [],
  speakerLabels: []
});

describe('groupRecordingsByDay', () => {
  it('buckets by calendar day relative to now, keeping input order', () => {
    const groups = groupRecordingsByDay(
      [
        recording('a', 'A', secondsAt(0, 14)),
        recording('b', 'B', secondsAt(0, 8)),
        recording('c', 'C', secondsAt(1)),
        recording('d', 'D', secondsAt(4)),
        recording('e', 'E', secondsAt(20))
      ],
      NOW
    );

    expect(groups.map((group) => group.label)).toEqual([
      'Today',
      'Yesterday',
      'This week',
      'Earlier'
    ]);
    expect(groups[0].recordings.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('omits empty buckets', () => {
    expect(groupRecordingsByDay([recording('a', 'A', secondsAt(30))], NOW)).toHaveLength(1);
    expect(groupRecordingsByDay([], NOW)).toEqual([]);
  });
});

describe('filterRecordings', () => {
  it('matches titles case-insensitively and trims the query', () => {
    const items = [recording('a', 'Weekly Sync', '1'), recording('b', 'Design review', '2')];

    expect(filterRecordings(items, '  sync ').map((item) => item.id)).toEqual(['a']);
    expect(filterRecordings(items, '').length).toBe(2);
    expect(filterRecordings(items, 'zzz')).toEqual([]);
  });
});

const stage = (
  id: Recording['stages'][number]['id'],
  status: Recording['stages'][number]['status']
) => ({
  id,
  label: id,
  status,
  progress: 0,
  message: ''
});

describe('recordingRowStatus', () => {
  it('surfaces blockers, then in-flight work, then completion', () => {
    const base = recording('a', 'A', '1');

    expect(recordingRowStatus({ ...base, status: 'recording' })).toBe('recording');
    expect(recordingRowStatus({ ...base, stages: [stage('transcription', 'failed')] })).toBe(
      'failed'
    );
    expect(recordingRowStatus({ ...base, stages: [stage('transcription', 'needsSetup')] })).toBe(
      'needsSetup'
    );
    expect(recordingRowStatus({ ...base, stages: [stage('transcription', 'running')] })).toBe(
      'processing'
    );
    expect(
      recordingRowStatus({
        ...base,
        stages: [stage('recording', 'complete'), stage('summary', 'skipped')]
      })
    ).toBe('complete');
  });
});

describe('recordingMeta', () => {
  it('joins speakers, summary and capture issues', () => {
    const base = recording('a', 'A', '1');

    expect(recordingMeta(base)).toBe('');
    expect(
      recordingMeta({
        ...base,
        speakerLabels: [{ name: 'A' }, { name: 'B' }],
        artifacts: [{ kind: 'summary', label: 'Summary', path: 'p', ready: true }],
        captureErrors: [{ source: 'system', message: 'x' }]
      })
    ).toBe('2 speakers · summary · capture issue');
  });
});
