import { describe, expect, it } from 'vitest';
import {
  isRouteActive,
  isSettingsLocation,
  navRoutes,
  recordingPath,
  settingsPath
} from '../utils/routes';

describe('routes', () => {
  it('exposes the primary app routes in nav order', () => {
    expect(navRoutes.map((route) => route.path)).toEqual([
      '/',
      '/activity',
      '/ask',
      '/settings',
      '/overview'
    ]);
  });

  it('keeps Library active on recording detail pages only', () => {
    expect(isRouteActive('/', '/')).toBe(true);
    expect(isRouteActive('/', '/recordings/abc')).toBe(true);
    expect(isRouteActive('/', '/activity')).toBe(false);
  });

  it('matches settings sections', () => {
    expect(isRouteActive('/settings', '/settings/system')).toBe(true);
    expect(isRouteActive('/settings', '/settingsx')).toBe(false);
    expect(isSettingsLocation('/settings')).toBe(true);
    expect(isSettingsLocation('/settings/ai')).toBe(true);
    expect(isSettingsLocation('/activity')).toBe(false);
  });

  it('builds paths', () => {
    expect(recordingPath('a b')).toBe('/recordings/a%20b');
    expect(settingsPath()).toBe('/settings');
    expect(settingsPath('ai')).toBe('/settings/ai');
  });
});
