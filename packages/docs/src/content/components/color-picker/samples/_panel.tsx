import type { ReactNode } from 'react';

const panel: React.CSSProperties = {
  padding: 'var(--move-spacing-md)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-lg)',
  background: 'var(--move-surface-bg)',
  display: 'inline-block',
};

/**
 * Tiny wrapper used by the ColorPicker docs samples — gives the chromeless
 * picker a visible frame so each sample reads as a self-contained widget.
 */
export function PickerPanel({ children }: { children: ReactNode }) {
  return <div style={panel}>{children}</div>;
}
