import type { JSX } from 'preact';
import { Button } from './Button.view';
import { Dialog } from './Dialog.view';

interface ConfirmDeleteDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  title: string | null;
}

export const ConfirmDeleteDialog = ({
  onCancel,
  onConfirm,
  title
}: ConfirmDeleteDialogProps): JSX.Element => (
  <Dialog
    actions={
      <>
        <Button onClick={onCancel} variant='ghost'>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant='ember'>
          Delete
        </Button>
      </>
    }
    onOpenChange={onCancel}
    open={title !== null}
    title='Delete this recording?'
  >
    {title ?? ''} and all of its files on this computer will be permanently removed.
  </Dialog>
);
