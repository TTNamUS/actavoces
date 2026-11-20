import { act, renderHook } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { useSettingsPage } from '../components/settings/hooks/useSettingsPage.hook';
import { themeStore } from '../stores/theme.store';

vi.mock('../components/app-shell/context/AppContext', () => ({ useAppContext: vi.fn() }));

const navigateTo = vi.fn();
const openPath = vi.fn();
let draftOverrides: Record<string, unknown> = {};
let unsaved = true;
let errors: string[] = [];

const key = (value: string) => ({ key: value, label: value });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
  window.localStorage.clear();
  themeStore.mode.value = 'system';
  draftOverrides = {};
  unsaved = true;
  errors = [];
  vi.mocked(useAppContext).mockImplementation(
    () =>
      ({
        data: {
          snapshot: {
            value: {
              models: [{ name: 'small', installed: true, setupRequired: false, dependency: '' }],
              desktop: {
                hotkeyRegistered: true,
                workerHealthOk: true,
                workerSetupStatus: 'ready',
                cudaAvailable: false,
                hotkeyError: null,
                workerError: null,
                cudaError: null
              },
              settings: {
                hotkey: 'X',
                overlayDisplayMode: 'full',
                outputDirectory: '/out',
                modelStorageDirectory: '/models',
                databasePath: '/db',
                providerApiKeyConfigured: true,
                huggingFaceTokenConfigured: false,
                modelRecommendation: {
                  recommendedModel: 'small',
                  reason: 'fits',
                  userOverridden: false
                }
              }
            }
          },
          settingsValidationErrors: { value: errors },
          selectedModel: { value: { name: 'small', installed: true, setupRequired: false } },
          displayHotkey: (value: string) => value,
          updateStatus: { value: 'up to date' },
          updateAvailable: { value: null },
          appVersion: { value: '1.0.0' }
        },
        status: {
          hasUnsavedSettings: { value: unsaved },
          savingSettings: { value: false },
          loading: { value: false },
          installingModel: { value: false },
          updateChecking: { value: false },
          updateInstalling: { value: false }
        },
        settings: {
          draft: {
            value: { whisperModel: 'small', speakerCountMode: 'automatic', ...draftOverrides }
          },
          hotkeyField: key('hotkey'),
          toggles: {},
          captureSelectFields: [
            'overlayPosition',
            'overlayDisplayMode',
            'microphoneDevice',
            'systemAudioSource'
          ].map(key),
          numberFields: ['sampleRate', 'exactSpeakers', 'minSpeakers', 'maxSpeakers'].map(key),
          folderFields: ['outputDirectory', 'modelStorageDirectory'].map(key),
          selectFields: [
            'whisperModel',
            'transcriptionLanguage',
            'computeType',
            'diarizationBackend'
          ].map(key),
          speakerCountField: key('speakerCountMode'),
          glossaryField: key('glossary'),
          textFields: [],
          textareaFields: [],
          huggingFaceTokenField: key('huggingFaceToken')
        },
        actions: {
          saveSettings: vi.fn(),
          clearProviderApiKey: vi.fn(),
          clearHuggingFaceToken: vi.fn(),
          refreshModels: vi.fn(),
          installSelectedModel: vi.fn(),
          checkWorker: vi.fn(),
          checkForUpdates: vi.fn(),
          installUpdate: vi.fn(),
          recording: { openPath }
        },
        navigation: { navigateTo }
      }) as unknown as ReturnType<typeof useAppContext>
  );
});

describe('useSettingsPage', () => {
  it('marks the requested section active and falls back to general', () => {
    const ai = renderHook(() => useSettingsPage('ai')).result.current;
    const bad = renderHook(() => useSettingsPage('nope')).result.current;

    expect(ai.data.section).toBe('ai');
    expect(ai.data.nav.filter((item) => item.isActive).map((item) => item.id)).toEqual(['ai']);
    expect(bad.data.section).toBe('general');
  });

  it('navigates to a section path from the nav', () => {
    const { result } = renderHook(() => useSettingsPage('general'));

    result.current.data.nav.find((item) => item.id === 'system')?.onSelect();
    expect(navigateTo).toHaveBeenCalledWith('/settings/system');
  });

  it('splits fields across sections by key', () => {
    const { result } = renderHook(() => useSettingsPage('general'));

    expect(result.current.data.statusWindowFields.map((field) => field.key)).toEqual([
      'overlayPosition',
      'overlayDisplayMode'
    ]);
    expect(result.current.data.captureFields.map((field) => field.key)).toEqual([
      'microphoneDevice',
      'systemAudioSource'
    ]);
    expect(result.current.data.transcriptionFields.map((field) => field.key)).toEqual([
      'whisperModel',
      'transcriptionLanguage',
      'computeType'
    ]);
    expect(result.current.data.diarizationField?.key).toBe('diarizationBackend');
  });

  it('shows speaker count inputs only for the chosen mode', () => {
    const keysFor = (mode: string) => {
      draftOverrides = { speakerCountMode: mode };

      return renderHook(() =>
        useSettingsPage('speakers')
      ).result.current.data.speakerNumberFields.map((field) => field.key);
    };

    expect(keysFor('automatic')).toEqual([]);
    expect(keysFor('exact')).toEqual(['exactSpeakers']);
    expect(keysFor('range')).toEqual(['minSpeakers', 'maxSpeakers']);
  });

  it('only allows saving with unsaved, valid changes', () => {
    expect(renderHook(() => useSettingsPage()).result.current.status.canSave).toBe(true);

    unsaved = false;
    expect(renderHook(() => useSettingsPage()).result.current.status.canSave).toBe(false);

    unsaved = true;
    errors = ['bad'];
    expect(renderHook(() => useSettingsPage()).result.current.status.canSave).toBe(false);
  });

  it('applies theme changes immediately and ignores invalid modes', () => {
    const { result } = renderHook(() => useSettingsPage());

    act(() => result.current.data.theme.onChange('dark'));
    expect(window.localStorage.getItem('actavoces.theme')).toBe('dark');

    act(() => result.current.data.theme.onChange('neon'));
    expect(window.localStorage.getItem('actavoces.theme')).toBe('dark');
  });

  it('opens storage folders', () => {
    const { result } = renderHook(() => useSettingsPage('system'));

    result.current.data.storage.onOpenOutput();
    result.current.data.storage.onOpenModels();
    expect(openPath).toHaveBeenNthCalledWith(1, '/out');
    expect(openPath).toHaveBeenNthCalledWith(2, '/models');
  });
});
