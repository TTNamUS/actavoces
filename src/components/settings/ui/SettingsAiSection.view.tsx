import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { Input } from '../../shared/ui/Input.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { Switch } from '../../shared/ui/Switch.view';
import { Textarea } from '../../shared/ui/Textarea.view';
import { useSettingsContext } from '../context/SettingsContext';

export const SettingsAiSection = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <div class='flex flex-col gap-6'>
      <Card class='px-5'>
        <SettingRow
          description='Summaries are generated after transcription using the provider below.'
          label='Generate summaries'
        >
          <Switch
            checked={data.toggles.summaryEnabled.checked}
            hideLabel
            onCheckedChange={data.toggles.summaryEnabled.onCheckedChange}
          >
            Enable summary generation
          </Switch>
        </SettingRow>
        {data.providerFields.map((field) => (
          <SettingRow
            description={
              field.key === 'providerApiKey'
                ? data.apiKeyConfigured
                  ? 'Saved in local database'
                  : 'Missing'
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
            {field.key === 'providerApiKey' ? (
              <Button
                disabled={status.saving || !data.apiKeyConfigured}
                onClick={actions.clearProviderApiKey}
                variant='ghost'
              >
                Clear
              </Button>
            ) : null}
          </SettingRow>
        ))}
      </Card>
      {data.promptFields.map((field) => (
        <Card class='flex flex-col gap-2 p-5' key={field.key}>
          <label class='font-medium text-sm' for={field.key}>
            {field.label}
          </label>
          <Textarea
            class='min-h-32 resize-y'
            id={field.key}
            onInput={field.onInput}
            value={field.value}
          />
        </Card>
      ))}
    </div>
  );
};
