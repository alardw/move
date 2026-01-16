'use client';

import * as React from 'react';
import { VisuallyHidden as RadixVisuallyHidden } from 'radix-ui';

export interface VisuallyHiddenProps extends React.ComponentPropsWithoutRef<typeof RadixVisuallyHidden.Root> {}

const VisuallyHidden = React.forwardRef<
  React.ElementRef<typeof RadixVisuallyHidden.Root>,
  VisuallyHiddenProps
>((props, ref) => (
  <RadixVisuallyHidden.Root ref={ref} {...props} />
));

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
