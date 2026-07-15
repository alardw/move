'use client';
import * as React from 'react';
import { useInView } from './useInView';

export interface DeferredProps {
  children: React.ReactNode;
  /** Rendered until the children mount. Defaults to nothing (empty space). */
  placeholder?: React.ReactNode;
  /** How far outside the viewport to start mounting. Default `'200px'`. */
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Mounts `children` only once the wrapper scrolls near the viewport, so a page
 * full of heavy subtrees (live previews, charts, embeds, media) doesn't build
 * all of them synchronously on load — it builds the handful that are visible and
 * the rest as they're scrolled toward. That synchronous mount storm is what
 * starves neighbouring animations and stalls first paint.
 *
 * Deferral changes semantics — the children are genuinely absent until revealed
 * (no effects, no measurements, invisible to find-in-page) — so it is always an
 * explicit opt-in wrapper, never automatic. Reserve space on the wrapper (via
 * `style`/`className`) or a fixed-size ancestor so mounting doesn't shift layout.
 */
export function Deferred({
  children,
  placeholder = null,
  rootMargin = '200px',
  className,
  style,
}: DeferredProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin, once: true });
  return (
    <div ref={ref} className={className} style={style}>
      {inView ? children : placeholder}
    </div>
  );
}
