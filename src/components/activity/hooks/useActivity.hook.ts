import type { PipelineJob, PipelineStage, Recording } from '../../../types/desktop';
import { formatDay, formatTime } from '../../../utils/format';
import { recordingPath } from '../../../utils/routes';
import { statusInfo } from '../../../utils/status';
import { useAppContext } from '../../app-shell/context/AppContext';
import { canRetryRecording } from '../../recordings/hooks/recording.helpers';

const STAGE_ORDER: PipelineStage['id'][] = ['recording', 'transcription', 'diarization', 'summary'];

const stageLabel = (recording: Recording, stageId: PipelineStage['id']): string =>
  recording.stages.find((stage) => stage.id === stageId)?.label ?? stageId;

const jobRow = (recording: Recording, job: PipelineJob) => ({
  id: job.id,
  label: stageLabel(recording, job.stage),
  status: job.status,
  progress: job.progress,
  tone: statusInfo(job.status).tone,
  message: job.message
});

export const useActivity = () => {
  const app = useAppContext();
  const { latestRecording, latestRecordingActions, latestRecordingProgress } = app.data;
  const { navigateTo } = app.navigation;
  const current = latestRecording.value;
  const currentActions = latestRecordingActions.value;
  const currentStatus = app.data.latestRecordingPipelineStatus.value;

  return {
    data: {
      current:
        current === null || currentActions === null || currentStatus === null
          ? null
          : {
              title: current.title,
              dateLabel: `${formatDay(current.startedAt)} at ${formatTime(current.startedAt)}`,
              progress: latestRecordingProgress.value,
              status: currentStatus,
              tone: statusInfo(currentStatus.status).tone,
              stages: current.stages.map((stage) => ({
                id: stage.id,
                label: stage.label,
                status: stage.status,
                percentLabel: stage.status === 'running' ? `${stage.progress}%` : null,
                message: stage.message
              })),
              canRetry: currentActions.canRetry,
              onOpen: () => navigateTo(recordingPath(current.id)),
              onOpenFolder: currentActions.onOpenFolder,
              onRetry: currentActions.onRetry
            },
      groups: app.data.groupedJobRows.value.map((row) => ({
        id: row.recording.id,
        title: row.recording.title,
        dateLabel: `${formatDay(row.recording.startedAt)} at ${formatTime(row.recording.startedAt)}`,
        status: row.pipelineStatus,
        progress: row.progress,
        canRetry: canRetryRecording(row.recording),
        jobs: [...row.jobs]
          .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage))
          .map((job) => jobRow(row.recording, job)),
        onOpen: () => navigateTo(recordingPath(row.recording.id)),
        onOpenFolder: row.onOpenFolder,
        onRetry: row.onRetry
      }))
    },
    status: {
      busy: app.status.loading.value
    }
  };
};

export type ActivityModel = ReturnType<typeof useActivity>;
