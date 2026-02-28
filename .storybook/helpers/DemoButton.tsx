import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface DemoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function DemoButton({ children, className, ...props }: DemoButtonProps) {
  const classes = ['demo-button-styled', className].filter(Boolean).join(' ');
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
