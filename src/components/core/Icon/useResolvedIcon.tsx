'use client';

import * as React from 'react';
import { useIconContext } from './IconProvider';
import { BUILTIN_ICONS } from './builtinIcons';

/**
 * Resolves an icon name via IconProvider, falling back to built-in essential
 * SVGs when the provider doesn't resolve the name (or isn't present at all).
 *
 * @example
 * ```tsx
 * const resolved = useResolvedIcon('check', 14);
 * // In render — always returns something for essential icons:
 * {resolved || <svg>…ultimate fallback…</svg>}
 * ```
 */
export function useResolvedIcon(name: string, size: number): React.ReactNode | null {
  const context = useIconContext();

  if (context) {
    const resolved = context.resolver(name);

    if (resolved) {
      // Function component or class component
      if (typeof resolved === 'function') {
        const Comp = resolved as React.ComponentType<any>;
        return <Comp width={size} height={size} color="currentColor" aria-hidden="true" />;
      }

      // forwardRef / memo — these are objects with $$typeof AND a render/type function
      if (
        typeof resolved === 'object' &&
        resolved !== null &&
        '$$typeof' in resolved &&
        ('render' in resolved || 'type' in resolved)
      ) {
        const Comp = resolved as unknown as React.ComponentType<any>;
        return <Comp width={size} height={size} color="currentColor" aria-hidden="true" />;
      }

      // Already a React element or other renderable node
      return resolved as React.ReactNode;
    }
  }

  // Fall back to built-in essential icons
  const Builtin = BUILTIN_ICONS[name];
  if (Builtin) {
    return <Builtin width={size} height={size} />;
  }

  return null;
}
