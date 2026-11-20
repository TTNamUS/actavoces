import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';

interface RouteErrorProps {
  message: string;
  onRetry: () => void;
}

export const RouteError = ({ message, onRetry }: RouteErrorProps): JSX.Element => (
  <div class='mx-auto flex max-w-3xl flex-col gap-4 px-8 py-16'>
    <h1 class='font-serif text-[34px] leading-none'>This page hit a problem</h1>
    <pre class='select-text overflow-x-auto rounded-lg bg-canvas-2 p-4 font-mono text-[12px]'>
      {message}
    </pre>
    <div>
      <Button onClick={onRetry} variant='outline'>
        Try again
      </Button>
    </div>
  </div>
);
