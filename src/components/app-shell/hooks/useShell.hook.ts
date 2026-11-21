import { useEffect } from 'preact/hooks';
import { formatClock } from '../../../utils/format';
import { ACTIVITY_PATH, isRouteActive, navRoutes, SETUP_PATH } from '../../../utils/routes';
import { useElapsedSeconds } from '../../shared/hooks/useElapsedSeconds.hook';
import { useTheme } from '../../shared/hooks/useTheme.hook';
import { useAppContext } from '../context/AppContext';
import { COMING_SOON_PATHS, NAV_ICON, workerPillInfo } from './shell.helpers';

export const useShell = () => {
  const app = useAppContext();
  const theme = useTheme();
  const { location, navigateTo } = app.navigation;
  const setupReady = app.status.setupReady.value;
  const snapshot = app.data.snapshot.value;
  const isRecording = app.status.isRecording.value;
  const elapsed = useElapsedSeconds(snapshot.activeRecording?.startedAt ?? null);

  useEffect(() => {
    if (!setupReady && location !== SETUP_PATH) {
      navigateTo(SETUP_PATH, { replace: true });
    }

    if (setupReady && location === SETUP_PATH) {
      navigateTo('/', { replace: true });
    }
  }, [setupReady, location]);

  const activeJobCount = app.data.activeJobs.value.length;
  const sortformer = app.data.sortformerProgress.value;
  const updateToast = app.data.updateToast.value;

  return {
    data: {
      navItems: navRoutes.map((route) => ({
        ...route,
        icon: NAV_ICON[route.path],
        isActive: isRouteActive(route.path, location),
        badge: route.path === ACTIVITY_PATH && activeJobCount > 0 ? activeJobCount : null,
        comingSoon: COMING_SOON_PATHS.includes(route.path),
        onSelect: () => navigateTo(route.path)
      })),
      appVersion: app.data.appVersion.value,
      hotkey: app.data.displayHotkey(snapshot.settings.hotkey),
      worker: workerPillInfo(snapshot.desktop),
      elapsedLabel: formatClock(elapsed),
      themeIsDark: theme.resolved === 'dark'
    },
    status: {
      showChrome: setupReady && location !== SETUP_PATH,
      setupReady,
      isRecording,
      loading: app.status.loading.value
    },
    toasts: {
      error: app.status.error.value,
      sortformer,
      unsavedSettings: app.status.hasUnsavedSettings.value,
      savingSettings: app.status.savingSettings.value,
      updateMessage: updateToast === null ? null : updateToast.message
    },
    actions: {
      toggleTheme: theme.toggle,
      openSystemSettings: () => navigateTo('/settings/system'),
      startRecording: app.actions.startRecording,
      stopRecording: app.actions.stopRecording,
      saveSettings: app.actions.saveSettings,
      discardSettings: app.actions.discardSettings,
      dismissError: app.actions.dismissError,
      dismissUpdate: app.actions.dismissUpdateToast
    }
  };
};

export type ShellModel = ReturnType<typeof useShell>;
