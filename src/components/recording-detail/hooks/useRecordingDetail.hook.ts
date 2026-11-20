import { useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import {
  audioSourceUrl,
  getRecordingContent
} from '../../../services/desktop/recording-content.service';
import type { RecordingContent } from '../../../types/desktop';
import { formatClock, formatDay, formatTime } from '../../../utils/format';
import { parseMarkdown } from '../../../utils/markdown';
import { LIBRARY_PATH, settingsPath } from '../../../utils/routes';
import { statusInfo } from '../../../utils/status';
import { useAppContext } from '../../app-shell/context/AppContext';
import { errorMessage } from '../../app-shell/hooks/appRuntime.helpers';
import { recordingRowStatus } from '../../library/hooks/library.helpers';
import {
  canRerunSummary,
  canRetryRecording,
  recordingPipelineStatus,
  recordingProgress
} from '../../recordings/hooks/recording.helpers';
import { activeUtteranceIndex, groupUtterances, speakerColorClass } from './transcript.helpers';
import { useAudioPlayer } from './useAudioPlayer.hook';

export type DetailTab = 'transcript' | 'summary';
export type TranscriptMode = 'speaker' | 'raw';

type InputEvent = JSX.TargetedEvent<HTMLInputElement>;
type SubmitEvent = JSX.TargetedEvent<HTMLFormElement>;

const blocksOf = (markdown: string | null) => (markdown === null ? null : parseMarkdown(markdown));

export const useRecordingDetail = (id: string) => {
  const app = useAppContext();
  const snapshot = app.data.snapshot.value;
  const recording = snapshot.recordings.find((item) => item.id === id) ?? null;
  const content = useSignal<RecordingContent | null>(null);
  const contentLoading = useSignal(false);
  const contentError = useSignal<string | null>(null);
  const tab = useSignal<DetailTab>('transcript');
  const mode = useSignal<TranscriptMode>('speaker');
  const titleDraft = useSignal<string | null>(null);
  const speakerEdit = useSignal<{ name: string; draft: string } | null>(null);
  const deleteOpen = useSignal(false);
  const { recording: actions } = app.actions;

  const contentKey =
    recording === null
      ? null
      : [
          recording.artifactDirectory,
          recording.stages.map((stage) => `${stage.id}:${stage.status}`).join(','),
          recording.speakerLabels.map((speaker) => speaker.name).join(',')
        ].join('|');

  useEffect(() => {
    if (contentKey === null) {
      return;
    }

    let cancelled = false;

    contentLoading.value = true;
    getRecordingContent(id)
      .then((next) => {
        if (!cancelled) {
          content.value = next;
          contentError.value = null;
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          contentError.value = errorMessage(error, 'Unable to load recording content');
        }
      })
      .finally(() => {
        if (!cancelled) {
          contentLoading.value = false;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, contentKey]);

  const player = useAudioPlayer(audioSourceUrl(content.value?.audioPath ?? null));
  const utterances = content.value?.utterances ?? [];
  const speakers = recording?.speakerLabels.map((speaker) => speaker.name) ?? [];
  const lineCounts = new Map<string, number>();

  for (const utterance of utterances) {
    lineCounts.set(utterance.speaker, (lineCounts.get(utterance.speaker) ?? 0) + 1);
  }

  const dateLabel =
    recording === null
      ? ''
      : `${formatDay(recording.startedAt)} at ${formatTime(recording.startedAt)}`;

  return {
    data: {
      recording,
      dateLabel,
      durationLabel:
        recording?.durationSeconds == null ? '—' : formatClock(recording.durationSeconds),
      status: recording === null ? ('idle' as const) : recordingRowStatus(recording),
      progress: recording === null ? 0 : recordingProgress(recording),
      pipelineMessage: recording === null ? '' : recordingPipelineStatus(recording).message,
      stages: (recording?.stages ?? []).map((stage) => ({
        id: stage.id,
        label: stage.label,
        tone: statusInfo(stage.status).tone,
        percentLabel: stage.status === 'running' ? `${stage.progress}%` : null,
        message: stage.message
      })),
      titleDraft: titleDraft.value,
      deleteTitle: deleteOpen.value ? (recording?.title ?? null) : null,
      speakers: speakers.map((name) => ({
        name,
        colorClass: speakerColorClass(speakers, name),
        lineCount: lineCounts.get(name) ?? 0,
        onRename: () => {
          speakerEdit.value = { name, draft: name };
        },
        draft: speakerEdit.value?.name === name ? speakerEdit.value.draft : null
      })),
      groups: groupUtterances(utterances).map((group) => ({
        speaker: group.speaker,
        colorClass: speakerColorClass(speakers, group.speaker),
        lines: group.lines.map((line) => ({
          index: line.index,
          text: line.text,
          timeLabel: formatClock(line.start),
          onSeek: () => player.playFrom(line.start)
        }))
      })),
      activeLine: player.available ? activeUtteranceIndex(utterances, player.currentTime) : null,
      transcriptBlocks: blocksOf(
        content.value?.transcriptMarkdown ?? content.value?.rawTranscriptMarkdown ?? null
      ),
      rawBlocks: blocksOf(content.value?.rawTranscriptMarkdown ?? null),
      summaryBlocks: blocksOf(content.value?.summaryMarkdown ?? null),
      hasUtterances: utterances.length > 0,
      tab: tab.value,
      mode: mode.value,
      player: {
        available: player.available,
        playing: player.playing,
        currentLabel: formatClock(player.currentTime),
        durationLabel: formatClock(player.duration),
        currentTime: player.currentTime,
        duration: player.duration
      },
      summaryEnabled: snapshot.settings.summaryEnabled,
      files: (recording?.artifacts ?? [])
        .filter((artifact) => artifact.ready)
        .map((artifact) => ({
          label: artifact.label,
          path: artifact.path,
          onOpen: () => {
            void actions.openPath(artifact.path);
          }
        }))
    },
    status: {
      notFound: recording === null,
      contentLoading: contentLoading.value,
      contentError: contentError.value,
      busy: app.status.loading.value,
      editingTitle: titleDraft.value !== null,
      canRetry: recording !== null && canRetryRecording(recording),
      canRerunSummary:
        recording !== null && snapshot.settings.summaryEnabled && canRerunSummary(recording)
    },
    actions: {
      onBack: () => app.navigation.navigateTo(LIBRARY_PATH),
      onOpenAiSettings: () => app.navigation.navigateTo(settingsPath('ai')),
      onTab: (value: string) => {
        tab.value = value === 'summary' ? 'summary' : 'transcript';
      },
      onMode: (value: string) => {
        mode.value = value === 'raw' ? 'raw' : 'speaker';
      },
      onStartTitleEdit: () => {
        titleDraft.value = recording?.title ?? '';
      },
      onTitleInput: (event: InputEvent) => {
        titleDraft.value = event.currentTarget.value;
      },
      onTitleKeyDown: (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
          titleDraft.value = null;
        }
      },
      onSubmitTitle: async (event: SubmitEvent) => {
        event.preventDefault();

        if (
          recording !== null &&
          (await actions.renameTitleTo(recording, titleDraft.value ?? ''))
        ) {
          titleDraft.value = null;
        }
      },
      onStartSpeakerEdit: (name: string) => {
        speakerEdit.value = { name, draft: name };
      },
      onSpeakerInput: (event: InputEvent) => {
        if (speakerEdit.value !== null) {
          speakerEdit.value = { ...speakerEdit.value, draft: event.currentTarget.value };
        }
      },
      onSpeakerKeyDown: (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
          speakerEdit.value = null;
        }
      },
      onSubmitSpeaker: async (event: SubmitEvent) => {
        event.preventDefault();

        const edit = speakerEdit.value;

        if (
          recording !== null &&
          edit !== null &&
          (await actions.renameSpeakerTo(recording, edit.name, edit.draft))
        ) {
          speakerEdit.value = null;
        }
      },
      onOpenFolder: () => {
        if (recording !== null) {
          void actions.openPath(recording.artifactDirectory);
        }
      },
      onRetry: () => {
        if (recording !== null) {
          void actions.retry(recording);
        }
      },
      onRerunSummary: () => {
        if (recording !== null) {
          void actions.rerunSummary(recording);
        }
      },
      onAskDelete: () => {
        deleteOpen.value = true;
      },
      onCancelDelete: () => {
        deleteOpen.value = false;
      },
      onConfirmDelete: async () => {
        deleteOpen.value = false;

        if (recording !== null && (await actions.removeConfirmed(recording))) {
          app.navigation.navigateTo(LIBRARY_PATH);
        }
      },
      onTogglePlay: player.toggle,
      onSkipBack: () => player.skip(-1),
      onSkipForward: () => player.skip(1),
      onSeekInput: (event: InputEvent) => player.seek(Number(event.currentTarget.value)),
      onSeekTimestamp: (seconds: number) => player.playFrom(seconds)
    }
  };
};

export type RecordingDetailModel = ReturnType<typeof useRecordingDetail>;
