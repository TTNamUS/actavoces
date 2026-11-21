import type { WorkerSetupStatus } from '../../../types/desktop';
import type { StatusTone } from '../../../utils/status';

export type SetupStepState = 'done' | 'active' | 'todo';

export interface SetupFlowState {
  step: 1 | 2;
  stepStates: [SetupStepState, SetupStepState];
  title: string;
  tone: StatusTone;
  progress: number | null;
}

const PROGRESS_TONE: Record<WorkerSetupStatus, StatusTone> = {
  missing: 'amber',
  installing: 'amber',
  ready: 'moss',
  failed: 'ember'
};

export const setupFlowState = (
  status: WorkerSetupStatus,
  needsDiarization: boolean
): SetupFlowState => ({
  step: needsDiarization ? 2 : 1,
  stepStates: needsDiarization ? ['done', 'active'] : ['active', 'todo'],
  title: needsDiarization ? "Who's speaking?" : 'Preparing transcription runtime.',
  tone: PROGRESS_TONE[status],
  progress: status === 'ready' || status === 'failed' ? 100 : null
});
