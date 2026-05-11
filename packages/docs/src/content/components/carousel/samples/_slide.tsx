// Shared slide visual for the Carousel docs samples — a coloured tile
// with a number, sized to fit the preview frame on every viewport.

import type { ReactNode } from 'react';

const palette = ['blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'red', 'pink', 'grape', 'violet', 'indigo'];

export function SlideTile({ index, label, height = 200 }: { index: number; label?: ReactNode; height?: number }) {
  const color = palette[index % palette.length];
  return (
    <div
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `var(--move-${color}-100)`,
        color: `var(--move-${color}-900)`,
        borderRadius: 'var(--move-rounded-md)',
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      {label ?? `Slide ${index + 1}`}
    </div>
  );
}
