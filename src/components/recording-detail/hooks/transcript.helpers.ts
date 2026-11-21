import type { Utterance } from '../../../types/desktop';

export interface TranscriptLine {
  index: number;
  start: number;
  text: string;
}

export interface TranscriptGroup {
  speaker: string;
  lines: TranscriptLine[];
}

const SPEAKER_CLASSES = [
  'bg-speaker-1',
  'bg-speaker-2',
  'bg-speaker-3',
  'bg-speaker-4',
  'bg-speaker-5',
  'bg-speaker-6'
];

export const groupUtterances = (utterances: Utterance[]): TranscriptGroup[] => {
  const groups: TranscriptGroup[] = [];

  for (const [index, utterance] of utterances.entries()) {
    const line = { index, start: utterance.start, text: utterance.text };
    const last = groups[groups.length - 1];

    if (last?.speaker === utterance.speaker) {
      last.lines.push(line);
    } else {
      groups.push({ speaker: utterance.speaker, lines: [line] });
    }
  }

  return groups;
};

export const activeUtteranceIndex = (
  utterances: Utterance[],
  currentTime: number | null
): number | null => {
  if (currentTime === null) {
    return null;
  }

  const index = utterances.findIndex(
    (utterance) => currentTime >= utterance.start && currentTime < utterance.end
  );

  return index === -1 ? null : index;
};

export const speakerColorClass = (speakers: string[], speaker: string): string => {
  const position = Math.max(0, speakers.indexOf(speaker));

  return SPEAKER_CLASSES[position % SPEAKER_CLASSES.length];
};
