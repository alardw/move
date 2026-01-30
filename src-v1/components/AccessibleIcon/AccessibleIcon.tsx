'use client';

import * as React from 'react';
import { AccessibleIcon as RadixAccessibleIcon } from 'radix-ui';

export interface AccessibleIconProps extends React.ComponentPropsWithoutRef<typeof RadixAccessibleIcon.Root> {}

const AccessibleIcon: React.FC<AccessibleIconProps> = (props) => (
  <RadixAccessibleIcon.Root {...props} />
);

AccessibleIcon.displayName = 'AccessibleIcon';

export { AccessibleIcon };
