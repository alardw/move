import * as React from 'react';
import type {
  MoveComponentOptions,
  SlotProps,
  SlotPropsMap,
  SetupContext,
  SetupReturn,
} from './types';
import { createCx, createSp } from './slotUtils';
import { useMoveContext } from './context';
import { useMergedRef } from './useMergedRef';

// =============================================================================
// Move-specific prop keys to always strip from attrs
// =============================================================================

const MOVE_INTERNAL_KEYS = new Set(['sp']);

// =============================================================================
// withMoveComponent
// =============================================================================

/**
 * Factory function that creates a Move component with:
 * - React.forwardRef
 * - Default props merging
 * - Global + instance slot-props support
 * - CSS Module class resolution via cx()
 * - Slot-props merging via sp()
 * - Ref merging (forwarded + internal)
 * - setup() → render() contract
 * - Sub-component attachment
 */
export function withMoveComponent<
  TSlots extends string,
  TProps extends object,
  TRef extends Element = HTMLElement,
  TSubs extends Record<string, React.ComponentType<any>> = Record<string, never>,
>(
  options: MoveComponentOptions<TSlots, TProps, TRef, TSubs>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TProps & { sp?: SlotPropsMap<TSlots> }> & React.RefAttributes<TRef>
> &
  TSubs {
  const { name, styles, defaults, moveProps = [], subComponents, setup } = options;

  // Build the set of keys to strip from attrs
  const stripKeys = new Set<string>([
    ...MOVE_INTERNAL_KEYS,
    ...moveProps,
    ...(defaults ? Object.keys(defaults) : []),
  ]);

  const Component = React.forwardRef<TRef, TProps & { sp?: SlotPropsMap<TSlots> }>(
    (incomingProps, forwardedRef) => {
      // 1. Merge defaults into props.
      //
      // `undefined` means two different things depending on whether the prop has
      // a default, and collapsing them broke ~44 overlays:
      //
      //   HAS a default    → `variant={undefined}` means "I'm not choosing",
      //                      so the default must win. This is React's own
      //                      convention and every call site relies on it.
      //   has NO default   → `aria-describedby={undefined}` is a VALUE, and the
      //                      only way to say "no description". Radix reserves exactly
      //                      this to opt out of its generated id: it sets
      //                      `aria-describedby={descriptionId}` and then spreads
      //                      the consumer's props over it. Dropping the key means
      //                      the override never lands, the generated id stays,
      //                      and Radix warns about a description that cannot be
      //                      suppressed.
      //
      // So: skip an explicit `undefined` only when a default would replace it.
      //
      // `hasOwnProperty.call` rather than `Object.hasOwn`: the latter is ES2022
      // and this package targets ES2020, and raising the floor for every
      // consumer over one call site is not a trade worth making.
      const incoming = incomingProps as Record<string, unknown>;
      const hasDefault = (key: string) =>
        !!defaults && Object.prototype.hasOwnProperty.call(defaults, key);
      const defined: Record<string, unknown> = {};
      for (const key of Object.keys(incoming)) {
        if (incoming[key] === undefined && hasDefault(key)) continue;
        defined[key] = incoming[key];
      }
      const props = { ...defaults, ...defined } as TProps & {
        sp?: SlotPropsMap<TSlots>;
      };

      // 2. Extract instance slot-props
      const instanceSP = props.sp;

      // 3. Get global slot-props
      const { globalSP } = useMoveContext<TSlots>(name);

      // 4. Internal ref
      const internalRef = React.useRef<TRef | null>(null);
      const mergedRef = useMergedRef<TRef>(forwardedRef, internalRef);

      // 5. Build cx() and sp()
      const cx = createCx<TSlots>(styles);
      const sp = createSp<TSlots>(globalSP, instanceSP);
      const slot = (name: TSlots, ...extra: (string | false | null | undefined)[]): SlotProps => {
        const { className, style, ...rest } = sp(name);
        return { ...rest, className: cx(name, ...extra, className), style };
      };

      // 6. Separate attrs from Move-specific props
      const attrs: Record<string, unknown> = { 'data-move': name };
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
        sp,
        slot,
        attrs,
      };

      // 8. Call setup
      const result: SetupReturn = setup(context);

      // 9. Render
      return <>{result.render()}</>;
    },
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
