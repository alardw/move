'use client';
// Generated from Switch.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { useRef } from 'react';
import { Switch as RadixSwitch } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import { snappy, useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import styles from './Switch.module.css';

// ============================================================================
// Context (shares thumb ref between Root and Thumb)
// ============================================================================

interface SwitchContextValue {
  thumbRef: React.RefObject<HTMLSpanElement | null>;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchRootProps extends Record<string, unknown> {
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

const SwitchRoot = withMoveComponent<'root', SwitchRootProps, HTMLButtonElement>({
  name: 'SwitchRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['checked', 'defaultChecked', 'onCheckedChange', 'disabled', 'invalid', 'label', 'size', 'animations', 'required', 'name', 'value'],

  setup({ props, ref, cx, sp, attrs }) {
    const thumbRef = useRef<HTMLSpanElement>(null);
    const rootRef = useRef<HTMLButtonElement>(null);

    // Compute slide distance from thumb element at animation time
    function measureDist(el: HTMLElement): number {
      const root = el.closest('[role="switch"]') as HTMLElement | null;
      if (!root) return 0;
      const rootStyle = getComputedStyle(root);
      const contentWidth = root.clientWidth - parseFloat(rootStyle.paddingLeft) - parseFloat(rootStyle.paddingRight);
      const thumbWidth = el.getBoundingClientRect().width;
      return contentWidth - thumbWidth;
    }

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Root.press', sequence: [{ target: 'Thumb', animation: { scale: { to: 0.85, ease: snappy } } }] },
      {
        trigger: 'checked',
        vars: (el: HTMLElement) => ({ dist: measureDist(el) }),
        sequence: [{ target: 'Thumb', animation: { x: { to: '$dist', ease: snappy } } }],
      },
      {
        trigger: 'unchecked',
        sequence: [{ target: 'Thumb', animation: { x: { to: 0, ease: snappy } } }],
      },
    ];

    const animConfig = resolveAnimationsConfig(
      DEFAULT_ANIMATIONS,
      props.animations as AnimationTrigger[] | false | undefined,
    );

    const states: AnimationState[] = [
      { name: 'checked', slot: 'Thumb', source: 'data-state', value: 'checked', closest: '[role="switch"]' },
      { name: 'unchecked', slot: 'Thumb', source: 'data-state', value: 'unchecked', closest: '[role="switch"]' },
    ];

    const animRefs = React.useMemo(() => ({
      Root: rootRef as React.RefObject<HTMLElement | null>,
      Thumb: thumbRef as React.RefObject<HTMLElement | null>,
    }), []);
    const { handlers } = useAnimations(animConfig, animRefs, states);
    const isDisabled = !!props.disabled;

    // Set initial thumb position on mount
    React.useLayoutEffect(() => {
      const thumb = thumbRef.current;
      const root = rootRef.current;
      if (!thumb || !root) return;
      const isChecked = root.getAttribute('data-state') === 'checked';
      const dist = measureDist(thumb);
      thumb.style.transform = isChecked ? `translateX(${dist}px)` : 'translateX(0px)';
    }, []);

    const contextValue = React.useMemo(() => ({ thumbRef }), []);

    // Merge forwarded ref with rootRef
    const mergedRootRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (rootRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') (ref as (el: HTMLButtonElement | null) => void)(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const switchEl = (
          <SwitchContext.Provider value={contextValue}>
            <RadixSwitch.Root
              {...attrs}
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
              onMouseDown={() => { if (!isDisabled) handlers.Root?.onMouseDown?.(); }}
              onMouseUp={() => { if (!isDisabled) handlers.Root?.onMouseUp?.(); }}
              onMouseLeave={() => { if (!isDisabled) handlers.Root?.onMouseLeave?.(); }}
            >
              {props.children}
            </RadixSwitch.Root>
          </SwitchContext.Provider>
        );

        if (props.label != null) {
          return (
            <label className={styles.wrapper} {...(props.disabled ? { 'data-disabled': '' } : {})}>
              {switchEl}
              <span className={styles.label}>{props.label as React.ReactNode}</span>
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

export interface SwitchThumbProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
}

const SwitchThumb = withMoveComponent<'thumb', SwitchThumbProps, HTMLSpanElement>({
  name: 'SwitchThumb',
  styles,
  slots: ['thumb'] as const,

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
        const { className: spClass, style: spStyle, ...spRest } = thumbSp as Record<string, unknown>;
        return (
          <RadixSwitch.Thumb
            {...attrs}
            {...spRest}
            ref={thumbCallback}
            className={cx('thumb', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
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
