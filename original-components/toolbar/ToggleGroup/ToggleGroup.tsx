'use client';

import * as React from 'react';
import { ToggleGroup as RadixToggleGroup } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useInteractiveAnimate, useSlidingIndicator } from '../../../animation';
import { prefersReducedMotion } from '../../../animation/utils';
import { defaultAnimations, type ElementAnimate } from '../../../animation/types';
import type { SlotPropsMap } from '../../../engine/types';
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
  sp?: SlotPropsMap<'root'>;
}

const ToggleGroupRoot = withMoveComponent<'root' | 'indicator', ToggleGroupRootProps, HTMLDivElement>({
  name: 'ToggleGroupRoot',
  styles,
  slots: ['root', 'indicator'] as const,
  defaults: { variant: 'secondary', size: 'md' },
  moveProps: ['value', 'defaultValue', 'onValueChange', 'orientation', 'disabled', 'loop', 'size', 'variant'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
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

    // --- Sliding indicator (shared hook) ---
    const { indicatorRef } = useSlidingIndicator({
      containerRef: internalRef,
      activeSelector: '[data-state="on"]',
    });

    // --- Press animation on indicator ---
    const pressAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const isPressing = React.useRef(false);
    const pressSpring = { mass: 0.6, stiffness: 500, damping: 12 };

    const handlePressDown = React.useCallback(() => {
      const el = indicatorRef.current;
      if (!el || props.disabled || prefersReducedMotion()) return;
      isPressing.current = true;
      if (pressAnimRef.current) pressAnimRef.current.pause();
      pressAnimRef.current = animate(el, {
        scale: 0.92,
        ease: spring(pressSpring),
      });
    }, [props.disabled, indicatorRef]);

    const handlePressUp = React.useCallback(() => {
      const el = indicatorRef.current;
      if (!el || !isPressing.current) return;
      isPressing.current = false;
      if (pressAnimRef.current) pressAnimRef.current.pause();
      pressAnimRef.current = animate(el, {
        scale: 1,
        ease: spring(pressSpring),
      });
    }, [indicatorRef]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;

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
              onMouseDown={handlePressDown}
              onMouseUp={handlePressUp}
              onMouseLeave={handlePressUp}
            >
              {props.children}
              <div
                {...indSpRest}
                ref={indicatorRef}
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

export interface ToggleGroupItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  animate?: ElementAnimate | false;
  sp?: SlotPropsMap<'item'>;
}

const ToggleGroupItem = withMoveComponent<'item', ToggleGroupItemProps, HTMLButtonElement>({
  name: 'ToggleGroupItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['value', 'disabled', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
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
