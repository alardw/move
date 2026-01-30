'use client';

import * as React from 'react';
import { Checkbox as RadixCheckbox } from 'radix-ui';
import { animate, type JSAnimation } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../animation/utils';
import { defaultAnimations, type ToggleableAnimate, type Animation } from '../../animation/types';
import { Icon } from '../Icon/Icon';
import styles from './Checkbox.module.css';

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

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  className?: string;
  /** Icon name to use for the check indicator (requires IconProvider) */
  icon?: string;
  /**
   * Animation configuration for press/checked/unchecked states.
   * Set to false to disable all animations.
   */
  animate?: ToggleableAnimate | false;
}

const CheckboxRoot = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, icon = 'check', children, checked, defaultChecked, onCheckedChange, animate: animateProp, ...props }, ref) => {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const hasInitialized = React.useRef(false);
  const isPressing = React.useRef(false);

  React.useImperativeHandle(ref, () => rootRef.current!);

  // Store config in ref for stable access
  const configRef = React.useRef<ToggleableAnimate>(defaultAnimations.toggleable);
  configRef.current =
    animateProp === false
      ? { press: false, checked: undefined, unchecked: undefined }
      : mergeAnimateConfig(defaultAnimations.toggleable, animateProp);

  // Set initial indicator state (no animation on mount)
  React.useEffect(() => {
    const el = indicatorRef.current;
    if (!el || hasInitialized.current) return;
    hasInitialized.current = true;

    el.style.opacity = isChecked ? '1' : '0';
    el.style.transform = isChecked ? 'scale(1)' : 'scale(0.5)';
  }, []);

  const animateElement = (el: HTMLElement, animation: Animation) => {
    const params = prefersReducedMotion()
      ? toInstantParams(animation)
      : toAnimeParams(animation);
    animateWithCancel(el, params);
  };

  const resetScale = (el: HTMLElement) => {
    animateWithCancel(el, {
      scale: 1,
      duration: prefersReducedMotion() ? 0 : 150,
      ease: 'outQuad',
    });
  };

  const handleMouseDown = () => {
    const root = rootRef.current;
    if (!root || props.disabled) return;

    const config = configRef.current;
    if (!config.press) return;

    isPressing.current = true;
    animateElement(root, config.press);
  };

  const handleMouseUp = () => {
    const root = rootRef.current;
    if (!root || !isPressing.current || props.disabled) return;

    isPressing.current = false;
    resetScale(root);
  };

  const handleCheckedChange = (newChecked: boolean | 'indeterminate') => {
    if (props.disabled || newChecked === 'indeterminate') return;

    const el = indicatorRef.current;
    if (!el) return;

    const config = configRef.current;
    const animation = newChecked ? config.checked : config.unchecked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);

    if (animation) {
      animateElement(el, animation);
    }
  };

  const handleMouseLeave = () => {
    const root = rootRef.current;
    if (!root || !isPressing.current) return;

    isPressing.current = false;
    resetScale(root);
  };

  return (
    <RadixCheckbox.Root
      ref={rootRef}
      className={`${styles.root} ${className || ''}`}
      checked={isControlled ? checked : internalChecked}
      onCheckedChange={handleCheckedChange}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <RadixCheckbox.Indicator
        ref={indicatorRef}
        className={styles.indicator}
        forceMount
      >
        <Icon name={icon} size={18} />
      </RadixCheckbox.Indicator>
      {children}
    </RadixCheckbox.Root>
  );
});
CheckboxRoot.displayName = 'Checkbox.Root';

export const Checkbox = {
  Root: CheckboxRoot,
};
