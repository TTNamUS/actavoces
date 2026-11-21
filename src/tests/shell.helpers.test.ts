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
  it('shows recording only when no engine is chosen', () => {
    expect(workerPillInfo(desktop({}), { transcriptionEngine: 'none' })).toEqual({
      label: 'Recording only',
      tone: 'neutral'
    });
  });

  it('does not depend on the local runtime for the cloud engine', () => {
    expect(
      workerPillInfo(desktop({ workerSetupStatus: 'missing' }), { transcriptionEngine: 'cloud' })
    ).toEqual({ label: 'Cloud transcription', tone: 'moss' });
  });

  it('reports local runtime install state', () => {
    const local = { transcriptionEngine: 'local' } as const;

    expect(workerPillInfo(desktop({ workerSetupStatus: 'missing' }), local).label).toBe(
      'Runtime not installed'
    );
    expect(workerPillInfo(desktop({ workerSetupStatus: 'installing' }), local).label).toBe(
      'Installing runtime…'
    );
    expect(workerPillInfo(desktop({ workerError: 'boom' }), local)).toEqual({
      label: 'Runtime error',
      tone: 'ember'
    });
    expect(workerPillInfo(desktop({}), local)).toEqual({
      label: 'Local runtime ready',
      tone: 'moss'
    });
  });
});
