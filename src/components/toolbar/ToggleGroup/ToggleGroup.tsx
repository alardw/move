'use client';

import * as React from 'react';
import { ToggleGroup as RadixToggleGroup } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useInteractiveAnimate, prefersReducedMotion } from '../../../animation';
import { defaultAnimations, type ElementAnimate } from '../../../animation/types';
import type { PassThrough } from '../../../engine/types';
import type { ButtonVariant, ButtonSize } from '../../core/Button';
import styles from './ToggleGroup.module.css';

// ============================================================================
// Context
// ============================================================================

interface ToggleGroupContextValue {
  size: ButtonSize;
  variant: ButtonVariant;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: 'md',
  variant: 'secondary',
});

// ============================================================================
// Root
// ============================================================================

export interface ToggleGroupRootProps extends Record<string, unknown> {
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
  variant?: ButtonVariant;
  pt?: PassThrough<'root'>;
}

const ToggleGroupRoot = withMoveComponent<'root' | 'indicator', ToggleGroupRootProps, HTMLDivElement>({
  name: 'ToggleGroupRoot',
  styles,
  slots: ['root', 'indicator'] as const,
  defaults: { variant: 'secondary', size: 'md' },
  moveProps: ['value', 'defaultValue', 'onValueChange', 'orientation', 'disabled', 'loop', 'size', 'variant'],

  setup({ props, ref, internalRef, cx, ptm, attrs }) {
    const ctxValue = React.useMemo(
      () => ({ size: props.size as ButtonSize, variant: props.variant as ButtonVariant }),
      [props.size, props.variant],
    );

    // Always controlled internally to prevent deselection.
    // Radix fires "" when clicking the active item — we simply ignore it.
    const isControlled = props.value !== undefined;
    const [internal, setInternal] = React.useState<string>(
      (props.defaultValue as string) ?? '',
    );
    const currentValue = isControlled ? (props.value as string) : internal;

    const handleValueChange = React.useCallback(
      (value: string) => {
        if (!value) return; // block deselection
        if (!isControlled) setInternal(value);
        (props.onValueChange as ((v: string) => void) | undefined)?.(value);
      },
      [props.onValueChange, isControlled],
    );

    // --- Sliding indicator ---
    const indicatorRef = React.useRef<HTMLDivElement | null>(null);
    const isFirstRun = React.useRef(true);
    const isVertical = (props.orientation as string) === 'vertical';
    const pressAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const isPressing = React.useRef(false);
    const pressSpring = { mass: 0.6, stiffness: 500, damping: 12 };

    const handlePressDown = React.useCallback(() => {
      const el = indicatorRef.current;
      if (!el || props.disabled) return;
      isPressing.current = true;
      if (pressAnimRef.current) pressAnimRef.current.pause();
      pressAnimRef.current = animate(el, {
        scale: 0.92,
        ease: spring(pressSpring),
      });
    }, [props.disabled]);

    const handlePressUp = React.useCallback(() => {
      const el = indicatorRef.current;
      if (!el || !isPressing.current) return;
      isPressing.current = false;
      if (pressAnimRef.current) pressAnimRef.current.pause();
      pressAnimRef.current = animate(el, {
        scale: 1,
        ease: spring(pressSpring),
      });
    }, []);

    const updateIndicator = React.useCallback(() => {
      const root = internalRef.current;
      const indicator = indicatorRef.current;
      if (!root || !indicator) return;

      const active = root.querySelector<HTMLElement>('[data-state="on"]');
      if (!active) {
        indicator.style.opacity = '0';
        return;
      }

      const left = active.offsetLeft - 3;
      const top = active.offsetTop - 3;
      const width = active.offsetWidth;
      const height = active.offsetHeight;

      indicator.style.opacity = '1';
      indicator.style.width = `${width}px`;
      indicator.style.height = `${height}px`;

      if (isFirstRun.current || prefersReducedMotion()) {
        isFirstRun.current = false;
        animate(indicator, { translateX: left, translateY: top, duration: 0 });
        return;
      }

      animate(indicator, {
        translateX: left,
        translateY: top,
        width,
        height,
        ease: spring({ mass: 1, stiffness: 500, damping: 30, velocity: 0 }),
      });
    }, [internalRef]);

    React.useEffect(() => {
      const root = internalRef.current;
      if (!root) return;

      updateIndicator();

      const observer = new MutationObserver(updateIndicator);
      observer.observe(root, {
        attributes: true,
        attributeFilter: ['data-state'],
        subtree: true,
      });

      return () => observer.disconnect();
    }, [internalRef, updateIndicator]);

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const indicatorPt = ptm('indicator');
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;

        return (
          <ToggleGroupContext.Provider value={ctxValue}>
            <RadixToggleGroup.Root
              {...attrs}
              {...ptRest}
              ref={ref}
              type="single"
              value={currentValue}
              onValueChange={handleValueChange}
              orientation={props.orientation as 'horizontal' | 'vertical'}
              disabled={props.disabled as boolean}
              loop={props.loop as boolean}
              className={cx('root', props.className, ptClass as string | undefined)}
              style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
              data-orientation={props.orientation || 'horizontal'}
              data-size={props.size}
              onMouseDown={handlePressDown}
              onMouseUp={handlePressUp}
              onMouseLeave={handlePressUp}
            >
              {props.children}
              <div
                {...indPtRest}
                ref={indicatorRef}
                aria-hidden="true"
                className={cx('indicator', indPtClass as string | undefined)}
                style={indPtStyle as React.CSSProperties}
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

export interface ToggleGroupItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  animate?: ElementAnimate | false;
  pt?: PassThrough<'item'>;
}

const ToggleGroupItem = withMoveComponent<'item', ToggleGroupItemProps, HTMLButtonElement>({
  name: 'ToggleGroupItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['value', 'disabled', 'animate'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { size, variant } = React.useContext(ToggleGroupContext);

    // Disable hover/press scale by default — scaling breaks connected borders.
    // Users can opt back in via the animate prop.
    const animateConfig = props.animate === false
      ? { hover: false as const, press: false as const }
      : { hover: false as const, press: false as const, ...(props.animate as ElementAnimate || {}) };

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as ElementAnimate,
      defaults: defaultAnimations.element,
      disabled: !!props.disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const itemPt = ptm('item');
        const { className: ptClass, style: ptStyle, ...ptRest } = itemPt as Record<string, unknown>;

        return (
          <RadixToggleGroup.Item
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            value={props.value as string}
            disabled={props.disabled as boolean}
            className={cx('item', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-variant={variant}
            data-size={size}
            onMouseEnter={handlers.onMouseEnter}
            onMouseLeave={handlers.onMouseLeave}
            onMouseDown={handlers.onMouseDown}
            onMouseUp={handlers.onMouseUp}
            onKeyDown={handlers.onKeyDown as any}
            onKeyUp={handlers.onKeyUp as any}
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
