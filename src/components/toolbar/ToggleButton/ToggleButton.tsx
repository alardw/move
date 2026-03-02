'use client';
// Generated from ToggleButton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Toggle as RadixToggle } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useInteractiveAnimate, defaultAnimations } from '../../../animation';
import type { InteractionAnimate } from '../../../animation';
import type { ButtonVariant, ButtonSize } from '../../core/Button';
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
  animate?: InteractionAnimate | false;
  sp?: SlotPropsMap<'root'>;
}

export const ToggleButton = withMoveComponent<'root', ToggleButtonProps, HTMLButtonElement>({
  name: 'ToggleButton',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'secondary', size: 'md' },
  moveProps: ['pressed', 'defaultPressed', 'onPressedChange', 'disabled', 'variant', 'size', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      variant,
      size,
      animate: animateProp,
      className,
      style,
      children,
    } = props;

    const animateConfig = animateProp === false
      ? { hover: false as const, press: false as const }
      : { ...(animateProp || {}) };

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as InteractionAnimate,
      defaults: defaultAnimations.element,
      disabled: !!props.disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

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
            onMouseEnter={handlers.onMouseEnter}
            onMouseLeave={handlers.onMouseLeave}
            onMouseDown={handlers.onMouseDown}
            onMouseUp={handlers.onMouseUp}
            onKeyDown={handlers.onKeyDown as any}
            onKeyUp={handlers.onKeyUp as any}
          >
            {children}
          </RadixToggle.Root>
        );
      },
    };
  },
});
