import type { ReactNode } from 'react';

interface TextProps {
  variant?: 'base' | 'muted' | 'subtle';
  size?: 'xs' | 'sm' | 'base' | 'lg';
  as?: 'p' | 'span' | 'label';
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export function Text({
  variant = 'base',
  size = 'base',
  as: Tag = 'p',
  className,
  style,
  children,
}: TextProps) {
  const classes = [
    'text',
    `text-${variant}`,
    `text-${size === 'base' ? 'base-size' : size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes} style={style}>{children}</Tag>;
}
