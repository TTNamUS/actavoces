import type { JSX } from 'preact';
import { Redirect, Route, Switch } from 'wouter-preact';
import { ActivityPage } from '../pages/ActivityPage';
import { AskPage } from '../pages/AskPage';
import { LibraryPage } from '../pages/LibraryPage';
import { RecordingDetailPage } from '../pages/RecordingDetailPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes = (): JSX.Element => (
  <Switch>
    <Route path='/'>
      <LibraryPage />
    </Route>
    <Route path='/recordings/:id'>{(params) => <RecordingDetailPage id={params.id} />}</Route>
    <Route path='/activity'>
      <ActivityPage />
    </Route>
    <Route path='/ask'>
      <AskPage />
    </Route>
    <Route path='/settings/:section?'>
      {(params) => <SettingsPage section={params.section} />}
    </Route>
    <Route>
      <Redirect replace to='/' />
    </Route>
  </Switch>
);
