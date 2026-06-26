'use client';
// Generated from ToggleButton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Toggle as RadixToggle } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, scaleUp, scaleDown } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { ButtonVariant, ButtonSize } from '../../actions/Button';
import styles from './ToggleButton.module.css';

// ============================================================================
// ToggleButton
// ============================================================================

export interface ToggleButtonProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'root'>;
}

export const ToggleButton = withMoveComponent<'root', ToggleButtonProps, HTMLButtonElement>({
  name: 'ToggleButton',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'secondary', size: 'md' },
  moveProps: ['pressed', 'defaultPressed', 'onPressedChange', 'disabled', 'variant', 'size', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      variant,
      size,
      animations: animationsProp,
      className,
      style,
      children,
    } = props;

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Root.hover', sequence: [{ animation: scaleUp }] },
      { trigger: 'Root.press', sequence: [{ animation: scaleDown }] },
    ];
    const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, animationsProp);
    const btnRef = React.useRef<HTMLElement | null>(null);
    const isDisabled = !!props.disabled;
    const refs = React.useMemo(() => ({ Root: btnRef as React.RefObject<HTMLElement | null> }), []);
    const { handlers } = useAnimations(animConfig, refs);

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, btnRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const toggleProps: Record<string, unknown> = {};
        if (props.pressed !== undefined) toggleProps.pressed = props.pressed;
        if (props.defaultPressed !== undefined) toggleProps.defaultPressed = props.defaultPressed;
        if (props.onPressedChange !== undefined) toggleProps.onPressedChange = props.onPressedChange;

        return (
          <RadixToggle.Root
            {...attrs}
            {...spRest}
            {...toggleProps}
            ref={mergedRef}
            disabled={props.disabled as boolean}
            className={cx('root', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-variant={variant}
            data-size={size}
            onMouseEnter={() => { if (!isDisabled) handlers.Root?.onMouseEnter?.(); }}
            onMouseLeave={() => { if (!isDisabled) handlers.Root?.onMouseLeave?.(); }}
            onMouseDown={() => { if (!isDisabled) handlers.Root?.onMouseDown?.(); }}
            onMouseUp={() => { if (!isDisabled) handlers.Root?.onMouseUp?.(); }}
            onKeyDown={(e: React.KeyboardEvent) => { if (!isDisabled) handlers.Root?.onKeyDown?.(e); }}
            onKeyUp={(e: React.KeyboardEvent) => { if (!isDisabled) handlers.Root?.onKeyUp?.(e); }}
          >
            {children}
          </RadixToggle.Root>
        );
      },
    };
  },
});
