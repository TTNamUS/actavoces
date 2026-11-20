import type { JSX } from 'preact';
import type {
  AppSettings,
  AppSettingsUpdate,
  CaptureDeviceInfo,
  DesktopRuntimeStatus,
  ModelInventoryItem
} from '../../../types/desktop';

export interface SettingsTextField {
  key: keyof AppSettingsUpdate;
  label: string;
  inputType?: 'text' | 'password';
  value: string;
  onInput: JSX.InputEventHandler<HTMLInputElement>;
}

export interface SettingsFolderField {
  key: 'outputDirectory' | 'modelStorageDirectory';
  label: string;
  value: string;
  onSelect: () => void;
}

export interface SettingsHotkeyField {
  label: string;
  value: string;
  displayValue: string;
  recording: boolean;
  onCapture: () => void;
}

export interface SettingsGlossaryEntry {
  value: string;
  onRemove: () => void;
}

export interface SettingsGlossaryField {
  label: string;
  hint: string;
  placeholder: string;
  value: string;
  entries: SettingsGlossaryEntry[];
  onInput: JSX.InputEventHandler<HTMLInputElement>;
  onKeyDown: JSX.KeyboardEventHandler<HTMLInputElement>;
  onAdd: () => void;
}

export interface SettingsNumberField {
  key: keyof AppSettingsUpdate;
  label: string;
  value: number;
  onInput: JSX.InputEventHandler<HTMLInputElement>;
}

export interface SettingsTextareaField {
  key: keyof AppSettingsUpdate;
  label: string;
  value: string;
  onInput: JSX.InputEventHandler<HTMLTextAreaElement>;
}

export interface SettingsSelectField {
  key: keyof AppSettingsUpdate;
  label: string;
  value: string;
  options: SettingsSelectOption[];
  onValueChange: (value: string) => void;
  hint?: SettingsFieldHint;
}

export interface SettingsSelectOption {
  value: string;
  label: string;
}

export interface SettingsFieldHint {
  tone: 'muted' | 'warning';
  title?: string;
  text: string;
  links?: SettingsFieldHintLink[];
}

export interface SettingsFieldHintLink {
  href: string;
  label: string;
}

export interface SettingsToggleField {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const buildSettingsUpdate = (settings: AppSettings): AppSettingsUpdate => ({
  outputDirectory: settings.outputDirectory,
  hotkey: settings.hotkey,
  overlayPosition: settings.overlayPosition,
  overlayDisplayMode: settings.overlayDisplayMode,
  closeToTray: settings.closeToTray,
  launchAtLogin: settings.launchAtLogin,
  microphoneDevice: settings.microphoneDevice,
  systemAudioSource: settings.systemAudioSource,
  sampleRate: settings.sampleRate,
  whisperModel: settings.whisperModel,
  transcriptionLanguage: settings.transcriptionLanguage,
  transcriptionContext: settings.transcriptionContext,
  computeType: settings.computeType,
  modelStorageDirectory: settings.modelStorageDirectory,
  diarizationBackend: settings.diarizationBackend,
  speakerCountMode: settings.speakerCountMode,
  exactSpeakers: settings.exactSpeakers,
  minSpeakers: settings.minSpeakers,
  maxSpeakers: settings.maxSpeakers,
  huggingFaceToken: '',
  diarizationSetupSkipped: settings.diarizationSetupSkipped,
  summaryEnabled: settings.summaryEnabled,
  providerBaseUrl: settings.providerBaseUrl,
  providerModel: settings.providerModel,
  providerApiKey: '',
  summaryPrompt: settings.summaryPrompt
});

export const settingsDraftChanged = (draft: AppSettingsUpdate, settings: AppSettings): boolean =>
  JSON.stringify(draft) !== JSON.stringify(buildSettingsUpdate(settings));

export const normalizeGlossaryEntries = (entries: string[]): string[] => {
  const seen = new Set<string>();
  const normalizedEntries: string[] = [];

  for (const value of entries) {
    const entry = value.trim();

    if (entry.length === 0 || seen.has(entry)) {
      continue;
    }

    seen.add(entry);
    normalizedEntries.push(entry);
  }

  return normalizedEntries;
};

export const glossaryEntriesFromContext = (context: string): string[] =>
  normalizeGlossaryEntries(context.split('\n'));

export const contextFromGlossaryEntries = (entries: string[]): string => entries.join('\n');

export const captureDeviceOptions = (
  devices: CaptureDeviceInfo[],
  selectedValue: string
): SettingsSelectOption[] => {
  const options = devices.map((device) => ({
    value: device.name,
    label: device.name
  }));

  if (
    selectedValue.trim().length > 0 &&
    !options.some((option) => option.value === selectedValue)
  ) {
    return [
      {
        value: selectedValue,
        label: selectedValue
      },
      ...options
    ];
  }

  return options;
};

const modifierKeys = new Set(['Alt', 'Control', 'Meta', 'Shift']);

const hotkeyKey = (event: KeyboardEvent): string | null => {
  if (event.key === ' ') {
    return 'Space';
  }

  if (modifierKeys.has(event.key)) {
    return null;
  }

  if (event.key.length === 1) {
    return event.key.toUpperCase();
  }

  return event.key;
};

export const hotkeyFromKeyboardEvent = (event: KeyboardEvent): string | null => {
  const key = hotkeyKey(event);

  if (!key) {
    return null;
  }

  const modifiers = [
    event.ctrlKey || event.metaKey ? 'CommandOrControl' : null,
    event.altKey ? 'Alt' : null,
    event.shiftKey ? 'Shift' : null
  ].filter((modifier): modifier is string => modifier !== null);

  return [...modifiers, key].join('+');
};

export const SETTINGS_SECTIONS = [
  { id: 'general', label: 'General' },
  { id: 'recording', label: 'Recording' },
  { id: 'transcription', label: 'Transcription' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'ai', label: 'AI' },
  { id: 'system', label: 'System' }
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]['id'];

export const resolveSettingsSection = (value: string | undefined): SettingsSectionId =>
  SETTINGS_SECTIONS.find((section) => section.id === value)?.id ?? 'general';

export const pickFields = <T extends { key: string }>(fields: T[], keys: string[]): T[] =>
  keys.flatMap((key) => fields.filter((field) => field.key === key));

export interface RuntimeRow {
  label: string;
  value: string;
  mono?: boolean;
}

export const runtimeRows = (
  desktop: DesktopRuntimeStatus,
  settings: AppSettings,
  hotkeyLabel: string
): RuntimeRow[] => [
  {
    label: 'Worker',
    value: desktop.workerHealthOk ? 'Healthy' : desktop.workerRunning ? 'Running' : 'Stopped'
  },
  { label: 'Transcription setup', value: desktop.workerSetupStatus },
  { label: 'CUDA', value: desktop.cudaAvailable ? 'Available' : 'CPU fallback' },
  {
    label: 'Status window',
    value:
      settings.overlayDisplayMode === 'none'
        ? 'Off'
        : settings.overlayDisplayMode === 'minimal'
          ? 'Minimal'
          : 'Full'
  },
  {
    label: 'Hotkey',
    value: `${desktop.hotkeyRegistered ? 'Registered' : 'Pending'} - ${hotkeyLabel}`,
    mono: true
  }
];

export const runtimeErrors = (desktop: DesktopRuntimeStatus): string[] =>
  [desktop.hotkeyError, desktop.workerError, desktop.cudaError].filter(
    (error): error is string => error !== null
  );

export const modelBadge = (
  model: ModelInventoryItem | null | undefined
): { label: string; status: 'complete' | 'needsSetup' | 'pending' } => {
  if (model?.installed) {
    return { label: 'Installed', status: 'complete' };
  }

  return model?.setupRequired
    ? { label: 'Setup required', status: 'needsSetup' }
    : { label: 'Missing', status: 'pending' };
};
