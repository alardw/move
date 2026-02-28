import type { ReactNode } from 'react';

interface DemoLabelProps {
  children: ReactNode;
  disabled?: boolean;
  direction?: 'row' | 'column';
}

export function DemoLabel({ children, disabled, direction = 'row' }: DemoLabelProps) {
  const classes = [
    'demo-label-inline',
    disabled && 'demo-label-disabled',
    direction === 'column' && 'demo-label-column',
  ]
    .filter(Boolean)
    .join(' ');

  return <label className={classes}>{children}</label>;
}
