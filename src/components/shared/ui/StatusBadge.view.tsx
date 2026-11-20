import type { JSX } from 'preact';
import { type AnyStatus, statusInfo } from '../../../utils/status';
import { Badge } from './Badge.view';

interface StatusBadgeProps {
  label?: string;
  status: AnyStatus;
}

export const StatusBadge = ({ label, status }: StatusBadgeProps): JSX.Element => {
  const info = statusInfo(status);
  const text = status === 'needsSetup' ? info.label : (label ?? info.label);

  return (
    <Badge pulse={status === 'recording'} tone={info.tone}>
      {text}
    </Badge>
  );
};
