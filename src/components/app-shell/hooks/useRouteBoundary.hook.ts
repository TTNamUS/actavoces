import { useErrorBoundary } from 'preact/hooks';
import { diagnosticsMessage } from './appRuntime.helpers';

export const useRouteBoundary = () => {
  const [error, resetError] = useErrorBoundary();

  return {
    message: error === undefined ? null : diagnosticsMessage(error),
    onRetry: resetError
  };
};
