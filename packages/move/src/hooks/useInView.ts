import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** Grow/shrink the viewport rect used for the test, e.g. `'200px'` starts
   *  reporting `inView` before the element scrolls fully into view. */
  rootMargin?: string;
  /** Fraction(s) of the element that must be visible to count. Default `0`. */
  threshold?: number | number[];
  /** Stop observing after the first time the element enters view. Default `true`. */
  once?: boolean;
}

export interface UseInViewReturn<T extends Element> {
  /** Attach to the element whose visibility you want to track. */
  ref: React.RefObject<T>;
  /** Whether the element is at/near the viewport per the options. */
  inView: boolean;
}

/**
 * Reports whether the referenced element is at (or near) the viewport, via
 * `IntersectionObserver`. The observer roots against the browser viewport, which
 * is correct even when the page scrolls inside a nested overflow container — the
 * element's viewport-relative rect still moves as you scroll.
 *
 * Where `IntersectionObserver` is unavailable (SSR, jsdom) it reports
 * `inView: true` so nothing gated on it is ever permanently hidden.
 *
 * Pair with `Deferred` to mount heavy subtrees only as they scroll into view.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): UseInViewReturn<T> {
  const { rootMargin = '0px', threshold = 0, once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (once && inView) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once, inView]);

  return { ref, inView };
}
