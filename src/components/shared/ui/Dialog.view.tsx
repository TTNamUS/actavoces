import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentChildren, JSX } from 'preact';

interface DialogProps {
  actions: ComponentChildren;
  children?: ComponentChildren;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export const Dialog = ({
  actions,
  children,
  onOpenChange,
  open,
  title
}: DialogProps): JSX.Element => (
  <BaseDialog.Root onOpenChange={onOpenChange} open={open}>
    <BaseDialog.Portal>
      <BaseDialog.Backdrop class='fixed inset-0 z-40 bg-ink/30' />
      <BaseDialog.Popup class='rise fixed top-1/2 left-1/2 z-50 flex w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-xl border border-line bg-canvas p-6 shadow-float outline-none'>
        <div class='flex flex-col gap-2'>
          <BaseDialog.Title class='font-serif text-[26px] leading-tight'>{title}</BaseDialog.Title>
          {children === undefined ? null : (
            <BaseDialog.Description render={<div />} class='text-ink-2'>
              {children}
            </BaseDialog.Description>
          )}
        </div>
        <div class='flex items-center justify-end gap-2'>{actions}</div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  </BaseDialog.Root>
);
