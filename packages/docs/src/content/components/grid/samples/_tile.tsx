import type { ReactNode } from 'react';

const palette = ['blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'red', 'pink', 'grape', 'violet', 'indigo'];

export function Tile({ index, children }: { index: number; children?: ReactNode }) {
  const c = palette[index % palette.length];
  return (
    <div
      style={{
        background: `var(--move-${c}-100)`,
        color: `var(--move-${c}-900)`,
        padding: 'var(--move-spacing-md)',
        borderRadius: 'var(--move-rounded-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
        fontWeight: 600,
      }}
    >
      {children ?? index + 1}
    </div>
  );
}
