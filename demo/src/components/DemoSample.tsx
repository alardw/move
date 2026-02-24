import type { ReactNode } from 'react';

interface DemoSampleProps {
  label: string;
  children: ReactNode;
}

export function DemoSample({ label, children }: DemoSampleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--move-spacing-lg)' }}>
      <span
        style={{
          fontFamily: 'var(--move-font-body)',
          fontSize: 'var(--move-size-sm)',
          color: 'var(--move-fg-muted)',
          minWidth: '8rem',
          flexShrink: 0,
          lineHeight: 'var(--move-space-10)',
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
