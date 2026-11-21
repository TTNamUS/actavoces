import { describe, expect, it } from 'vitest';
import { formatClock, formatDuration, formatTimestamp, timestampMs } from '../utils/format';

describe('format helpers', () => {
  it('formats in-progress and completed durations', () => {
    expect(formatDuration(null)).toBe('In progress');
    expect(formatDuration(65)).toBe('1m 05s');
  });

  it('formats unix timestamp strings as local dates', () => {
    const expected = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(1_717_938_012_000));

    expect(formatTimestamp('1717938012')).toBe(expected);
  });

  it('formats elapsed clocks with and without hours', () => {
    expect(formatClock(5)).toBe('0:05');
    expect(formatClock(754)).toBe('12:34');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(-3)).toBe('0:00');
  });

  it('parses unix-second and ISO timestamps to milliseconds', () => {
    expect(timestampMs('1717938012')).toBe(1_717_938_012_000);
    expect(timestampMs('2024-06-09T12:00:12.000Z')).toBe(1_717_934_412_000);
  });
});
