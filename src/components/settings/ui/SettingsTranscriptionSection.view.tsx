import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { FieldHint } from '../../shared/ui/FieldHint.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { Select } from '../../shared/ui/Select.view';
import { SettingRow } from '../../shared/ui/SettingRow.view';
import { StatusBadge } from '../../shared/ui/StatusBadge.view';
import { useSettingsContext } from '../context/SettingsContext';
import { GlossaryEditor } from './GlossaryEditor.view';

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
        {data.modelFolder === null ? null : (
          <SettingRow description={data.modelFolder.value} label={data.modelFolder.label}>
            <Button onClick={data.modelFolder.onSelect} variant='outline'>
              Choose
            </Button>
          </SettingRow>
        )}
      </Card>

      <section class='flex flex-col gap-3'>
        <SectionTitle hint={data.model.recommendation.reason}>Model</SectionTitle>
        <Card class='flex flex-col gap-4 p-5'>
          <div class='flex items-center justify-between gap-4'>
            <div class='flex flex-col gap-0.5'>
              <span class='text-[13px] text-ink-3'>Selected</span>
              <span class='font-mono text-sm'>{data.model.name}</span>
            </div>
            <StatusBadge label={data.model.badge.label} status={data.model.badge.status} />
          </div>
          <p class='text-[13px] text-ink-2'>
            Recommended for this machine:{' '}
            <span class='font-mono'>{data.model.recommendation.recommendedModel}</span>
          </p>
          {data.model.recommendation.userOverridden ? (
            <FieldHint
              hint={{
                tone: 'warning',
                text: 'Manual override active. The selected model differs from the current recommendation.'
              }}
            />
          ) : null}
          <div class='flex gap-2'>
            <Button disabled={status.loading} onClick={actions.refreshModels} variant='outline'>
              Refresh models
            </Button>
            <Button
              disabled={status.installingModel || data.model.installed}
              onClick={actions.installModel}
              variant='primary'
            >
              Install selected
            </Button>
          </div>
          {data.model.inventory.length === 0 ? null : (
            <ul class='flex flex-col'>
              {data.model.inventory.map((model) => (
                <li
                  class='flex items-center justify-between gap-3 border-line border-t py-2 text-[13px]'
                  key={model.name}
                >
                  <span class='font-mono'>{model.name}</span>
                  <span class='text-ink-3'>{model.state}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <GlossaryEditor />
    </div>
  );
};
