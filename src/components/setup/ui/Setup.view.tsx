import type { JSX } from 'preact';
import { AppLogo } from '../../shared/ui/AppLogo.view';
import { Button } from '../../shared/ui/Button.view';
import { Field } from '../../shared/ui/Field.view';
import { Input } from '../../shared/ui/Input.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import type { SetupModel } from '../hooks/useSetup.hook';
import { SetupSteps } from './SetupSteps.view';

interface SetupViewProps {
  setup: SetupModel;
}

export const SetupView = ({ setup }: SetupViewProps): JSX.Element => (
  <main class='flex min-h-screen items-center justify-center bg-canvas p-6 text-ink'>
    <div class='grain' />
    <section class='rise flex w-full max-w-xl flex-col gap-7 rounded-xl border border-line bg-canvas p-8 shadow-card'>
      <div class='flex items-center justify-between gap-4'>
        <div class='flex items-center gap-3'>
          <AppLogo class='h-9 w-9' />
          <span class='font-serif text-[24px] leading-none'>ActaVoces</span>
        </div>
        <SetupSteps setup={setup} />
      </div>

      <div class='flex flex-col gap-3'>
        <h1 class='font-serif text-[40px] leading-none tracking-tight'>{setup.data.title}</h1>
        <p class='text-ink-2'>{setup.data.body}</p>
      </div>

      {setup.status.needsDiarization ? (
        <div class='flex flex-col gap-4 rounded-lg bg-canvas-2 p-4'>
          <p class='flex flex-wrap gap-4 text-[13px]'>
            <a
              class='text-ember underline underline-offset-2'
              href='https://huggingface.co/pyannote/speaker-diarization-community-1'
              rel='noreferrer'
              target='_blank'
            >
              Accept model terms
            </a>
            <a
              class='text-ember underline underline-offset-2'
              href='https://huggingface.co/settings/tokens'
              rel='noreferrer'
              target='_blank'
            >
              Create a token
            </a>
          </p>
          <Field>
            <Field.Label>{setup.data.token.label}</Field.Label>
            <Input
              onInput={setup.data.token.onInput}
              type='password'
              value={setup.data.token.value}
            />
          </Field>
        </div>
      ) : (
        <div class='flex flex-col gap-2'>
          <ProgressBar label='Setup progress' tone={setup.data.tone} value={setup.data.progress} />
          <p class='font-mono text-[12px] text-ink-3 uppercase'>{setup.data.statusLabel}</p>
        </div>
      )}

      {setup.data.error ? (
        <p class='select-text whitespace-pre-wrap break-all rounded-lg bg-ember-soft p-4 text-[13px] text-ember-2'>
          {setup.data.error}
        </p>
      ) : null}

      {setup.status.needsDiarization ? (
        <div class='flex justify-end gap-2'>
          <Button
            disabled={setup.status.running}
            onClick={setup.actions.skipDiarization}
            variant='ghost'
          >
            Skip for now
          </Button>
          <Button
            disabled={setup.status.running}
            onClick={setup.actions.setupDiarization}
            variant='primary'
          >
            Set up diarization
          </Button>
        </div>
      ) : null}
      {setup.status.canRetry ? (
        <div class='flex justify-end'>
          <Button disabled={setup.status.running} onClick={setup.actions.retry} variant='primary'>
            Retry
          </Button>
        </div>
      ) : null}
    </section>
  </main>
);
