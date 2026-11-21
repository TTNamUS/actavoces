import { useSignal } from '@preact/signals';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'preact/hooks';
import { getAppSnapshot, stopRecording } from '../../../services/desktop/app.service';
import { appErrorSignal } from '../../../stores/app.store';
import type { AppSettings, AppSnapshot } from '../../../types/desktop';
import { formatClock } from '../../../utils/format';
import { useElapsedSeconds } from '../../shared/hooks/useElapsedSeconds.hook';

interface RecordingOverlaySyncPayload {
  visible: boolean;
  displayMode: AppSettings['overlayDisplayMode'];
}

const effectiveDisplayMode = (snapshot: AppSnapshot): AppSettings['overlayDisplayMode'] =>
  snapshot.desktop.overlayVisible ? snapshot.settings.overlayDisplayMode : 'none';

export const useRecordingOverlay = () => {
  const stopping = useSignal(false);
  const displayMode = useSignal<AppSettings['overlayDisplayMode']>('full');
  const overlaySyncReceived = useSignal(false);
  const startedAt = useSignal<string | null>(null);
  const elapsed = useElapsedSeconds(startedAt.value);

  const handleStopRecording = async () => {
    stopping.value = true;
    appErrorSignal.value = null;

    try {
      await stopRecording();
    } catch (error) {
      appErrorSignal.value = error instanceof Error ? error.message : 'Unable to stop recording';
      stopping.value = false;
    }
  };

  useEffect(() => {
    if (!('__TAURI_INTERNALS__' in window)) {
      return;
    }

    void getAppSnapshot()
      .then((snapshot) => {
        startedAt.value = snapshot.activeRecording?.startedAt ?? null;

        if (!overlaySyncReceived.value) {
          displayMode.value = effectiveDisplayMode(snapshot);
        }
      })
      .catch(() => undefined);

    const snapshotListener = listen<AppSnapshot>('app-snapshot-updated', (event) => {
      startedAt.value = event.payload.activeRecording?.startedAt ?? null;
      displayMode.value = effectiveDisplayMode(event.payload);
    });
    const overlaySyncListener = listen<RecordingOverlaySyncPayload>(
      'recording-overlay-sync',
      (event) => {
        overlaySyncReceived.value = true;
        displayMode.value = event.payload.visible ? event.payload.displayMode : 'none';

        if (!event.payload.visible) {
          stopping.value = false;
        }
      }
    );

    return () => {
      void snapshotListener.then((unlisten) => unlisten());
      void overlaySyncListener.then((unlisten) => unlisten());
    };
  }, []);

  return {
    data: {
      elapsedLabel: formatClock(elapsed)
    },
    status: {
      displayMode,
      stopping
    },
    actions: {
      stopRecording: handleStopRecording
    }
  };
};
