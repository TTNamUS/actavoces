import { describe, expect, it } from 'vitest';
import {
  modelBadge,
  pickFields,
  resolveSettingsSection,
  runtimeErrors,
  runtimeRows,
  SETTINGS_SECTIONS
} from '../components/settings/hooks/settings.helpers';
import type { AppSettings, DesktopRuntimeStatus } from '../types/desktop';

const desktop = (overrides: Partial<DesktopRuntimeStatus> = {}): DesktopRuntimeStatus => ({
  overlayVisible: false,
  hotkeyRegistered: true,
  hotkeyError: null,
  workerRunning: false,
  workerHealthOk: false,
  workerError: null,
  workerSetupStatus: 'ready',
  workerSetupStep: '',
  workerSetupError: null,
  cudaAvailable: false,
  cudaError: null,
  ...overrides
});

const settings = (mode: AppSettings['overlayDisplayMode']) =>
  ({ overlayDisplayMode: mode }) as AppSettings;

describe('resolveSettingsSection', () => {
  it('accepts the six sections and falls back to general', () => {
    expect(SETTINGS_SECTIONS.map((section) => section.id)).toEqual([
      'general',
      'recording',
      'transcription',
      'speakers',
      'ai',
      'system'
    ]);
    expect(resolveSettingsSection('ai')).toBe('ai');
    expect(resolveSettingsSection('nope')).toBe('general');
    expect(resolveSettingsSection(undefined)).toBe('general');
  });
});

describe('pickFields', () => {
  it('returns fields in the requested key order and ignores unknown keys', () => {
    const fields = [{ key: 'a' }, { key: 'b' }, { key: 'c' }];

    expect(pickFields(fields, ['c', 'a', 'zzz']).map((field) => field.key)).toEqual(['c', 'a']);
  });
});

describe('runtimeRows / runtimeErrors', () => {
  it('summarises worker, CUDA, status window and hotkey', () => {
    const rows = runtimeRows(desktop({ workerHealthOk: true }), settings('minimal'), 'Ctrl+K');

    expect(rows.find((row) => row.label === 'Worker')?.value).toBe('Healthy');
    expect(rows.find((row) => row.label === 'CUDA')?.value).toBe('CPU fallback');
    expect(rows.find((row) => row.label === 'Status window')?.value).toBe('Minimal');
    expect(rows.find((row) => row.label === 'Hotkey')?.value).toBe('Registered - Ctrl+K');
    expect(
      runtimeRows(desktop({ workerRunning: true }), settings('none'), 'x').slice(0, 4)
    ).toMatchObject([{ value: 'Running' }, {}, {}, { value: 'Off' }]);
  });

  it('lists only present errors', () => {
    expect(runtimeErrors(desktop())).toEqual([]);
    expect(runtimeErrors(desktop({ workerError: 'w', cudaError: 'c' }))).toEqual(['w', 'c']);
  });
});

describe('modelBadge', () => {
  it('maps installed, setup-required and missing models', () => {
    const model = { name: 'small', installed: false, setupRequired: false, dependency: '' };

    expect(modelBadge({ ...model, installed: true })).toEqual({
      label: 'Installed',
      status: 'complete'
    });
    expect(modelBadge({ ...model, setupRequired: true }).status).toBe('needsSetup');
    expect(modelBadge(model).status).toBe('pending');
    expect(modelBadge(null).label).toBe('Missing');
  });
});
