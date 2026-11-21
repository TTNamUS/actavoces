import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { PageHeader } from '../../shared/ui/PageHeader.view';
import { useSettingsContext } from '../context/SettingsContext';
import { SettingsAiSection } from './SettingsAiSection.view';
import { SettingsGeneralSection } from './SettingsGeneralSection.view';
import { SettingsNav } from './SettingsNav.view';
import { SettingsRecordingSection } from './SettingsRecordingSection.view';
import { SettingsSpeakersSection } from './SettingsSpeakersSection.view';
import { SettingsSystemSection } from './SettingsSystemSection.view';
import { SettingsTranscriptionSection } from './SettingsTranscriptionSection.view';

export const SettingsView = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <div class='mx-auto flex max-w-4xl flex-col gap-8 px-8 py-8'>
      <PageHeader
        actions={
          <Button disabled={!status.canSave} onClick={actions.save} variant='primary'>
            Save settings
          </Button>
        }
        subtitle='Everything stays on this computer.'
        title='Settings'
      />

      {data.validationErrors.length === 0 ? null : (
        <div class='flex flex-col gap-1 rounded-lg bg-amber-soft p-4 text-sm'>
          {data.validationErrors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </div>
      )}

      <div class='grid grid-cols-[180px_minmax(0,1fr)] items-start gap-8'>
        <SettingsNav items={data.nav} />
        <div class='min-w-0'>
          {data.section === 'general' ? <SettingsGeneralSection /> : null}
          {data.section === 'recording' ? <SettingsRecordingSection /> : null}
          {data.section === 'transcription' ? <SettingsTranscriptionSection /> : null}
          {data.section === 'speakers' ? <SettingsSpeakersSection /> : null}
          {data.section === 'ai' ? <SettingsAiSection /> : null}
          {data.section === 'system' ? <SettingsSystemSection /> : null}
        </div>
      </div>
    </div>
  );
};
