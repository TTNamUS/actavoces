import { useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import type { Recording } from '../../../types/desktop';
import { formatClock, formatDay, formatTime } from '../../../utils/format';
import { recordingPath } from '../../../utils/routes';
import { statusInfo } from '../../../utils/status';
import { useAppContext } from '../../app-shell/context/AppContext';
import {
  canRerunSummary,
  canRetryRecording,
  recordingPipelineStatus,
  recordingProgress
} from '../../recordings/hooks/recording.helpers';
import {
  filterRecordings,
  groupRecordingsByDay,
  recordingMeta,
  recordingRowStatus
} from './library.helpers';

export const useLibrary = () => {
  const app = useAppContext();
  const query = useSignal('');
  const deleteTarget = useSignal<Recording | null>(null);
  const renameId = useSignal<string | null>(null);
  const renameDraft = useSignal('');
  const { recording: actions } = app.actions;
  const snapshot = app.data.snapshot.value;
  const summaryEnabled = snapshot.settings.summaryEnabled;
  const busy = app.status.loading.value;

  const row = (recording: Recording) => ({
    id: recording.id,
    title: recording.title,
    dateLabel: formatDay(recording.startedAt),
    timeLabel: formatTime(recording.startedAt),
    meta: recordingMeta(recording),
    status: recordingRowStatus(recording),
    durationLabel:
      recording.durationSeconds === null ? '—' : formatClock(recording.durationSeconds),
    onOpen: () => app.navigation.navigateTo(recordingPath(recording.id)),
    isRenaming: renameId.value === recording.id,
    renameValue: renameDraft.value,
    onRenameInput: (event: JSX.TargetedEvent<HTMLInputElement>) => {
      renameDraft.value = event.currentTarget.value;
    },
    onRenameKeyDown: (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        renameId.value = null;
      }
    },
    onRenameSubmit: async (event: JSX.TargetedEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (await actions.renameTitleTo(recording, renameDraft.value)) {
        renameId.value = null;
      }
    },
    menuItems: [
      {
        label: 'Rename',
        onSelect: () => {
          renameDraft.value = recording.title;
          renameId.value = recording.id;
        }
      },
      {
        label: 'Open folder',
        onSelect: () => {
          void actions.openPath(recording.artifactDirectory);
        }
      },
      {
        label: 'Retry jobs',
        disabled: busy || !canRetryRecording(recording),
        onSelect: () => {
          void actions.retry(recording);
        }
      },
      {
        label: 'Re-run summary',
        disabled: busy || !summaryEnabled || !canRerunSummary(recording),
        onSelect: () => {
          void actions.rerunSummary(recording);
        }
      },
      {
        label: 'Delete',
        danger: true,
        onSelect: () => {
          deleteTarget.value = recording;
        }
      }
    ]
  });

  const all = snapshot.recordings;
  const visible = filterRecordings(all, query.value);
  const processing =
    all.find((recording) => recordingRowStatus(recording) === 'processing') ?? null;
  const count = all.length;

  return {
    data: {
      query: query.value,
      subtitle: `${count} ${count === 1 ? 'recording' : 'recordings'}, all on this computer.`,
      groups: groupRecordingsByDay(visible, Date.now()).map((group) => ({
        label: group.label,
        rows: group.recordings.map(row)
      })),
      nowProcessing:
        processing === null
          ? null
          : {
              id: processing.id,
              title: processing.title,
              progress: recordingProgress(processing),
              message: recordingPipelineStatus(processing).message,
              stages: processing.stages.map((stage) => ({
                id: stage.id,
                label: stage.label,
                tone: statusInfo(stage.status).tone
              })),
              onOpen: () => app.navigation.navigateTo(recordingPath(processing.id))
            },
      deleteTitle: deleteTarget.value?.title ?? null
    },
    status: {
      isEmpty: count === 0,
      noResults: count > 0 && visible.length === 0,
      busy,
      hotkey: app.data.displayHotkey(snapshot.settings.hotkey),
      isRecording: app.status.isRecording.value
    },
    actions: {
      onSearchInput: (event: JSX.TargetedEvent<HTMLInputElement>) => {
        query.value = event.currentTarget.value;
      },
      onRecord: app.actions.startRecording,
      onCancelDelete: () => {
        deleteTarget.value = null;
      },
      onConfirmDelete: async () => {
        const target = deleteTarget.value;

        deleteTarget.value = null;

        if (target !== null) {
          await actions.removeConfirmed(target);
        }
      }
    }
  };
};

export type LibraryModel = ReturnType<typeof useLibrary>;
