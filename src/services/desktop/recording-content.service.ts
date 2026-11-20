import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import type { RecordingContent } from '../../types/desktop';

export const getRecordingContent = (recordingId: string) =>
  invoke<RecordingContent>('get_recording_content', { input: { recordingId } });

export const audioSourceUrl = (audioPath: string | null): string | null => {
  if (audioPath === null) {
    return null;
  }

  try {
    return convertFileSrc(audioPath);
  } catch {
    return null;
  }
};
