'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { animate, type JSAnimation } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../animation/utils';
import { defaultAnimations, type InteractiveAnimate } from '../../animation/types';
import type { MaterialKind } from '../../materials';
import type { ElevationLevel } from '../../shadows';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Animation configuration for hover/press interactions.
   * Set to false to disable all animations.
   */
  animate?: InteractiveAnimate | false;
  /**
   * Material surface type. Affects specular highlights and shadow characteristics.
   * Responds to the global LightProvider direction.
   */
  material?: MaterialKind;
  /**
   * Elevation level (0-5). Controls shadow depth and offset.
   * Higher values = more pronounced directional shadow.
   */
  elevation?: ElevationLevel;
  /**
   * Render as child element (for composition with links, etc.)
   */
  asChild?: boolean;
}

// Track active animations per element
const activeAnimations = new WeakMap<HTMLElement, JSAnimation>();

function animateWithCancel(el: HTMLElement, props: Parameters<typeof animate>[1]) {
  const existing = activeAnimations.get(el);
  if (existing) {
    existing.pause();
  }
  const anim = animate(el, props);
  activeAnimations.set(el, anim);
  return anim;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      animate: animateProp,
      material,
      elevation,
      asChild = false,
      type = 'button',
      style,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : 'button';
    const internalRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!);

    // Store config in ref for stable access
    const configRef = React.useRef<InteractiveAnimate>(defaultAnimations.interactive);
    configRef.current =
      animateProp === false
        ? { hover: false, press: false }
        : mergeAnimateConfig(defaultAnimations.interactive, animateProp);

    const animateElement = (animation: InteractiveAnimate['hover']) => {
      if (!internalRef.current || !animation) return;

      const params = prefersReducedMotion()
        ? toInstantParams(animation)
        : toAnimeParams(animation);
      animateWithCancel(internalRef.current, params);
    };

    const resetScale = () => {
      if (!internalRef.current) return;
      animateWithCancel(internalRef.current, {
        scale: 1,
        duration: prefersReducedMotion() ? 0 : 150,
        ease: 'outQuad',
      });
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      const config = configRef.current;
      if (config.hover) {
        animateElement(config.hover);
      }
      onMouseEnter?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      const config = configRef.current;
      if (config.press) {
        animateElement(config.press);
      }
      onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      const config = configRef.current;
      // Return to hover state after press
      if (config.hover) {
        animateElement(config.hover);
      } else {
        resetScale();
      }
      onMouseUp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      resetScale();
      onMouseLeave?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const config = configRef.current;
        if (config.press) {
          animateElement(config.press);
        }
      }
      onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        resetScale();
      }
      onKeyUp?.(e);
    };

    // Build class list
    const classes = [styles.root];
    if (material) {
      classes.push('material', `material-${material}`);
      if (material === 'glass') classes.push('material-glass-surface');
    }
    if (elevation !== undefined) {
      classes.push('cast-shadow');
    }
    if (className) classes.push(className);

    // Build style with elevation
    const combinedStyle: React.CSSProperties = {
      ...style,
      ...(elevation !== undefined && ({ '--elevation': elevation * 4 } as React.CSSProperties)),
    };

    return (
      <Comp
        ref={internalRef}
        type={asChild ? undefined : type}
        className={classes.join(' ')}
        style={combinedStyle}
        data-variant={variant}
        data-size={size}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
