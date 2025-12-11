'use client';

import * as React from 'react';
import { Accordion as RadixAccordion } from 'radix-ui';
import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import { animate, spring } from 'animejs';
import styles from './Accordion.module.css';

const springs = {
  gentle: { mass: 1, stiffness: 120, damping: 14, velocity: 0 },
  stiff: { mass: 1, stiffness: 400, damping: 28, velocity: 0 },
};

type AccordionSingleProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Root> & {
  type: 'single';
};

type AccordionMultipleProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Root> & {
  type: 'multiple';
};

export type AccordionRootProps = (AccordionSingleProps | AccordionMultipleProps) & {
  className?: string;
};

const AccordionRoot = React.forwardRef<
  HTMLDivElement,
  AccordionRootProps
>(({ className, ...props }, ref) => (
  <RadixAccordion.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
AccordionRoot.displayName = 'Accordion.Root';

export interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Item> {
  className?: string;
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <RadixAccordion.Item
    ref={ref}
    className={`${styles.item} ${className || ''}`}
    {...props}
  />
));
AccordionItem.displayName = 'Accordion.Item';

export interface AccordionHeaderProps extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Header> {
  className?: string;
}

const AccordionHeader = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Header>,
  AccordionHeaderProps
>(({ className, ...props }, ref) => (
  <RadixAccordion.Header
    ref={ref}
    className={`${styles.header} ${className || ''}`}
    {...props}
  />
));
AccordionHeader.displayName = 'Accordion.Header';

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> {
  className?: string;
  icon?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);

  React.useEffect(() => {
    const trigger = triggerRef.current;
    const iconEl = iconRef.current;
    if (!trigger || !iconEl) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const state = trigger.getAttribute('data-state');
          const targetRotation = state === 'open' ? 180 : 0;

          if (animationRef.current) {
            animationRef.current.pause();
          }

          animationRef.current = animate(iconEl, {
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
    <RadixAccordion.Trigger
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      className={`${styles.trigger} ${className || ''}`}
      {...props}
    >
      {children}
      <span ref={iconRef} className={styles.icon}>
        {icon ?? <ChevronDownIcon />}
      </span>
    </RadixAccordion.Trigger>
  );
});
AccordionTrigger.displayName = 'Accordion.Trigger';

export interface AccordionContentProps extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Content> {
  className?: string;
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
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
            ease: spring(springs.stiff),
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
    <RadixAccordion.Content
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
    </RadixAccordion.Content>
  );
});
AccordionContent.displayName = 'Accordion.Content';

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
