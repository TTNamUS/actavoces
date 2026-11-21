import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { Input } from '../../shared/ui/Input.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { useSettingsContext } from '../context/SettingsContext';

export const SettingsCloudFields = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <Card class='px-5'>
      {data.cloudFields.map((field) => (
        <SettingRow
          description={
            field.key === 'transcriptionCloudApiKey'
              ? data.cloudApiKeyConfigured
                ? 'Saved in local database'
                : 'Not set'
              : undefined
          }
          key={field.key}
          label={field.label}
        >
          <Input
            class='w-72'
            onInput={field.onInput}
            type={field.inputType ?? 'text'}
            value={field.value}
          />
          {field.key === 'transcriptionCloudApiKey' ? (
            <Button
              disabled={status.saving || !data.cloudApiKeyConfigured}
              onClick={actions.clearCloudApiKey}
              variant='ghost'
            >
              Clear
            </Button>
          ) : null}
        </SettingRow>
      ))}
    </Card>
  );
};
