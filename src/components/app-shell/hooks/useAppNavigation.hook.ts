import type { Signal } from '@preact/signals';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { appSnapshotSignal } from '../../../stores/app.store';
import type { AppSettings } from '../../../types/desktop';
import { isSettingsLocation } from '../../../utils/routes';

interface UseAppNavigationInput {
  hasUnsavedSettings: Signal<boolean>;
  resetSettingsDraft: (settings: AppSettings) => void;
}

interface NavigateOptions {
  replace?: boolean;
}

export const useAppNavigation = ({
  hasUnsavedSettings,
  resetSettingsDraft
}: UseAppNavigationInput) => {
  const [location, setLocation] = useHashLocation();

  const navigateTo = (path: string, options?: NavigateOptions) => {
    if (isSettingsLocation(location) && !isSettingsLocation(path) && hasUnsavedSettings.value) {
      if (!window.confirm('Discard unsaved settings changes?')) {
        return;
      }

      resetSettingsDraft(appSnapshotSignal.value.settings);
    }

    setLocation(path, options);
  };

  return { location, navigateTo };
};
