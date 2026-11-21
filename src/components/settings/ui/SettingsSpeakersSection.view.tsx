import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { FieldHint } from '../../shared/ui/FieldHint.view';
import { Input } from '../../shared/ui/Input.view';
import { Select } from '../../shared/ui/Select.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { Switch } from '../../shared/ui/Switch.view';
import { useSettingsContext } from '../context/SettingsContext';
import { SettingsRuntimeCard } from './SettingsRuntimeCard.view';

export const SettingsSpeakersSection = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <div class='flex flex-col gap-6'>
      <Card class='px-5'>
        <SettingRow
          description='Detect who spoke when and label the transcript. Off by default to keep the app light.'
          label='Label speakers'
        >
          <Switch
            checked={data.toggles.speakersEnabled.checked}
            hideLabel
            onCheckedChange={data.toggles.speakersEnabled.onCheckedChange}
          >
            Enable speaker labels
          </Switch>
        </SettingRow>
      </Card>

      {data.toggles.speakersEnabled.checked ? (
        <>
          <SettingsRuntimeCard
            actionLabel={
              data.speakerLabels.backend === 'sortformer'
                ? 'Install speaker labels'
                : 'Install pyannote runtime'
            }
            description={
              data.speakerLabels.backend === 'sortformer'
                ? 'Sortformer ONNX model and ONNX Runtime. No Python needed.'
                : 'pyannote.audio on the local runtime. Install the local runtime first and add a Hugging Face token.'
            }
            disabled={
              status.setupRunning ||
              !data.speakerLabels.canInstall ||
              (data.usesPyannote && !data.huggingFaceToken.configured)
            }
            info={data.speakerLabels}
            onInstall={
              data.speakerLabels.backend === 'sortformer'
                ? actions.installSpeakerLabels
                : actions.installPyannote
            }
            onUninstall={actions.uninstallSpeakerLabels}
            title='Speaker label runtime'
            uninstallConfirm='Remove the speaker label model and ONNX Runtime? Existing transcripts are kept. You can reinstall any time.'
          />
          <Card class='px-5'>
            {data.diarizationField === null ? null : (
              <SettingRow
                footer={
                  data.diarizationField.hint ? (
                    <FieldHint hint={data.diarizationField.hint} />
                  ) : undefined
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
                description={
                  data.huggingFaceToken.configured ? 'Saved in local database' : 'Missing'
                }
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
        </>
      ) : null}
    </div>
  );
};
