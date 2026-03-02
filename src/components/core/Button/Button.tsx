'use client';
// Generated from Button.spec.ts (schemaVersion: 6, specHash: 2082df0a)
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useInteractiveAnimate, defaultAnimations } from '../../../animation';
import type { InteractionAnimate } from '../../../animation';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Record<string, unknown> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animate?: InteractionAnimate | false;
  elevation?: number;
  asChild?: boolean;
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

export interface ButtonGroupProps extends Record<string, unknown> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (props, ref) => {
    const { children, className, style, ...rest } = props as ButtonGroupProps & Record<string, unknown>;
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
  }
);
ButtonGroup.displayName = 'Button.Group';

const ButtonRoot = withMoveComponent<'root', ButtonProps, HTMLButtonElement, { Group: typeof ButtonGroup }>({
  name: 'Button',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'primary' as ButtonVariant, size: 'md' as ButtonSize, asChild: false, type: 'button' },
  moveProps: ['animate', 'elevation', 'asChild'],
  subComponents: { Group: ButtonGroup },

  setup({ props, ref, cx, sp, attrs }) {
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

    const animateConfig = animateProp === false
      ? { hover: false as const, press: false as const }
      : (animateProp as InteractionAnimate) || {};

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as InteractionAnimate,
      defaults: defaultAnimations.element,
      disabled: !!props.disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const Comp = asChild ? Slot.Root : 'button';
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const extraClasses: string[] = [];
        if (elevation !== undefined) {
          extraClasses.push('cast-shadow');
        }

        const combinedStyle: React.CSSProperties = {
          ...(style as React.CSSProperties),
          ...(elevation !== undefined && ({ '--elevation': (elevation as number) * 4 } as React.CSSProperties)),
          ...(spStyle as React.CSSProperties),
        };

        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type={asChild ? undefined : (type as 'button' | 'submit' | 'reset')}
            className={cx('root', ...extraClasses, className, spClass as string | undefined)}
            style={combinedStyle}
            data-variant={variant as string}
            data-size={size as string}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseEnter();
              (onMouseEnter as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseLeave();
              (onMouseLeave as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseDown();
              (onMouseDown as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseUp();
              (onMouseUp as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyDown(e);
              (onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined)?.(e);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyUp(e);
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
