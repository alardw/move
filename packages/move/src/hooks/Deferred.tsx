'use client';
import * as React from 'react';
import { useInView } from './useInView';

/**
 * The wrapper's element. A `<div>` is right most of the time and invalid in
 * exactly the places deferral pays off most: a long list defers its rows, and a
 * `<div>` between `<ul>` and `<li>` is invalid HTML that also strips the list
 * semantics — the same defect class as a `<nav>` nested in a `<nav>`.
 */
export type DeferredAs = 'div' | 'span' | 'li' | 'section' | 'article' | 'figure' | 'tr';

export interface DeferredProps {
  children: React.ReactNode;
  /** Element to render as. Default `'div'`. */
  as?: DeferredAs;
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
 *
 * The wrapper is unavoidable — something has to be in the DOM for the observer
 * to watch, and the children are by definition not there yet — which is why this
 * takes `as` rather than the `asChild` the rest of the library uses. `asChild`
 * merges onto the caller's child, and here that child is the very thing being
 * withheld. What CAN be fixed is assuming which element the wrapper is.
 */
export function Deferred({
  children,
  as: Component = 'div',
  placeholder = null,
  rootMargin = '200px',
  className,
  style,
}: DeferredProps) {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin, once: true });
  return (
    <Component ref={ref as React.Ref<never>} className={className} style={style}>
      {inView ? children : placeholder}
    </Component>
  );
}
