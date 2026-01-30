'use client';

import * as React from 'react';
import { Slot as RadixSlot } from 'radix-ui';

export interface SlotProps extends React.ComponentPropsWithoutRef<typeof RadixSlot.Root> {}

const Slot = React.forwardRef<
  React.ElementRef<typeof RadixSlot.Root>,
  SlotProps
>((props, ref) => (
  <RadixSlot.Root ref={ref} {...props} />
));

Slot.displayName = 'Slot';

export interface SlottableProps extends React.ComponentPropsWithoutRef<typeof RadixSlot.Slottable> {}

const Slottable: React.FC<SlottableProps> = (props) => (
  <RadixSlot.Slottable {...props} />
);
Slottable.displayName = 'Slottable';

export { Slot, Slottable };
