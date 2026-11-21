import { settingsPath } from '../../../utils/routes';
import { isThemeMode } from '../../../utils/theme';
import { useAppContext } from '../../app-shell/context/AppContext';
import { useTheme } from '../../shared/hooks/useTheme.hook';
import {
  modelBadge,
  pickFields,
  resolveSettingsSection,
  runtimeErrors,
  runtimeRows,
  SETTINGS_SECTIONS
} from './settings.helpers';

const THEME_OPTIONS = [
  { value: 'system', label: 'Match system' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

export const useSettingsPage = (sectionParam?: string) => {
  const app = useAppContext();
  const theme = useTheme();
  const section = resolveSettingsSection(sectionParam);
  const snapshot = app.data.snapshot.value;
  const settings = app.settings;
  const draft = settings.draft.value;
  const validationErrors = app.data.settingsValidationErrors.value;

  return {
    data: {
      section,
      nav: SETTINGS_SECTIONS.map((item) => ({
        id: item.id,
        label: item.label,
        isActive: item.id === section,
        onSelect: () => app.navigation.navigateTo(settingsPath(item.id))
      })),
      validationErrors,
      theme: {
        value: theme.mode,
        options: THEME_OPTIONS,
        onChange: (value: string) => {
          if (isThemeMode(value)) {
            theme.setMode(value);
          }
        }
      },
      hotkey: settings.hotkeyField,
      toggles: settings.toggles,
      statusWindowFields: pickFields(settings.captureSelectFields, [
        'overlayPosition',
        'overlayDisplayMode'
      ]),
      captureFields: pickFields(settings.captureSelectFields, [
        'microphoneDevice',
        'systemAudioSource'
      ]),
      sampleRateField: pickFields(settings.numberFields, ['sampleRate'])[0] ?? null,
      outputFolder: pickFields(settings.folderFields, ['outputDirectory'])[0] ?? null,
      modelFolder: pickFields(settings.folderFields, ['modelStorageDirectory'])[0] ?? null,
      transcriptionFields: pickFields(settings.selectFields, [
        'whisperModel',
        'transcriptionLanguage',
        'computeType'
      ]),
      glossary: settings.glossaryField,
      model: {
        name: draft.whisperModel,
        badge: modelBadge(app.data.selectedModel.value),
        installed: app.data.selectedModel.value?.installed === true,
        recommendation: snapshot.settings.modelRecommendation,
        inventory: snapshot.models.map((model) => ({
          name: model.name,
          state: model.installed
            ? 'installed'
            : model.setupRequired
              ? `${model.dependency} required`
              : 'not installed'
        }))
      },
      diarizationField: pickFields(settings.selectFields, ['diarizationBackend'])[0] ?? null,
      speakerCountField: settings.speakerCountField,
      speakerNumberFields: pickFields(
        settings.numberFields,
        draft.speakerCountMode === 'exact'
          ? ['exactSpeakers']
          : draft.speakerCountMode === 'range'
            ? ['minSpeakers', 'maxSpeakers']
            : []
      ),
      usesPyannote: draft.diarizationBackend === 'pyannote',
      huggingFaceToken: {
        field: settings.huggingFaceTokenField,
        configured: snapshot.settings.huggingFaceTokenConfigured
      },
      providerFields: settings.textFields,
      apiKeyConfigured: snapshot.settings.providerApiKeyConfigured,
      promptFields: settings.textareaFields,
      runtime: {
        rows: runtimeRows(
          snapshot.desktop,
          snapshot.settings,
          app.data.displayHotkey(snapshot.settings.hotkey)
        ),
        errors: runtimeErrors(snapshot.desktop)
      },
      storage: {
        outputDirectory: snapshot.settings.outputDirectory,
        databasePath: snapshot.settings.databasePath,
        modelStorageDirectory: snapshot.settings.modelStorageDirectory,
        onOpenOutput: () => {
          void app.actions.recording.openPath(snapshot.settings.outputDirectory);
        },
        onOpenModels: () => {
          void app.actions.recording.openPath(snapshot.settings.modelStorageDirectory);
        }
      },
      update: {
        status: app.data.updateStatus.value,
        available: app.data.updateAvailable.value !== null
      },
      appVersion: app.data.appVersion.value
    },
    status: {
      canSave:
        app.status.hasUnsavedSettings.value &&
        !app.status.savingSettings.value &&
        validationErrors.length === 0,
      saving: app.status.savingSettings.value,
      loading: app.status.loading.value,
      installingModel: app.status.installingModel.value,
      updateChecking: app.status.updateChecking.value,
      updateInstalling: app.status.updateInstalling.value
    },
    actions: {
      save: app.actions.saveSettings,
      clearProviderApiKey: app.actions.clearProviderApiKey,
      clearHuggingFaceToken: app.actions.clearHuggingFaceToken,
      refreshModels: app.actions.refreshModels,
      installModel: app.actions.installSelectedModel,
      checkWorker: app.actions.checkWorker,
      checkForUpdates: app.actions.checkForUpdates,
      installUpdate: app.actions.installUpdate
    }
  };
};

export type SettingsPageModel = ReturnType<typeof useSettingsPage>;
