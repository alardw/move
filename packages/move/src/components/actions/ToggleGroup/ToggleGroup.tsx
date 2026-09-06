'use client';
// Generated from ToggleGroup.spec.ts
import * as React from 'react';
import { ToggleGroup as RadixToggleGroup } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  scaleDown,
  useAnimations,
  usePositionTracker,
  resolveAnimationsConfig,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { ButtonSize } from '../../actions/Button';
import styles from './ToggleGroup.module.css';

/** Visual appearance, shared with Tabs so the two read as one vocabulary:
 *  a filled sliding pill, a Pinterest-style underline filter bar, or
 *  connected outlined segments. */
export type ToggleGroupVariant = 'pills' | 'underline' | 'outline';

// ============================================================================
// Context
// ============================================================================

interface ToggleGroupContextValue {
  size: ButtonSize;
  variant: ToggleGroupVariant;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: 'md',
  variant: 'pills',
});

// ============================================================================
// Root
// ============================================================================

export interface ToggleGroupRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  loop?: boolean;
  size?: ButtonSize;
  variant?: ToggleGroupVariant;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'root'>;
}

const ToggleGroupRoot = withMoveComponent<
  'root' | 'indicator',
  ToggleGroupRootProps,
  HTMLDivElement
>({
  name: 'ToggleGroupRoot',
  styles,
  slots: ['root', 'indicator'] as const,
  defaults: { variant: 'pills', size: 'md' },
  moveProps: [
    'value',
    'defaultValue',
    'onValueChange',
    'orientation',
    'disabled',
    'loop',
    'size',
    'variant',
    'animations',
  ],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const ctxValue = React.useMemo(
      () => ({ size: props.size as ButtonSize, variant: props.variant as ToggleGroupVariant }),
      [props.size, props.variant],
    );

    // Always controlled internally to prevent deselection.
    // Radix fires "" when clicking the active item — we simply ignore it.
    const isControlled = props.value !== undefined;
    const [internal, setInternal] = React.useState<string>((props.defaultValue as string) ?? '');
    const currentValue = isControlled ? (props.value as string) : internal;

    const handleValueChange = React.useCallback(
      (value: string) => {
        if (!value) return; // block deselection
        if (!isControlled) setInternal(value);
        (props.onValueChange as ((v: string) => void) | undefined)?.(value);
      },
      [props.onValueChange, isControlled],
    );

    // --- Sliding indicator: shared usePositionTracker hook (the slidingIndicator
    // capability). The press-scale stays a declarative Root.press animation. ---
    // Pills fill the active item (track both axes); underline rides a bar under
    // it (track width only) — the same split Tabs uses. Outline draws its active
    // state with borders and has no sliding indicator, so the tracker is off.
    const { indicatorRef, update: updateIndicator } = usePositionTracker({
      containerRef: internalRef as React.RefObject<HTMLElement | null>,
      activeSelector: '[data-state="on"]',
      track: props.variant === 'underline' ? 'width' : 'both',
      disabled: props.animations === false || props.variant === 'outline',
    });

    /**
     * None on the indicator, deliberately.
     *
     * `usePositionTracker` owns the indicator's `transform` — it is the declared
     * `slidingIndicator` capability, and that inline transform IS where the pill
     * is. A press animation writing `scale` writes the same property, so the two
     * raced: press-down ended at scale(1), release ended at scale(0.92), and the
     * pill stayed 8% small for the rest of the session. Sliding a shrunken pill
     * is what read as the whole group scaling.
     *
     * It also cannot satisfy class → animation → class: handing back means
     * removing the inline style so a class takes over, and here removing the
     * transform removes the position itself. There is no class holding either
     * end, so there is nothing to hand back to.
     *
     * The press belongs on the ITEM, which has classes for its states and no
     * imperative writer. See ToggleGroupItem below.
     */
    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [];

    const animationsProp = props.animations as AnimationTrigger[] | false | undefined;
    const animConfig =
      animationsProp === false ? null : resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);

    const animRefs = React.useMemo(
      () => ({
        Root: internalRef as React.RefObject<HTMLElement | null>,
        Indicator: indicatorRef,
      }),
      [internalRef, indicatorRef],
    );
    const { handlers } = useAnimations(animConfig, animRefs);
    React.useEffect(() => {
      updateIndicator();
    }, [currentValue, updateIndicator]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const {
          className: indSpClass,
          style: indSpStyle,
          ...indSpRest
        } = indicatorSp as Record<string, unknown>;

        return (
          <ToggleGroupContext.Provider value={ctxValue}>
            <RadixToggleGroup.Root
              {...attrs}
              {...spRest}
              ref={ref}
              type="single"
              value={currentValue}
              onValueChange={handleValueChange}
              orientation={props.orientation as 'horizontal' | 'vertical'}
              disabled={props.disabled as boolean}
              loop={props.loop as boolean}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-orientation={props.orientation || 'horizontal'}
              data-size={props.size}
              data-variant={props.variant}
              onMouseDown={() => {
                if (!props.disabled) handlers.Root?.onMouseDown?.();
              }}
              onMouseUp={() => {
                if (!props.disabled) handlers.Root?.onMouseUp?.();
              }}
              onMouseLeave={() => {
                if (!props.disabled) handlers.Root?.onMouseLeave?.();
              }}
            >
              {props.children}
              <div
                {...indSpRest}
                ref={indicatorRef as React.Ref<HTMLDivElement>}
                aria-hidden="true"
                className={cx('indicator', indSpClass as string | undefined)}
                style={indSpStyle as React.CSSProperties}
              />
            </RadixToggleGroup.Root>
          </ToggleGroupContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface ToggleGroupItemProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'item'>;
}

const ToggleGroupItem = withMoveComponent<'item', ToggleGroupItemProps, HTMLButtonElement>({
  name: 'ToggleGroupItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['value', 'disabled', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { size, variant } = React.useContext(ToggleGroupContext);

    // Animations disabled by default — scaling breaks connected borders.
    // Users can opt in via animations prop with standard AnimationTrigger[] format.
    // Press feedback belongs here, not on the indicator: an item has classes for
    // its resting state and nothing else writes its transform, so the animation
    // can hand back. Same shape as ToggleButton, which is the same affordance.
    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Item.press', sequence: [{ animation: scaleDown() }] },
    ];

    const animationsProp = props.animations as AnimationTrigger[] | false | undefined;
    const animConfig =
      animationsProp === false ? null : resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);

    const itemRef = React.useRef<HTMLElement | null>(null);
    const itemRefs = React.useMemo(() => ({ Item: itemRef }), []);
    const { handlers } = useAnimations(animConfig, itemRefs);
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, itemRef as React.Ref<HTMLButtonElement>);
    const isDisabled = !!props.disabled;

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        return (
          <RadixToggleGroup.Item
            {...attrs}
            {...spRest}
            ref={mergedRef}
            value={props.value as string}
            disabled={props.disabled as boolean}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-variant={variant}
            data-size={size}
            onMouseEnter={() => {
              if (!isDisabled) handlers.Item?.onMouseEnter?.();
            }}
            onMouseLeave={() => {
              if (!isDisabled) handlers.Item?.onMouseLeave?.();
            }}
            onMouseDown={() => {
              if (!isDisabled) handlers.Item?.onMouseDown?.();
            }}
            onMouseUp={() => {
              if (!isDisabled) handlers.Item?.onMouseUp?.();
            }}
          >
            {props.children}
          </RadixToggleGroup.Item>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
