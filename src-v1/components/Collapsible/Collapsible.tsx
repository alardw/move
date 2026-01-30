'use client';

import * as React from 'react';
import { Collapsible as RadixCollapsible } from 'radix-ui';
import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import { animate, spring } from 'animejs';
import styles from './Collapsible.module.css';

export interface CollapsibleRootProps extends React.ComponentPropsWithoutRef<typeof RadixCollapsible.Root> {
  className?: string;
}

const CollapsibleRoot = React.forwardRef<
  React.ElementRef<typeof RadixCollapsible.Root>,
  CollapsibleRootProps
>(({ className, ...props }, ref) => (
  <RadixCollapsible.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
CollapsibleRoot.displayName = 'Collapsible.Root';

export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixCollapsible.Trigger> {
  className?: string;
  icon?: React.ReactNode;
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof RadixCollapsible.Trigger>,
  CollapsibleTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const iconAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const scaleAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);

  const springConfig = { mass: 0.6, stiffness: 500, damping: 15, velocity: 0 };

  const handleMouseEnter = () => {
    if (!triggerRef.current) return;
    if (scaleAnimRef.current) scaleAnimRef.current.pause();
    scaleAnimRef.current = animate(triggerRef.current, {
      scale: 1.005,
      ease: spring(springConfig),
    });
  };

  const handleMouseLeave = () => {
    if (!triggerRef.current) return;
    if (scaleAnimRef.current) scaleAnimRef.current.pause();
    scaleAnimRef.current = animate(triggerRef.current, {
      scale: 1,
      ease: spring(springConfig),
      onComplete: () => {
        if (triggerRef.current) {
          triggerRef.current.style.transform = '';
        }
      },
    });
  };

  React.useEffect(() => {
    const trigger = triggerRef.current;
    const iconEl = iconRef.current;
    if (!trigger || !iconEl) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const state = trigger.getAttribute('data-state');
          const targetRotation = state === 'open' ? 180 : 0;

          if (iconAnimRef.current) {
            iconAnimRef.current.pause();
          }

          iconAnimRef.current = animate(iconEl, {
            rotate: targetRotation,
            ease: 'outQuart',
            duration: 300,
          });
        }
      });
    });

    observer.observe(trigger, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <RadixCollapsible.Trigger
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      className={`${styles.trigger} ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      <span ref={iconRef} className={styles.icon}>
        {icon ?? <ChevronDownIcon />}
      </span>
    </RadixCollapsible.Trigger>
  );
});
CollapsibleTrigger.displayName = 'Collapsible.Trigger';

export interface CollapsibleContentProps extends React.ComponentPropsWithoutRef<typeof RadixCollapsible.Content> {
  className?: string;
}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof RadixCollapsible.Content>,
  CollapsibleContentProps
>(({ className, children, ...props }, ref) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const isFirstRender = React.useRef(true);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);

  React.useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const state = content.getAttribute('data-state');
          const targetHeight = state === 'open' ? inner.scrollHeight : 0;

          // Skip animation on first render if closed
          if (isFirstRender.current) {
            isFirstRender.current = false;
            if (state === 'closed') {
              content.style.height = '0px';
              return;
            }
          }

          // Cancel any running animation
          if (animationRef.current) {
            animationRef.current.pause();
          }

          animationRef.current = animate(content, {
            height: [content.offsetHeight, targetHeight],
            opacity: state === 'open' ? [0, 1] : [1, 0],
            ease: 'outQuart',
            duration: 300,
          });
        }
      });
    });

    observer.observe(content, { attributes: true });

    // Set initial state
    const initialState = content.getAttribute('data-state');
    if (initialState === 'closed') {
      content.style.height = '0px';
    }

    return () => observer.disconnect();
  }, []);

  return (
    <RadixCollapsible.Content
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${styles.content} ${className || ''}`}
      forceMount
      {...props}
    >
      <div ref={innerRef} className={styles.contentInner}>
        {children}
      </div>
    </RadixCollapsible.Content>
  );
});
CollapsibleContent.displayName = 'Collapsible.Content';

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
};
