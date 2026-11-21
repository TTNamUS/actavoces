import type { JSX } from 'preact';
import { Button } from '../../shared/ui/Button.view';
import { ProgressBar } from '../../shared/ui/ProgressBar.view';
import { Toast } from '../../shared/ui/Toast.view';
import { ToastStack } from '../../shared/ui/ToastStack.view';
import type { ShellModel } from '../hooks/useShell.hook';

interface AppToastsProps {
  shell: ShellModel;
}

export const AppToasts = ({ shell }: AppToastsProps): JSX.Element => (
  <ToastStack>
    {shell.toasts.error === null ? null : (
      <Toast
        actions={
          <Button onClick={shell.actions.dismissError} size='sm' variant='ghost'>
            Dismiss
          </Button>
        }
        title='Something went wrong'
        tone='error'
      >
        {shell.toasts.error}
      </Toast>
    )}
    {shell.toasts.sortformer === null ? null : (
      <Toast
        title='Voice attribution setup'
        tone={shell.toasts.sortformer.status === 'failed' ? 'error' : 'default'}
      >
        <div class='flex flex-col gap-2'>
          <p>{shell.toasts.sortformer.error ?? shell.toasts.sortformer.step}</p>
          {shell.toasts.sortformer.progress === null ? null : (
            <ProgressBar
              tone={shell.toasts.sortformer.status === 'ready' ? 'moss' : 'amber'}
              value={shell.toasts.sortformer.progress}
            />
          )}
        </div>
      </Toast>
    )}
    {shell.toasts.unsavedSettings ? (
      <Toast
        actions={
          <>
            <Button
              disabled={shell.toasts.savingSettings}
              onClick={shell.actions.discardSettings}
              size='sm'
              variant='ghost'
            >
              Discard
            </Button>
            <Button
              disabled={shell.toasts.savingSettings}
              onClick={shell.actions.saveSettings}
              size='sm'
              variant='primary'
            >
              Save
            </Button>
          </>
        }
        title='Unsaved changes'
      >
        Settings have changes that are not saved yet.
      </Toast>
    ) : null}
    {shell.toasts.updateMessage === null ? null : (
      <Toast
        actions={
          <Button onClick={shell.actions.dismissUpdate} size='sm' variant='ghost'>
            Dismiss
          </Button>
        }
        title='Update check'
      >
        {shell.toasts.updateMessage}
      </Toast>
    )}
  </ToastStack>
);
