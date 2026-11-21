import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { Input } from '../../shared/ui/Input.view';
import { Select } from '../../shared/ui/Select.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { useSettingsContext } from '../context/SettingsContext';

export const SettingsRecordingSection = (): JSX.Element => {
  const { data } = useSettingsContext();

  return (
    <Card class='px-5'>
      {data.captureFields.map((field) => (
        <SettingRow key={field.key} label={field.label}>
          <Select
            class='w-64'
            onValueChange={field.onValueChange}
            options={field.options}
            value={field.value}
          />
        </SettingRow>
      ))}
      {data.sampleRateField === null ? null : (
        <SettingRow description='In hertz.' label={data.sampleRateField.label}>
          <Input
            class='w-32 font-mono'
            min='1'
            onInput={data.sampleRateField.onInput}
            type='number'
            value={data.sampleRateField.value}
          />
        </SettingRow>
      )}
      {data.outputFolder === null ? null : (
        <SettingRow description={data.outputFolder.value} label={data.outputFolder.label}>
          <Button onClick={data.outputFolder.onSelect} variant='outline'>
            Choose
          </Button>
        </SettingRow>
      )}
    </Card>
  );
};
