import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { SettingsFieldHint } from '../../settings/hooks/settings.helpers';

interface FieldHintProps {
  hint: SettingsFieldHint;
}

export const FieldHint = ({ hint }: FieldHintProps): JSX.Element => (
  <div
    class={clsx(
      'flex flex-col gap-1 rounded-lg p-3 text-[13px]',
      hint.tone === 'warning' ? 'bg-amber-soft text-ink' : 'bg-canvas-2 text-ink-2'
    )}
  >
    {hint.title ? <span class='font-semibold'>{hint.title}</span> : null}
    <span>{hint.text}</span>
    {hint.links ? (
      <span class='flex flex-wrap gap-3'>
        {hint.links.map((link) => (
          <a
            class='text-ember underline underline-offset-2'
            href={link.href}
            key={link.href}
            rel='noreferrer'
            target='_blank'
          >
            {link.label}
          </a>
        ))}
      </span>
    ) : null}
  </div>
);
