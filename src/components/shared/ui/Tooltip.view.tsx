import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentChildren, JSX } from 'preact';

interface TooltipProps {
  children: ComponentChildren;
  label: string;
}

export const Tooltip = ({ children, label }: TooltipProps): JSX.Element => (
  <BaseTooltip.Provider>
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={<span class='inline-flex' />}>{children}</BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={6}>
          <BaseTooltip.Popup class='rounded-md bg-ink px-2 py-1 text-[12px] text-canvas shadow-float'>
            {label}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  </BaseTooltip.Provider>
);
