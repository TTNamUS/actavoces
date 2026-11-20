import { IconCheck } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { SetupModel } from '../hooks/useSetup.hook';

interface SetupStepsProps {
  setup: SetupModel;
}

export const SetupSteps = ({ setup }: SetupStepsProps): JSX.Element => (
  <ol class='flex items-center gap-3'>
    {setup.data.stepLabels.map((label, index) => (
      <li class='flex items-center gap-2 text-[12px]' key={label}>
        <span
          class={clsx(
            'flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px]',
            setup.data.stepStates[index] === 'todo'
              ? 'bg-canvas-3 text-ink-3'
              : 'bg-ink text-canvas'
          )}
        >
          {setup.data.stepStates[index] === 'done' ? (
            <IconCheck aria-hidden='true' size={12} stroke={2.5} />
          ) : (
            index + 1
          )}
        </span>
        <span
          class={
            setup.data.stepStates[index] === 'active' ? 'font-semibold text-ink' : 'text-ink-3'
          }
        >
          {label}
        </span>
      </li>
    ))}
  </ol>
);
