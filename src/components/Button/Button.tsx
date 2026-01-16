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
import { defaultAnimations, type InteractiveAnimate, type Animation } from '../../animation/types';
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

/**
 * Extract the "from" value (neutral/reset state) from an interactive animation config.
 * For animations using [from, to] syntax, returns the first value.
 */
function getResetScale(
  animation: InteractiveAnimate['hover'] | undefined,
  defaultValue: number = 1
): number {
  if (!animation || typeof animation === 'boolean') return defaultValue;

  const scaleConfig = animation.scale;
  if (!scaleConfig) return defaultValue;

  // Per-property syntax: { value: [from, to], easing }
  if (typeof scaleConfig === 'object' && 'value' in scaleConfig) {
    const val = scaleConfig.value;
    if (Array.isArray(val)) {
      return val[0] as number;
    }
  }

  // Direct array: [from, to]
  if (Array.isArray(scaleConfig)) {
    return scaleConfig[0] as number;
  }

  return defaultValue;
}

/**
 * Convert an interactive animation config to use only "to" values.
 * Interactive animations should animate FROM current state TO target,
 * not from a fixed starting point (which would cause visual snaps on repeated triggers).
 */
function toInteractiveAnimation(
  animation: Animation
): Animation {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(animation)) {
    if (value === undefined) continue;

    // Per-property syntax: { value: [from, to], easing } -> { value: to, easing }
    if (typeof value === 'object' && value !== null && 'value' in value) {
      const inner = (value as { value: unknown; easing?: string }).value;
      const easing = (value as { value: unknown; easing?: string }).easing;
      if (Array.isArray(inner)) {
        // Extract "to" value (last element)
        result[key] = { value: inner[inner.length - 1], easing };
      } else {
        result[key] = value;
      }
    }
    // Direct array: [from, to] -> to
    else if (Array.isArray(value)) {
      result[key] = value[value.length - 1];
    }
    // Simple value or other property (easing, duration, etc.)
    else {
      result[key] = value;
    }
  }

  return result as Animation;
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
      if (!internalRef.current || !animation || typeof animation === 'boolean') return;

      // Convert [from, to] arrays to just "to" values for smooth interactive animations
      const processed = toInteractiveAnimation(animation);
      const params = prefersReducedMotion()
        ? toInstantParams(processed)
        : toAnimeParams(processed);
      animateWithCancel(internalRef.current, params);
    };

    const resetScale = () => {
      if (!internalRef.current) return;
      const config = configRef.current;
      // Get the neutral/from value from hover config (or press as fallback)
      const neutralScale = getResetScale(config.hover) ?? getResetScale(config.press) ?? 1;
      animateWithCancel(internalRef.current, {
        scale: neutralScale,
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
