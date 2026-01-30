'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useInteractiveAnimate } from '../../../animation';
import { defaultAnimations, type InteractiveAnimate } from '../../../animation/types';
import type { ElevationLevel } from '../../../styles/visual';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Record<string, unknown> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animate?: InteractiveAnimate | false;
  elevation?: ElevationLevel;
  asChild?: boolean;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
}

// ============================================================================
// Button.Group sub-component
// ============================================================================

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, style, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      style={{ display: 'inline-flex', gap: '0.5rem', ...style }}
      {...props}
    >
      {children}
    </div>
  )
);
ButtonGroup.displayName = 'Button.Group';

// ============================================================================
// Button component
// ============================================================================

export const Button = withMoveComponent<'root', ButtonProps, HTMLButtonElement, { Group: typeof ButtonGroup }>({
  name: 'Button',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'primary', size: 'md', asChild: false, type: 'button' },
  moveProps: ['variant', 'size', 'animate', 'elevation', 'asChild'],
  subComponents: { Group: ButtonGroup },

  setup({ props, ref, cx, ptm, attrs }) {
    const {
      variant,
      size,
      animate: animateProp,
      elevation,
      asChild,
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

    // Wire up interactive animation via the existing hook
    const animateConfig = animateProp === false
      ? { hover: false as const, press: false as const }
      : { ...(animateProp || {}), ...(!animateProp ? {} : {}) };

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as InteractiveAnimate,
      defaults: defaultAnimations.interactive,
      disabled: !!props.disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const Comp = asChild ? Slot.Root : 'button';
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        // Build class list
        const extraClasses: string[] = [];
        if (elevation !== undefined) {
          extraClasses.push('cast-shadow');
        }

        const combinedStyle: React.CSSProperties = {
          ...style,
          ...(elevation !== undefined && ({ '--elevation': elevation * 4 } as React.CSSProperties)),
          ...(ptStyle as React.CSSProperties),
        };

        return (
          <Comp
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type={asChild ? undefined : (type as 'button' | 'submit' | 'reset')}
            className={cx('root', ...extraClasses, className, ptClass as string | undefined)}
            style={combinedStyle}
            data-variant={variant}
            data-size={size}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseEnter();
              onMouseEnter?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseLeave();
              onMouseLeave?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseDown();
              onMouseDown?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseUp();
              onMouseUp?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyDown(e);
              onKeyDown?.(e);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyUp(e);
              onKeyUp?.(e);
            }}
          >
            {children}
          </Comp>
        );
      },
    };
  },
});
