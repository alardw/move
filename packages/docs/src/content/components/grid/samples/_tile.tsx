import type { ReactNode } from 'react';

// Uniform neutral tile — a muted gray surface with base foreground (AA contrast
// in both themes). Filler only, so the Grid layout reads clearly.
export function Tile({ index, children }: { index: number; children?: ReactNode }) {
  return (
    // composite-purity-ignore: neutral filler tile (solid gray surface) so the Grid layout reads clearly; no Move colored-box primitive
    <div
      // composite-purity-ignore: neutral filler tile; no Move colored-box primitive
      style={{
        background: 'var(--move-gray-700)',
        color: 'var(--move-white)',
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
