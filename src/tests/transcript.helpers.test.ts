import { describe, expect, it } from 'vitest';
import {
  activeUtteranceIndex,
  groupUtterances,
  speakerColorClass
} from '../components/recording-detail/hooks/transcript.helpers';
import type { Utterance } from '../types/desktop';

const utterances: Utterance[] = [
  { speaker: 'Alex', start: 0, end: 4, text: 'Hi' },
  { speaker: 'Alex', start: 4, end: 8, text: 'again' },
  { speaker: 'Priya', start: 9, end: 12, text: 'Hello' },
  { speaker: 'Alex', start: 12, end: 15, text: 'Back' }
];

describe('groupUtterances', () => {
  it('merges consecutive lines from the same speaker and keeps global indexes', () => {
    const groups = groupUtterances(utterances);

    expect(groups.map((group) => [group.speaker, group.lines.length])).toEqual([
      ['Alex', 2],
      ['Priya', 1],
      ['Alex', 1]
    ]);
    expect(groups[2].lines[0].index).toBe(3);
  });

  it('returns nothing for no utterances', () => {
    expect(groupUtterances([])).toEqual([]);
  });
});

describe('activeUtteranceIndex', () => {
  it('finds the line containing the playback time', () => {
    expect(activeUtteranceIndex(utterances, 5)).toBe(1);
    expect(activeUtteranceIndex(utterances, 12)).toBe(3);
  });

  it('is null before the first line, in gaps, and when idle', () => {
    expect(activeUtteranceIndex(utterances, 8.5)).toBeNull();
    expect(activeUtteranceIndex([{ speaker: 'A', start: 2, end: 3, text: 'x' }], 0)).toBeNull();
    expect(activeUtteranceIndex(utterances, null)).toBeNull();
  });
});

describe('speakerColorClass', () => {
  it('cycles through six tokens by first-appearance order', () => {
    const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    expect(speakerColorClass(order, 'a')).toBe('bg-speaker-1');
    expect(speakerColorClass(order, 'g')).toBe('bg-speaker-1');
    expect(speakerColorClass(order, 'zzz')).toBe('bg-speaker-1');
  });
});
