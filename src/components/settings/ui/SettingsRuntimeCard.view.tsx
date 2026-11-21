import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import { StatusBadge } from '../../shared/ui/StatusBadge.view';
import type { RuntimeInstallInfo } from '../hooks/settings.helpers';

interface SettingsRuntimeCardProps {
  actionLabel: string;
  description: string;
  disabled?: boolean;
  info: RuntimeInstallInfo;
  onInstall: () => void;
  title: string;
}

export const SettingsRuntimeCard = ({
  actionLabel,
  description,
  disabled = false,
  info,
  onInstall,
  title
}: SettingsRuntimeCardProps): JSX.Element => (
  <Card class='flex flex-col gap-4 p-5'>
    <div class='flex items-start justify-between gap-4'>
      <div class='flex flex-col gap-0.5'>
        <span class='font-medium text-sm'>{title}</span>
        <span class='text-[13px] text-ink-2'>{description}</span>
      </div>
      <StatusBadge label={info.badge.label} status={info.badge.status} />
    </div>
    {info.installing ? (
      <div class='flex flex-col gap-2'>
        <ProgressBar label={title} value={info.progress} />
        {info.step === null ? null : <span class='text-[12px] text-ink-3'>{info.step}</span>}
      </div>
    ) : null}
    {info.error === null ? null : <p class='text-[13px] text-ember'>{info.error}</p>}
    <div class='flex gap-2'>
      <Button
        disabled={disabled || info.installing || info.ready}
        onClick={onInstall}
        variant='primary'
      >
        {actionLabel}
      </Button>
    </div>
  </Card>
);
