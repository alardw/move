'use client';

import * as React from 'react';
import { Portal as RadixPortal } from 'radix-ui';
import styles from './Portal.module.css';

export interface PortalProps extends React.ComponentPropsWithoutRef<typeof RadixPortal.Root> {
  className?: string;
}

const Portal: React.FC<PortalProps> = ({ className, ...props }) => (
  <RadixPortal.Root {...props} />
);

Portal.displayName = 'Portal';

export { Portal };
