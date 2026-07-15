import * as React from 'react';
import type { CSSProperties } from 'react';
import type { Truncate } from './types';

type Mode = 'end' | 'start' | 'clamp' | 'middle';

/** How many trailing chars `middle` keeps visible: everything after the last
 *  path separator (a filename), else a short fixed suffix (hashes / ids). */
function defaultTailLen(s: string): number {
  const sep = Math.max(s.lastIndexOf('/'), s.lastIndexOf('\\'));
  if (sep >= 0 && sep < s.length - 1) return s.length - sep - 1;
  return Math.min(8, s.length);
}

/**
 * Resolves the `truncate` / `lines` props into what a text primitive needs to
 * render: the normalized `data-truncate` mode (`true` → `'end'`), an optional
 * inline style (line-clamp count), and the children to render.
 *
 * For `middle` it splits string children into a clipped head + a pinned tail
 * span (the two-span flex trick — pure CSS, no measurement); other modes pass
 * children through unchanged. `middle` on non-string children degrades to `end`.
 * Shared by every text primitive so the wiring stays identical.
 */
export function resolveTruncate(
  truncate: Truncate | undefined,
  lines: number | undefined,
  children: React.ReactNode,
): { mode?: Mode; style?: CSSProperties; content: React.ReactNode } {
  if (!truncate) return { content: children };
  let mode: Mode = truncate === true ? 'end' : truncate;

  if (mode === 'middle') {
    if (typeof children !== 'string') {
      mode = 'end'; // nothing to split — degrade gracefully
    } else {
      const s = children;
      const n = defaultTailLen(s);
      if (s.length <= n) return { content: s }; // too short to truncate
      return {
        mode,
        content: (
          <>
            <span data-truncate-head="">{s.slice(0, s.length - n)}</span>
            <span data-truncate-tail="">{s.slice(s.length - n)}</span>
          </>
        ),
      };
    }
  }

  const style =
    mode === 'clamp' && lines ? ({ '--move-line-clamp': lines } as CSSProperties) : undefined;
  return { mode, ...(style ? { style } : {}), content: children };
}
