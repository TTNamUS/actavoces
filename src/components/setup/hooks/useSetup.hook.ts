import { useAppContext } from '../../app-shell/context/AppContext';
import { setupFlowState } from './setup.helpers';

const DIARIZATION_BODY =
  'Speaker labels need local pyannote.audio, ffmpeg, accepted Hugging Face model terms and an access token. You can skip this and add it later in Settings.';

export const useSetup = () => {
  const app = useAppContext();
  const progress = app.data.setupProgress.value;
  const needsDiarization = app.status.needsDiarizationSetup.value;
  const flow = setupFlowState(progress.status, needsDiarization);
  const running = app.status.setupRunning.value;

  return {
    data: {
      ...flow,
      body: needsDiarization ? DIARIZATION_BODY : progress.step,
      stepLabels: ['Runtime', 'Speakers'],
      statusLabel: progress.status,
      error: progress.error,
      token: app.settings.huggingFaceTokenField
    },
    status: {
      needsDiarization,
      running,
      canRetry: progress.status === 'failed' && !needsDiarization
    },
    actions: {
      retry: app.actions.retrySetup,
      setupDiarization: app.actions.setupDiarization,
      skipDiarization: app.actions.skipDiarizationSetup
    }
  };
};

export type SetupModel = ReturnType<typeof useSetup>;
