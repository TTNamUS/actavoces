import { describe, expect, it } from 'vitest';
import { statusInfo } from '../utils/status';

describe('statusInfo', () => {
  it('maps active work to amber and finished work to moss', () => {
    expect(statusInfo('running')).toEqual({ tone: 'amber', label: 'Processing' });
    expect(statusInfo('pending')).toEqual({ tone: 'amber', label: 'Queued' });
    expect(statusInfo('complete')).toEqual({ tone: 'moss', label: 'Ready' });
  });

  it('maps recording and failure to ember', () => {
    expect(statusInfo('recording').tone).toBe('ember');
    expect(statusInfo('failed').tone).toBe('ember');
  });

  it('keeps setup prompts amber and inert states neutral', () => {
    expect(statusInfo('needsSetup')).toEqual({ tone: 'amber', label: 'Needs setup' });
    expect(statusInfo('skipped').tone).toBe('neutral');
    expect(statusInfo('idle').tone).toBe('neutral');
  });
});
