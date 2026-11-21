import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { timestampMs } from '../../../utils/format';

export const useElapsedSeconds = (startedAt: string | null): number => {
  const now = useSignal(Date.now());

  useEffect(() => {
    if (startedAt === null) {
      return;
    }

    now.value = Date.now();
    const timer = window.setInterval(() => {
      now.value = Date.now();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [startedAt]);

  return startedAt === null
    ? 0
    : Math.max(0, Math.floor((now.value - timestampMs(startedAt)) / 1000));
};
