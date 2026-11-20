import { clsx } from 'clsx';
import type { JSX } from 'preact';

interface AppLogoProps {
  class?: string;
}

export const AppLogo = ({ class: classProp }: AppLogoProps): JSX.Element => (
  <div
    aria-label='ActaVoces'
    class={clsx('flex shrink-0 items-center justify-center rounded-md bg-ink', classProp)}
    role='img'
  >
    <svg aria-hidden='true' class='h-1/2 w-1/2 text-ember' fill='currentColor' viewBox='0 0 16 16'>
      <circle cx='8' cy='8' r='5' />
    </svg>
  </div>
);
