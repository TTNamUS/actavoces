export const formatDuration = (seconds: number | null): string => {
  if (seconds === null) {
    return 'In progress';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
};

const toTimestampValue = (value: string): number | string =>
  /^\d+$/.test(value) ? Number(value) * 1000 : value;

export const formatTimestamp = (value: string): string =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(toTimestampValue(value)));

export const timestampMs = (value: string): number => new Date(toTimestampValue(value)).getTime();

export const formatClock = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = (seconds % 60).toString().padStart(2, '0');

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${rest}`
    : `${minutes}:${rest}`;
};
