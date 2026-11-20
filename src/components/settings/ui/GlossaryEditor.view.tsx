import { IconX } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { Card } from '../../shared/ui/Card.view';
import { Input } from '../../shared/ui/Input.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import { useSettingsContext } from '../context/SettingsContext';

export const GlossaryEditor = (): JSX.Element => {
  const { data } = useSettingsContext();

  return (
    <section class='flex flex-col gap-3'>
      <SectionTitle hint={data.glossary.hint}>{data.glossary.label}</SectionTitle>
      <Card class='flex flex-col gap-4 p-5'>
        <div class='flex gap-2'>
          <Input
            aria-label={data.glossary.label}
            class='min-w-0 flex-1'
            onInput={data.glossary.onInput}
            onKeyDown={data.glossary.onKeyDown}
            placeholder={data.glossary.placeholder}
            value={data.glossary.value}
          />
          <Button onClick={data.glossary.onAdd} variant='outline'>
            Add
          </Button>
        </div>
        {data.glossary.entries.length === 0 ? null : (
          <ul class='flex flex-wrap gap-2'>
            {data.glossary.entries.map((entry) => (
              <li
                class='flex items-center gap-1 rounded-full border border-line bg-canvas-2 py-0.5 pr-1 pl-3 text-[13px]'
                key={entry.value}
              >
                {entry.value}
                <Button
                  aria-label={`Remove ${entry.value}`}
                  onClick={entry.onRemove}
                  size='iconSm'
                  variant='ghost'
                >
                  <IconX aria-hidden='true' size={14} stroke={1.75} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
};
