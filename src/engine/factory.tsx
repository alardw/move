import * as React from 'react';
import type {
  MoveComponentOptions,
  PassThrough,
  SetupContext,
  SetupReturn,
} from './types';
import { createCx, createPtm } from './mergeProps';
import { useMoveContext } from './context';
import { useMergedRef } from './useMergedRef';

// =============================================================================
// Move-specific prop keys to always strip from attrs
// =============================================================================

const MOVE_INTERNAL_KEYS = new Set(['pt']);

// =============================================================================
// withMoveComponent
// =============================================================================

/**
 * Factory function that creates a Move component with:
 * - React.forwardRef
 * - Default props merging
 * - Global PT + instance PT support
 * - CSS Module class resolution via cx()
 * - Pass-through merging via ptm()
 * - Ref merging (forwarded + internal)
 * - setup() → render() contract
 * - Sub-component attachment
 */
export function withMoveComponent<
  TSlots extends string,
  TProps extends Record<string, unknown>,
  TRef extends HTMLElement = HTMLElement,
  TSubs extends Record<string, React.ComponentType<any>> = Record<string, never>,
>(
  options: MoveComponentOptions<TSlots, TProps, TRef, TSubs>
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TProps & { pt?: PassThrough<TSlots> }> &
    React.RefAttributes<TRef>
> &
  TSubs {
  const {
    name,
    styles,
    defaults,
    moveProps = [],
    subComponents,
    setup,
  } = options;

  // Build the set of keys to strip from attrs
  const stripKeys = new Set<string>([
    ...MOVE_INTERNAL_KEYS,
    ...moveProps,
    ...(defaults ? Object.keys(defaults) : []),
  ]);

  const Component = React.forwardRef<TRef, TProps & { pt?: PassThrough<TSlots> }>(
    (incomingProps, forwardedRef) => {
      // 1. Merge defaults into props
      const props = { ...defaults, ...incomingProps } as TProps & {
        pt?: PassThrough<TSlots>;
      };

      // 2. Extract instance PT
      const instancePT = props.pt;

      // 3. Get global PT
      const { globalPT } = useMoveContext<TSlots>(name);

      // 4. Internal ref
      const internalRef = React.useRef<TRef | null>(null);
      const mergedRef = useMergedRef<TRef>(forwardedRef, internalRef);

      // 5. Build cx() and ptm()
      const cx = createCx<TSlots>(styles);
      const ptm = createPtm<TSlots>(globalPT, instancePT);

      // 6. Separate attrs from Move-specific props
      const attrs: Record<string, unknown> = {};
      for (const key of Object.keys(props)) {
        if (!stripKeys.has(key)) {
          attrs[key] = (props as Record<string, unknown>)[key];
        }
      }

      // 7. Build context
      const context: SetupContext<TSlots, TProps, TRef> = {
        props,
        ref: mergedRef,
        internalRef: internalRef as React.RefObject<TRef | null>,
        cx,
        ptm,
        attrs,
      };

      // 8. Call setup
      const result: SetupReturn = setup(context);

      // 9. Render
      return <>{result.render()}</>;
    }
  );

  Component.displayName = name;

  // 10. Attach sub-components
  if (subComponents) {
    for (const [key, value] of Object.entries(subComponents)) {
      (Component as any)[key] = value;
    }
  }

  return Component as any;
}
