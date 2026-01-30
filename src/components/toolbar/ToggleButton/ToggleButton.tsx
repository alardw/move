'use client';

import * as React from 'react';
import { Toggle as RadixToggle } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useInteractiveAnimate } from '../../../animation';
import { defaultAnimations, type InteractiveAnimate } from '../../../animation/types';
import type { PassThrough } from '../../../engine/types';
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
  animate?: InteractiveAnimate | false;
  pt?: PassThrough<'root'>;
}

export const ToggleButton = withMoveComponent<'root', ToggleButtonProps, HTMLButtonElement>({
  name: 'ToggleButton',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'secondary', size: 'md' },
  moveProps: ['pressed', 'defaultPressed', 'onPressedChange', 'disabled', 'variant', 'size', 'animate'],

  setup({ props, ref, cx, ptm, attrs }) {
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
      animate: animateConfig as InteractiveAnimate,
      defaults: defaultAnimations.interactive,
      disabled: !!props.disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <RadixToggle.Root
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            pressed={props.pressed as boolean}
            defaultPressed={props.defaultPressed as boolean}
            onPressedChange={props.onPressedChange as (pressed: boolean) => void}
            disabled={props.disabled as boolean}
            className={cx('root', className, ptClass as string | undefined)}
            style={{ ...style, ...(ptStyle as React.CSSProperties) }}
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
