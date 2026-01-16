'use client';

import * as React from 'react';
import { Checkbox as RadixCheckbox } from 'radix-ui';
import { animate, spring } from 'animejs';
import { Icon } from '../Icon/Icon';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  className?: string;
  /** Icon name to use for the check indicator (requires IconProvider) */
  icon?: string;
}

const CheckboxRoot = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, icon = 'check', children, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const isFirstRender = React.useRef(true);
  const isPressing = React.useRef(false);

  // Set initial indicator state
  React.useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      el.style.opacity = isChecked ? '1' : '0';
      el.style.transform = isChecked ? 'scale(1)' : 'scale(0.5)';
    }
  }, []);

  const animateIndicator = (toChecked: boolean) => {
    const el = indicatorRef.current;
    if (!el) return;

    if (toChecked) {
      animate(el, {
        opacity: [0, 1],
        scale: [0.5, 1],
        ease: spring({ mass: 0.8, stiffness: 500, damping: 15 }),
      });
    } else {
      animate(el, {
        opacity: [1, 0],
        scale: [1, 0.5],
        duration: 150,
        ease: 'outQuad',
      });
    }
  };

  const handleMouseDown = () => {
    const root = rootRef.current;
    if (!root || props.disabled) return;

    isPressing.current = true;
    animate(root, {
      scale: 0.9,
      duration: 100,
      ease: 'outQuad',
    });
  };

  const handleMouseUp = () => {
    const root = rootRef.current;
    if (!root || !isPressing.current || props.disabled) return;

    isPressing.current = false;

    // Animate root back with bounce
    animate(root, {
      scale: 1,
      ease: spring({ mass: 0.6, stiffness: 500, damping: 12 }),
    });
  };

  const handleClick = () => {
    if (props.disabled) return;

    // Toggle and animate indicator
    const newChecked = !isChecked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    animateIndicator(newChecked);
  };

  const handleMouseLeave = () => {
    const root = rootRef.current;
    if (!root || !isPressing.current) return;

    isPressing.current = false;
    animate(root, {
      scale: 1,
      duration: 100,
      ease: 'outQuad',
    });
  };

  return (
    <span
      className={styles.wrapper}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <RadixCheckbox.Root
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`${styles.root} ${className || ''}`}
        checked={isControlled ? checked : internalChecked}
        onCheckedChange={() => {}} // We handle this ourselves
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
    </span>
  );
});
CheckboxRoot.displayName = 'Checkbox.Root';

export const Checkbox = {
  Root: CheckboxRoot,
};
