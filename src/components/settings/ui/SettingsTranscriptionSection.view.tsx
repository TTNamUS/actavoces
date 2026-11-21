import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { FieldHint } from '../../shared/ui/FieldHint.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { Select } from '../../shared/ui/Select.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { useSettingsContext } from '../context/SettingsContext';
import { GlossaryEditor } from './GlossaryEditor.view';
import { SettingsCloudFields } from './SettingsCloudFields.view';
import { SettingsLocalModel } from './SettingsLocalModel.view';
import { SettingsRuntimeCard } from './SettingsRuntimeCard.view';

export const SettingsTranscriptionSection = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <div class='flex flex-col gap-8'>
      <Card class='px-5'>
        {data.transcriptionFields.map((field) => (
          <SettingRow
            footer={field.hint ? <FieldHint hint={field.hint} /> : undefined}
            key={field.key}
            label={field.label}
          >
            <Select
              class='w-56'
              onValueChange={field.onValueChange}
              options={field.options}
              value={field.value}
            />
          </SettingRow>
        ))}
        {data.engine === 'local' && data.modelFolder !== null ? (
          <SettingRow description={data.modelFolder.value} label={data.modelFolder.label}>
            <Button onClick={data.modelFolder.onSelect} variant='outline'>
              Choose
            </Button>
          </SettingRow>
        ) : null}
      </Card>

      {data.engine === 'cloud' ? (
        <section class='flex flex-col gap-3'>
          <SectionTitle>Cloud provider</SectionTitle>
          <SettingsCloudFields />
        </section>
      ) : null}

      {data.engine === 'local' ? (
        <>
          <section class='flex flex-col gap-3'>
            <SectionTitle>Local runtime</SectionTitle>
            <SettingsRuntimeCard
              actionLabel='Install local runtime'
              description='Python, faster-whisper and the selected model. Downloads several hundred MB.'
              disabled={status.setupRunning}
              info={data.localRuntime}
              onInstall={actions.installLocalRuntime}
              onUninstall={actions.uninstallLocalRuntime}
              title='Local transcription runtime'
              uninstallConfirm='Remove the local runtime and downloaded Whisper models? Recordings and transcripts are kept. You can reinstall any time.'
            />
          </section>
          <SettingsLocalModel />
        </>
      ) : null}

      {data.engine === 'none' ? null : <GlossaryEditor />}
    </div>
  );
};
