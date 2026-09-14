import * as React from 'react';

/**
 * Merges multiple refs (forwarded, internal, animation, etc.) into a single ref callback.
 *
 * The returned callback is STABLE for the life of the component, and reads the
 * current refs when it runs. A variadic dependency list cannot be written as an
 * array literal, and handing `refs` itself to `useCallback` made a new callback
 * on most renders — which React answers by detaching the node and reattaching
 * it, every render, for every component in the library.
 */
export function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  const latest = React.useRef(refs);
  latest.current = refs;

  return React.useCallback((node: T | null) => {
    for (const ref of latest.current) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  }, []);
}
