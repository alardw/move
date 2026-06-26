'use client';
// Generated from Button.spec.ts (schemaVersion: 6, specHash: 2082df0a)
import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { snappy } from '../../../animation/easings';
import type { Size } from '../../../shared/types';
import styles from './Button.module.css';

// Width-relative scale — consistent feel regardless of button width
const SCALE_HOVER_PX = 4;
const SCALE_PRESS_PX = 6;

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
/** Re-exported for backwards-compatible imports. Prefer `Size` from
 *  `'move'` directly going forward. */
export type ButtonSize = Size;

export interface ButtonProps extends Record<string, unknown> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animations?: AnimationTrigger[] | false;
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
  moveProps: ['animations', 'elevation', 'asChild'],
  subComponents: { Group: ButtonGroup },

  setup({ props, ref, cx, sp, attrs }) {
    const {
      variant,
      size,
      animations: animationsProp,
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

    const btnRef = React.useRef<HTMLElement | null>(null);
    const [scaleVals, setScaleVals] = React.useState({ up: 1.05, down: 0.95 });

    React.useEffect(() => {
      const el = btnRef.current;
      if (!el) return;
      const update = () => {
        const w = el.getBoundingClientRect().width;
        if (w > 0) {
          setScaleVals({ up: (w + SCALE_HOVER_PX) / w, down: (w - SCALE_PRESS_PX) / w });
        }
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = React.useMemo(() => [
      { trigger: 'Root.hover', sequence: [{ animation: { scale: { to: scaleVals.up, ease: snappy } } }] },
      { trigger: 'Root.press', sequence: [{ animation: { scale: { to: scaleVals.down, ease: snappy } } }] },
    ], [scaleVals]);

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
