'use client';
// Generated from Switch.spec.ts
import * as React from 'react';
import { useRef } from 'react';
import { Switch as RadixSwitch } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import { useFieldControl } from '../FormField/FormField';
import { snappy, useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import styles from './Switch.module.css';

// ============================================================================
// Context (shares the thumb and knob refs between Root and Thumb)
// ============================================================================

interface SwitchContextValue {
  /** Positions — owns translateX. Never scaled, so always safe to measure. */
  thumbRef: React.RefObject<HTMLSpanElement | null>;
  /** The visible circle — owns scale. One writer per element. */
  knobRef: React.RefObject<HTMLSpanElement | null>;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  label?: React.ReactNode;
  size?: SwitchSize;
  animations?: AnimationTrigger[] | false;
  required?: boolean;
  name?: string;
  value?: string;
}

const SwitchRoot = withMoveComponent<'root' | 'label', SwitchRootProps, HTMLButtonElement>({
  name: 'SwitchRoot',
  styles,
  slots: ['root', 'label'] as const,
  moveProps: [
    'checked',
    'defaultChecked',
    'onCheckedChange',
    'disabled',
    'invalid',
    'label',
    'size',
    'animations',
    'required',
    'name',
    'value',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const thumbRef = useRef<HTMLSpanElement>(null);
    const knobRef = useRef<HTMLSpanElement>(null);
    const rootRef = useRef<HTMLButtonElement>(null);

    // Compute slide distance from thumb element at animation time
    function measureDist(el: HTMLElement): number {
      const root = el.closest('[role="switch"]') as HTMLElement | null;
      if (!root) return 0;
      const rootStyle = getComputedStyle(root);
      const contentWidth =
        root.clientWidth - parseFloat(rootStyle.paddingLeft) - parseFloat(rootStyle.paddingRight);
      // offsetWidth, not getBoundingClientRect().width: the rect reflects the
      // element's CURRENT transform, and this runs at trigger time — while the
      // press has the thumb at scale 0.85. Measuring a shrunk thumb made the
      // travel 46 - 18.7 = 27.3 instead of 46 - 22 = 24, so the animation
      // overshot the resting position its class holds. offsetWidth is the layout
      // width and ignores transforms.
      const thumbWidth = el.offsetWidth;
      return contentWidth - thumbWidth;
    }

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      {
        trigger: 'Root.press',
        sequence: [{ target: 'Knob', animation: { scale: { from: 1, to: 0.85, ease: snappy } } }],
      },
      // Both ends stated. Without a `from`, anime reads the element's CURRENT
      // value as the start — and by the time a state trigger fires, the class
      // for the new state already applies, so the thumb is where the animation
      // was about to move it and it travels nowhere. Naming both ends makes the
      // journey independent of what CSS says at that instant.
      {
        trigger: 'checked',
        vars: (el: HTMLElement) => ({ dist: measureDist(el) }),
        sequence: [{ target: 'Thumb', animation: { x: { from: 0, to: '$dist', ease: snappy } } }],
      },
      {
        trigger: 'unchecked',
        vars: (el: HTMLElement) => ({ dist: measureDist(el) }),
        sequence: [{ target: 'Thumb', animation: { x: { from: '$dist', to: 0, ease: snappy } } }],
      },
    ];

    const animConfig = resolveAnimationsConfig(
      DEFAULT_ANIMATIONS,
      props.animations as AnimationTrigger[] | false | undefined,
    );

    const states: AnimationState[] = [
      {
        name: 'checked',
        slot: 'Thumb',
        source: 'data-state',
        value: 'checked',
        closest: '[role="switch"]',
      },
      {
        name: 'unchecked',
        slot: 'Thumb',
        source: 'data-state',
        value: 'unchecked',
        closest: '[role="switch"]',
      },
    ];

    const animRefs = React.useMemo(
      () => ({
        Root: rootRef as React.RefObject<HTMLElement | null>,
        Thumb: thumbRef as React.RefObject<HTMLElement | null>,
        Knob: knobRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );
    const { handlers } = useAnimations(animConfig, animRefs, states);
    const isDisabled = !!props.disabled;

    const contextValue = React.useMemo(() => ({ thumbRef, knobRef }), []);

    // Merge forwarded ref with rootRef
    const mergedRootRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (rootRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') (ref as (el: HTMLButtonElement | null) => void)(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref],
    );

    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      invalid: !!props.invalid,
      ref: rootRef,
    });

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const switchEl = (
          <SwitchContext.Provider value={contextValue}>
            <RadixSwitch.Root
              {...controlProps}
              {...spRest}
              ref={mergedRootRef}
              data-size={props.size}
              checked={props.checked as boolean}
              defaultChecked={props.defaultChecked as boolean}
              onCheckedChange={props.onCheckedChange as (checked: boolean) => void}
              disabled={props.disabled as boolean}
              required={props.required as boolean}
              name={props.name as string}
              value={props.value as string}
              {...(props.invalid ? { 'data-invalid': '' } : {})}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              onMouseDown={() => {
                if (!isDisabled) handlers.Root?.onMouseDown?.();
              }}
              onMouseUp={() => {
                if (!isDisabled) handlers.Root?.onMouseUp?.();
              }}
              onMouseLeave={() => {
                if (!isDisabled) handlers.Root?.onMouseLeave?.();
              }}
            >
              {props.children}
            </RadixSwitch.Root>
          </SwitchContext.Provider>
        );

        if (props.label != null) {
          return (
            <label className={styles.wrapper} {...(props.disabled ? { 'data-disabled': '' } : {})}>
              {switchEl}
              <span
                {...(sp('label') as Record<string, unknown>)}
                className={cx('label', (sp('label') as { className?: string }).className)}
              >
                {props.label as React.ReactNode}
              </span>
            </label>
          );
        }

        return switchEl;
      },
    };
  },
});

// ============================================================================
// Thumb
// ============================================================================

export interface SwitchThumbProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
}

const SwitchThumb = withMoveComponent<'thumb' | 'knob', SwitchThumbProps, HTMLSpanElement>({
  name: 'SwitchThumb',
  styles,
  slots: ['thumb', 'knob'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = React.useContext(SwitchContext);

    const thumbCallback = React.useCallback(
      (node: HTMLSpanElement | null) => {
        if (ctx) {
          (ctx.thumbRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        }
        if (typeof ref === 'function') (ref as (el: HTMLSpanElement | null) => void)(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      },
      [ref, ctx],
    );

    return {
      render() {
        const thumbSp = sp('thumb');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = thumbSp as Record<string, unknown>;
        return (
          <RadixSwitch.Thumb
            {...attrs}
            {...spRest}
            ref={thumbCallback}
            className={cx('thumb', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {/* The visible circle. Separate from the positioned thumb so the
                travel and the press each own one element's transform. */}
            <span
              {...(sp('knob') as Record<string, unknown>)}
              ref={ctx?.knobRef as React.Ref<HTMLSpanElement>}
              className={cx('knob', (sp('knob') as { className?: string }).className)}
            />
          </RadixSwitch.Thumb>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
