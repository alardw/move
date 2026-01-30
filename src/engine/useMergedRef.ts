import * as React from 'react';

/**
 * Merges multiple refs (forwarded, internal, animation, etc.) into a single ref callback.
 */
export function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
