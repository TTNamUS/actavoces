import type { ComponentChildren, JSX } from 'preact';

interface ToastStackProps {
  children: ComponentChildren;
}

export const ToastStack = ({ children }: ToastStackProps): JSX.Element => (
  <div class='pointer-events-none fixed right-4 bottom-4 z-40 flex w-[360px] flex-col gap-3 [&>*]:pointer-events-auto'>
    {children}
  </div>
);
