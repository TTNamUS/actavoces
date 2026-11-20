import type { JSX } from 'preact';
import { useAppContext } from '../components/app-shell/context/AppContext';
import { SetupRoute } from '../components/setup/ui/SetupRoute.view';

export const SetupPage = (): JSX.Element => <SetupRoute app={useAppContext()} />;
