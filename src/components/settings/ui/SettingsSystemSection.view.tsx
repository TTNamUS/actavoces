import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { useSettingsContext } from '../context/SettingsContext';

export const SettingsSystemSection = (): JSX.Element => {
  const { actions, data, status } = useSettingsContext();

  return (
    <div class='flex flex-col gap-8'>
      <section class='flex flex-col gap-3'>
        <SectionTitle>Runtime</SectionTitle>
        <Card class='px-5'>
          {data.runtime.rows.map((row) => (
            <SettingRow key={row.label} label={row.label}>
              <span class={row.mono ? 'font-mono text-[13px]' : 'text-sm'}>{row.value}</span>
            </SettingRow>
          ))}
          <SettingRow label='Worker health'>
            <Button disabled={status.loading} onClick={actions.checkWorker} variant='outline'>
              Check worker
            </Button>
          </SettingRow>
          {data.runtime.errors.map((error) => (
            <p class='my-3 rounded-lg bg-amber-soft p-3 text-[13px]' key={error}>
              {error}
            </p>
          ))}
        </Card>
      </section>

      <section class='flex flex-col gap-3'>
        <SectionTitle>Storage</SectionTitle>
        <Card class='px-5'>
          <SettingRow description={data.storage.outputDirectory} label='Records folder'>
            <Button onClick={data.storage.onOpenOutput} variant='outline'>
              Open
            </Button>
          </SettingRow>
          <SettingRow description={data.storage.modelStorageDirectory} label='Model folder'>
            <Button onClick={data.storage.onOpenModels} variant='outline'>
              Open
            </Button>
          </SettingRow>
          <SettingRow description={data.storage.databasePath} label='Database' />
        </Card>
      </section>

      <section class='flex flex-col gap-3'>
        <SectionTitle>Updates</SectionTitle>
        <Card class='px-5'>
          <SettingRow description={data.update.status} label={`ActaVoces v${data.appVersion}`}>
            <Button
              disabled={status.updateChecking || status.updateInstalling}
              onClick={actions.checkForUpdates}
              variant='outline'
            >
              Check
            </Button>
            <Button
              disabled={status.updateInstalling || !data.update.available}
              onClick={actions.installUpdate}
              variant='primary'
            >
              Install
            </Button>
          </SettingRow>
          <SettingRow label='Feedback'>
            <a
              class='text-ember text-sm underline underline-offset-2'
              href='https://insigh.to/b/actavoces'
              rel='noreferrer'
              target='_blank'
            >
              Suggest a feature
            </a>
          </SettingRow>
        </Card>
      </section>
    </div>
  );
};
