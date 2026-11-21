import { IconActivity, IconBooks, IconSettings, IconSparkles } from '@tabler/icons-react';
import type { DesktopRuntimeStatus } from '../../../types/desktop';
import type { StatusTone } from '../../../utils/status';

export interface WorkerPillInfo {
  label: string;
  tone: StatusTone;
}

export const workerPillInfo = (desktop: DesktopRuntimeStatus): WorkerPillInfo => {
  if (desktop.workerError !== null) {
    return { label: 'Worker error', tone: 'ember' };
  }

  if (desktop.workerHealthOk) {
    return { label: 'Worker healthy', tone: 'moss' };
  }

  return { label: 'Worker starting…', tone: 'amber' };
};

export const NAV_ICON: Record<string, typeof IconBooks> = {
  '/': IconBooks,
  '/activity': IconActivity,
  '/ask': IconSparkles,
  '/settings': IconSettings
};

export const COMING_SOON_PATHS: string[] = ['/ask'];
