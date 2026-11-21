import { IconActivity, IconBooks, IconSettings, IconSparkles } from '@tabler/icons-react';
import type { AppSettings, DesktopRuntimeStatus } from '../../../types/desktop';
import type { StatusTone } from '../../../utils/status';

export interface WorkerPillInfo {
  label: string;
  tone: StatusTone;
}

export const workerPillInfo = (
  desktop: DesktopRuntimeStatus,
  settings: Pick<AppSettings, 'transcriptionEngine'>
): WorkerPillInfo => {
  if (settings.transcriptionEngine === 'none') {
    return { label: 'Recording only', tone: 'neutral' };
  }

  if (settings.transcriptionEngine === 'cloud') {
    return { label: 'Cloud transcription', tone: 'moss' };
  }

  if (desktop.workerError !== null || desktop.workerSetupStatus === 'failed') {
    return { label: 'Runtime error', tone: 'ember' };
  }

  if (desktop.workerSetupStatus === 'installing') {
    return { label: 'Installing runtime…', tone: 'amber' };
  }

  if (desktop.workerSetupStatus === 'missing') {
    return { label: 'Runtime not installed', tone: 'amber' };
  }

  return { label: 'Local runtime ready', tone: 'moss' };
};

export const NAV_ICON: Record<string, typeof IconBooks> = {
  '/': IconBooks,
  '/activity': IconActivity,
  '/ask': IconSparkles,
  '/settings': IconSettings
};

export const COMING_SOON_PATHS: string[] = ['/ask'];
