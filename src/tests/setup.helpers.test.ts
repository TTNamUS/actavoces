import { describe, expect, it } from 'vitest';
import { setupFlowState } from '../components/setup/hooks/setup.helpers';

describe('setupFlowState', () => {
  it('starts on the runtime step with an indeterminate bar', () => {
    const flow = setupFlowState('installing', false);

    expect(flow.step).toBe(1);
    expect(flow.stepStates).toEqual(['active', 'todo']);
    expect(flow.tone).toBe('amber');
    expect(flow.progress).toBeNull();
    expect(flow.title).toBe('Preparing transcription runtime.');
  });

  it('moves to the speakers step once diarization setup is needed', () => {
    const flow = setupFlowState('ready', true);

    expect(flow.step).toBe(2);
    expect(flow.stepStates).toEqual(['done', 'active']);
    expect(flow.title).toBe("Who's speaking?");
  });

  it('fills the bar on failure and success with matching tones', () => {
    expect(setupFlowState('failed', false)).toMatchObject({ tone: 'ember', progress: 100 });
    expect(setupFlowState('ready', false)).toMatchObject({ tone: 'moss', progress: 100 });
  });
});
