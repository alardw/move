'use client';

import * as React from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import { animate, spring } from 'animejs';
import styles from './RadioGroup.module.css';

export interface RadioGroupRootProps extends React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root> {
  className?: string;
}

const RadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Root>,
  RadioGroupRootProps
>(({ className, ...props }, ref) => (
  <RadixRadioGroup.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
RadioGroupRoot.displayName = 'RadioGroup.Root';

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item> {
  className?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  RadioGroupItemProps
>(({ className, disabled, ...props }, ref) => {
  const itemRef = React.useRef<HTMLButtonElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const isPressing = React.useRef(false);
  const wasChecked = React.useRef(false);

  // Track checked state changes for animation
  React.useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-state') {
          const isNowChecked = item.getAttribute('data-state') === 'checked';
          if (isNowChecked && !wasChecked.current) {
            // Animate indicator in
            const el = indicatorRef.current;
            if (el) {
              animate(el, {
                opacity: [0, 1],
                scale: [0.5, 1],
                ease: spring({ mass: 0.8, stiffness: 500, damping: 15 }),
              });
            }
          } else if (!isNowChecked && wasChecked.current) {
            // Animate indicator out
            const el = indicatorRef.current;
            if (el) {
              animate(el, {
                opacity: [1, 0],
                scale: [1, 0.5],
                duration: 150,
                ease: 'outQuad',
              });
            }
          }
          wasChecked.current = isNowChecked;
        }
      }
    });

    observer.observe(item, { attributes: true });
    wasChecked.current = item.getAttribute('data-state') === 'checked';

    return () => observer.disconnect();
  }, []);

  const handleMouseDown = () => {
    const item = itemRef.current;
    if (!item || disabled) return;

    isPressing.current = true;
    animate(item, {
      scale: 0.9,
      duration: 100,
      ease: 'outQuad',
    });
  };

  const handleMouseUp = () => {
    const item = itemRef.current;
    if (!item || !isPressing.current || disabled) return;

    isPressing.current = false;

    // Animate item back with bounce
    animate(item, {
      scale: 1,
      ease: spring({ mass: 0.6, stiffness: 500, damping: 12 }),
    });
  };

  const handleMouseLeave = () => {
    const item = itemRef.current;
    if (!item || !isPressing.current) return;

    isPressing.current = false;
    animate(item, {
      scale: 1,
      duration: 100,
      ease: 'outQuad',
    });
  };

  const handleClick = () => {
    if (disabled) return;
    // Programmatically click the radio item to trigger Radix's selection
    itemRef.current?.click();
  };

  return (
    <span
      className={styles.wrapper}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <RadixRadioGroup.Item
        ref={(node) => {
          (itemRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`${styles.item} ${className || ''}`}
        disabled={disabled}
        {...props}
      >
        <RadixRadioGroup.Indicator
          ref={indicatorRef}
          className={styles.indicator}
          forceMount
        >
          <span className={styles.dot} />
        </RadixRadioGroup.Indicator>
      </RadixRadioGroup.Item>
    </span>
  );
});
RadioGroupItem.displayName = 'RadioGroup.Item';

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
