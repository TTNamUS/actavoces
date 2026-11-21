import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { Select } from '../../shared/ui/Select.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { Switch } from '../../shared/ui/Switch.view';
import { useSettingsContext } from '../context/SettingsContext';

export const SettingsGeneralSection = (): JSX.Element => {
  const { data } = useSettingsContext();

  return (
    <Card class='px-5'>
      <SettingRow description='Follows your system unless you pick one.' label='Appearance'>
        <Select
          class='w-48'
          onValueChange={data.theme.onChange}
          options={data.theme.options}
          value={data.theme.value}
        />
      </SettingRow>
      <SettingRow description='Start or stop recording from anywhere.' label={data.hotkey.label}>
        <Button class='font-mono' onClick={data.hotkey.onCapture} variant='outline'>
          {data.hotkey.recording ? 'Press shortcut…' : data.hotkey.displayValue}
        </Button>
      </SettingRow>
      {data.statusWindowFields.map((field) => (
        <SettingRow key={field.key} label={field.label}>
          <Select
            class='w-48'
            onValueChange={field.onValueChange}
            options={field.options}
            value={field.value}
          />
        </SettingRow>
      ))}
      <SettingRow
        description='Keep ActaVoces running when the window is closed.'
        label='Close to tray'
      >
        <Switch
          checked={data.toggles.closeToTray.checked}
          hideLabel
          onCheckedChange={data.toggles.closeToTray.onCheckedChange}
        >
          Close to tray
        </Switch>
      </SettingRow>
      <SettingRow label='Launch at login'>
        <Switch
          checked={data.toggles.launchAtLogin.checked}
          hideLabel
          onCheckedChange={data.toggles.launchAtLogin.onCheckedChange}
        >
          Launch at login
        </Switch>
      </SettingRow>
    </Card>
  );
};
