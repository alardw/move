'use client';
// Generated from Button.spec.ts
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { snappy } from '../../../animation/easings';
import type { Size } from '../../../shared/types';
import { CONTROL_GROW_PX, CONTROL_PRESS_PX, growVars } from '../../../shared/controlGrow';
import styles from './Button.module.css';

/**
 * Hover and press, as distances.
 *
 * Module-level, and that is the point: the ratio is resolved per element when
 * the trigger fires, so nothing here depends on the instance — no measuring on
 * mount, no ResizeObserver, no state, no re-render. Every button in the library
 * travels the same four pixels out and six back, at any width.
 */
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Root.hover',
    vars: growVars('--move-button-scale-hover', CONTROL_GROW_PX),
    sequence: [{ animation: { scale: { to: '$scaleHover', ease: snappy } } }],
  },
  {
    trigger: 'Root.press',
    vars: growVars('--move-button-scale-press', -CONTROL_PRESS_PX),
    sequence: [{ animation: { scale: { to: '$scaleHover', ease: snappy } } }],
  },
];

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
/** Re-exported for backwards-compatible imports. Prefer `Size` from
 *  `'move'` directly going forward. */
export type ButtonSize = Size;

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animations?: AnimationTrigger[] | false;
  asChild?: boolean;
  fullWidth?: boolean;
  type?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {
  const { children, className, style, ...rest } = props as ButtonGroupProps &
    Record<string, unknown>;
  return (
    <div
      ref={ref}
      role="group"
      className={className}
      style={{ display: 'inline-flex', gap: 'var(--move-spacing-sm)', ...style }}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
});
ButtonGroup.displayName = 'Button.Group';

const ButtonRoot = withMoveComponent<
  'root',
  ButtonProps,
  HTMLButtonElement,
  { Group: typeof ButtonGroup }
>({
  name: 'Button',
  styles,
  slots: ['root'] as const,
  defaults: {
    variant: 'primary' as ButtonVariant,
    size: 'md' as ButtonSize,
    asChild: false,
    type: 'button',
  },
  moveProps: ['animations', 'asChild', 'fullWidth'],
  subComponents: { Group: ButtonGroup },

  setup({ props, ref, cx, sp, attrs }) {
    const {
      variant,
      size,
      animations: animationsProp,
      asChild,
      fullWidth,
      type,
      className,
      style,
      children,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      onKeyUp,
    } = props;

    const btnRef = React.useRef<HTMLElement | null>(null);

    const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);
    const refs = React.useMemo(() => ({ Root: btnRef }), []);
    const { handlers } = useAnimations(animConfig, refs);
    const isDisabled = !!props.disabled;

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, btnRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const Comp = asChild ? Slot.Root : 'button';
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        // The two scale custom properties CSS holds the states in are written by
        // the trigger, on the element, at the moment it fires — see growVars.
        const combinedStyle: React.CSSProperties = {
          ...(style as React.CSSProperties),
          ...(spStyle as React.CSSProperties),
        };

        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type={asChild ? undefined : (type as 'button' | 'submit' | 'reset')}
            className={cx('root', className, spClass as string | undefined)}
            style={combinedStyle}
            data-variant={variant as string}
            data-size={size as string}
            data-full-width={fullWidth ? '' : undefined}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Root?.onMouseEnter?.();
              (onMouseEnter as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Root?.onMouseLeave?.();
              (onMouseLeave as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Root?.onMouseDown?.();
              (onMouseDown as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Root?.onMouseUp?.();
              (onMouseUp as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Root?.onKeyDown?.(e);
              (onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              if (!isDisabled) handlers.Root?.onKeyUp?.(e);
              (onKeyUp as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
          >
            {children}
          </Comp>
        );
      },
    };
  },
});

export const Button = Object.assign(ButtonRoot, {
  Group: ButtonGroup,
});
