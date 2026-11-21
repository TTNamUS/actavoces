import { describe, expect, it } from 'vitest';
import { workerPillInfo } from '../components/app-shell/hooks/shell.helpers';
import type { DesktopRuntimeStatus } from '../types/desktop';

const desktop = (overrides: Partial<DesktopRuntimeStatus>): DesktopRuntimeStatus => ({
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

describe('workerPillInfo', () => {
  it('reports errors first, then health, then starting', () => {
    expect(workerPillInfo(desktop({ workerError: 'boom', workerHealthOk: true }))).toEqual({
      label: 'Worker error',
      tone: 'ember'
    });
    expect(workerPillInfo(desktop({ workerHealthOk: true }))).toEqual({
      label: 'Worker healthy',
      tone: 'moss'
    });
    expect(workerPillInfo(desktop({}))).toEqual({ label: 'Worker starting…', tone: 'amber' });
  });
});
