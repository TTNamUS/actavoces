import type { PipelineStageStatus, RecordingStatus } from '../types/desktop';

export type StatusTone = 'ember' | 'amber' | 'moss' | 'neutral';

export type AnyStatus = PipelineStageStatus | RecordingStatus;

interface StatusInfo {
  tone: StatusTone;
  label: string;
}

const STATUS_INFO: Record<AnyStatus, StatusInfo> = {
  recording: { tone: 'ember', label: 'Recording' },
  processing: { tone: 'amber', label: 'Processing' },
  running: { tone: 'amber', label: 'Processing' },
  pending: { tone: 'amber', label: 'Queued' },
  complete: { tone: 'moss', label: 'Ready' },
  failed: { tone: 'ember', label: 'Failed' },
  needsSetup: { tone: 'amber', label: 'Needs setup' },
  skipped: { tone: 'neutral', label: 'Skipped' },
  idle: { tone: 'neutral', label: 'Idle' }
};

export const statusInfo = (status: AnyStatus): StatusInfo => STATUS_INFO[status];
