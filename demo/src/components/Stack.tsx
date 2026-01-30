import type { ReactNode } from 'react';

interface StackProps {
  direction?: 'row' | 'column';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  flex?: number;
  className?: string;
  children: ReactNode;
}

export function Stack({
  direction = 'row',
  gap = 'md',
  align,
  justify,
  wrap,
  flex,
  className,
  children,
}: StackProps) {
  const classes = [
    'stack',
    `stack-${direction}`,
    `stack-gap-${gap}`,
    align && `stack-align-${align}`,
    justify && `stack-justify-${justify}`,
    wrap && 'stack-wrap',
    flex === 1 && 'stack-flex-1',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
