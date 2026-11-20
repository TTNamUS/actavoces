import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';

const SKIP_SECONDS = 10;

export const useAudioPlayer = (source: string | null) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const currentTime = useSignal(0);
  const duration = useSignal(0);
  const playing = useSignal(false);

  useEffect(() => {
    currentTime.value = 0;
    duration.value = 0;
    playing.value = false;

    if (source === null) {
      return;
    }

    const element = new Audio(source);
    const onTime = () => {
      currentTime.value = element.currentTime;
    };
    const onDuration = () => {
      duration.value = Number.isFinite(element.duration) ? element.duration : 0;
    };
    const onPlay = () => {
      playing.value = true;
    };
    const onPause = () => {
      playing.value = false;
    };

    element.preload = 'metadata';
    element.addEventListener('timeupdate', onTime);
    element.addEventListener('loadedmetadata', onDuration);
    element.addEventListener('durationchange', onDuration);
    element.addEventListener('play', onPlay);
    element.addEventListener('pause', onPause);
    element.addEventListener('ended', onPause);
    audio.current = element;

    return () => {
      element.pause();
      element.removeAttribute('src');
      element.load();
      audio.current = null;
    };
  }, [source]);

  const seek = (seconds: number) => {
    const element = audio.current;

    if (element === null) {
      return;
    }

    const limit = duration.value > 0 ? duration.value : seconds;

    element.currentTime = Math.min(Math.max(0, seconds), limit);
    currentTime.value = element.currentTime;
  };

  const toggle = () => {
    const element = audio.current;

    if (element === null) {
      return;
    }

    if (element.paused) {
      void element.play();
    } else {
      element.pause();
    }
  };

  return {
    available: source !== null,
    currentTime: currentTime.value,
    duration: duration.value,
    playing: playing.value,
    toggle,
    seek,
    skip: (delta: number) => seek(currentTime.value + delta * SKIP_SECONDS),
    playFrom: (seconds: number) => {
      seek(seconds);
      if (audio.current?.paused) {
        void audio.current.play();
      }
    }
  };
};
