import type { JSX } from 'preact';
import { useActivity } from '../hooks/useActivity.hook';
import { ActivityView } from '../ui/Activity.view';

export const ActivityContainer = (): JSX.Element => <ActivityView activity={useActivity()} />;
