export interface NavRoute {
  path: string;
  label: string;
}

export const LIBRARY_PATH = '/';
export const ACTIVITY_PATH = '/activity';
export const ASK_PATH = '/ask';
export const SETTINGS_PATH = '/settings';
export const SETUP_PATH = '/setup';
export const OVERVIEW_PATH = '/overview';

export const navRoutes: NavRoute[] = [
  { path: LIBRARY_PATH, label: 'Library' },
  { path: ACTIVITY_PATH, label: 'Activity' },
  { path: ASK_PATH, label: 'Ask' },
  { path: SETTINGS_PATH, label: 'Settings' },
  { path: OVERVIEW_PATH, label: 'Overview' }
];

export const recordingPath = (id: string): string => `/recordings/${encodeURIComponent(id)}`;

export const settingsPath = (section?: string): string =>
  section === undefined ? SETTINGS_PATH : `${SETTINGS_PATH}/${section}`;

export const isSettingsLocation = (location: string): boolean =>
  location === SETTINGS_PATH || location.startsWith(`${SETTINGS_PATH}/`);

export const isRouteActive = (path: string, location: string): boolean => {
  if (path === LIBRARY_PATH) {
    return location === LIBRARY_PATH || location.startsWith('/recordings/');
  }

  return location === path || location.startsWith(`${path}/`);
};
