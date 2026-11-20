import type { ComponentChildren } from 'preact';
import { useRouteBoundary } from '../hooks/useRouteBoundary.hook';
import { RouteError } from '../ui/RouteError.view';

interface RouteBoundaryContainerProps {
  children: ComponentChildren;
}

export const RouteBoundaryContainer = ({
  children
}: RouteBoundaryContainerProps): ComponentChildren => {
  const boundary = useRouteBoundary();

  return boundary.message === null ? (
    children
  ) : (
    <RouteError message={boundary.message} onRetry={boundary.onRetry} />
  );
};
