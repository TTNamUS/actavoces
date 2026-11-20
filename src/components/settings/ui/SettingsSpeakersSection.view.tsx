import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { FieldHint } from '../../shared/ui/FieldHint.view';
import { Input } from '../../shared/ui/Input.view';
import { Select } from '../../shared/ui/Select.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { useSettingsContext } from '../context/SettingsContext';

export const SettingsSpeakersSection = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <Card class='px-5'>
      {data.diarizationField === null ? null : (
        <SettingRow
          footer={
            data.diarizationField.hint ? <FieldHint hint={data.diarizationField.hint} /> : undefined
          }
          label={data.diarizationField.label}
        >
          <Select
            class='w-48'
            onValueChange={data.diarizationField.onValueChange}
            options={data.diarizationField.options}
            value={data.diarizationField.value}
          />
        </SettingRow>
      )}
      <SettingRow label={data.speakerCountField.label}>
        <Select
          class='w-48'
          onValueChange={data.speakerCountField.onValueChange}
          options={data.speakerCountField.options}
          value={data.speakerCountField.value}
        />
      </SettingRow>
      {data.speakerNumberFields.map((field) => (
        <SettingRow key={field.key} label={field.label}>
          <Input
            class='w-24 font-mono'
            min='0'
            onInput={field.onInput}
            type='number'
            value={field.value}
          />
        </SettingRow>
      ))}
      {data.usesPyannote ? (
        <SettingRow
          description={data.huggingFaceToken.configured ? 'Saved in local database' : 'Missing'}
          label={data.huggingFaceToken.field.label}
        >
          <Input
            class='w-64'
            onInput={data.huggingFaceToken.field.onInput}
            type='password'
            value={data.huggingFaceToken.field.value}
          />
          <Button
            disabled={status.saving || !data.huggingFaceToken.configured}
            onClick={actions.clearHuggingFaceToken}
            variant='ghost'
          >
            Clear
          </Button>
        </SettingRow>
      ) : null}
    </Card>
  );
};
