'use client';

import * as React from 'react';
import { Switch as RadixSwitch } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import styles from './Switch.module.css';

// ============================================================================
// Context (shared thumb ref for press animation)
// ============================================================================

interface SwitchContextValue {
  thumbRef: React.MutableRefObject<HTMLSpanElement | null>;
}

const SwitchContext = React.createContext<SwitchContextValue>({
  thumbRef: { current: null },
});

// ============================================================================
// Root
// ============================================================================

export interface SwitchRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  pt?: PassThrough<'root'>;
}

const SwitchRoot = withMoveComponent<'root', SwitchRootProps, HTMLButtonElement>({
  name: 'SwitchRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['checked', 'defaultChecked', 'onCheckedChange', 'disabled', 'required', 'name', 'value'],

  setup({ props, ref, cx, ptm, attrs }) {
    const thumbRef = React.useRef<HTMLSpanElement | null>(null);
    const pressAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const isPressing = React.useRef(false);
    const contextValue = React.useMemo(() => ({ thumbRef }), []);

    const handleMouseDown = React.useCallback(() => {
      const el = thumbRef.current;
      if (!el) return;
      isPressing.current = true;
      if (pressAnimRef.current) pressAnimRef.current.pause();
      pressAnimRef.current = animate(el, {
        scale: 0.85,
        ease: spring(pressSpring),
      });
    }, []);

    const handleMouseUp = React.useCallback(() => {
      const el = thumbRef.current;
      if (!el || !isPressing.current) return;
      isPressing.current = false;
      if (pressAnimRef.current) pressAnimRef.current.pause();
      pressAnimRef.current = animate(el, {
        scale: 1,
        ease: spring(pressSpring),
      });
    }, []);

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        return (
          <SwitchContext.Provider value={contextValue}>
            <RadixSwitch.Root
              {...attrs}
              {...ptRest}
              ref={ref}
              checked={props.checked as boolean}
              defaultChecked={props.defaultChecked as boolean}
              onCheckedChange={props.onCheckedChange as (checked: boolean) => void}
              disabled={props.disabled as boolean}
              required={props.required as boolean}
              name={props.name as string}
              value={props.value as string}
              className={cx('root', props.className, ptClass as string | undefined)}
              style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {props.children}
            </RadixSwitch.Root>
          </SwitchContext.Provider>
        );
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
  pt?: PassThrough<'thumb'>;
}

const thumbSpring = { mass: 0.5, stiffness: 350, damping: 22, velocity: 0 };
const pressSpring = { mass: 0.6, stiffness: 500, damping: 12 };

const SwitchThumb = withMoveComponent<'thumb', SwitchThumbProps, HTMLSpanElement>({
  name: 'SwitchThumb',
  styles,
  slots: ['thumb'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    const { thumbRef } = React.useContext(SwitchContext);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const prevState = React.useRef<string | null>(null);
    const mergedRef = useMergedRef<HTMLSpanElement>(ref, thumbRef);

    // Observe data-state changes via MutationObserver to trigger anime.js spring
    React.useEffect(() => {
      const el = thumbRef.current;
      if (!el) return;

      // Compute translate distance from actual rendered dimensions
      const root = el.parentElement;
      if (!root) return;
      const rootStyle = getComputedStyle(root);
      const contentWidth = root.clientWidth - parseFloat(rootStyle.paddingLeft) - parseFloat(rootStyle.paddingRight);
      const thumbWidth = el.getBoundingClientRect().width;
      const translateX = contentWidth - thumbWidth;

      // Set initial position without animation
      const initialState = el.getAttribute('data-state');
      prevState.current = initialState;
      el.style.transform = initialState === 'checked' ? `translateX(${translateX}px)` : 'translateX(0px)';

      const observer = new MutationObserver(() => {
        const state = el.getAttribute('data-state');
        if (state === prevState.current) return;
        prevState.current = state;

        if (animRef.current) animRef.current.pause();

        const target = state === 'checked' ? translateX : 0;
        animRef.current = animate(el, {
          translateX: target,
          ease: spring(thumbSpring),
        });
      });

      observer.observe(el, { attributes: true, attributeFilter: ['data-state'] });
      return () => observer.disconnect();
    }, []);

    return {
      render() {
        const thumbPt = ptm('thumb');
        const { className: ptClass, style: ptStyle, ...ptRest } = thumbPt as Record<string, unknown>;
        return (
          <RadixSwitch.Thumb
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            className={cx('thumb', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
