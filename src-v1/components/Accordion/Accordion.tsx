'use client';

import * as React from 'react';
import { Accordion as RadixAccordion } from 'radix-ui';
import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import { animate, type JSAnimation } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
  getInitialStyles,
} from '../../animation/utils';
import {
  defaultAnimations,
  type ExpandableAnimate,
  type InteractiveAnimate,
  type Animation,
  type StaggerConfig,
} from '../../animation/types';
import styles from './Accordion.module.css';

// ============================================================================
// Context
// ============================================================================

interface AccordionContextValue {
  // Stagger animation for items
  stagger?: StaggerConfig;
  enterAnimation?: Animation;
  getItemIndex: () => number;

  // Animation coordination (like AlertDialog)
  animatingOutItems: Set<string>;
  animatingInItems: Set<string>;
  isAnimatingOut: (value: string) => boolean;
  isAnimatingIn: (value: string) => boolean;
  onExitComplete: (value: string) => void;
  onEnterComplete: (value: string) => void;
  registerAnimatedElement: (value: string) => void;
  unregisterAnimatedElement: (value: string) => void;

  // Content animation config
  contentAnimate: ExpandableAnimate;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion.Root');
  }
  return context;
}

// ============================================================================
// Item Context (to pass value to Content)
// ============================================================================

interface AccordionItemContextValue {
  value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion.Content must be used within Accordion.Item');
  }
  return context;
}

// ============================================================================
// Root
// ============================================================================

export interface AccordionAnimateConfig {
  /** Animation when items enter/mount */
  enter?: Animation;
  /** Stagger configuration for item entry animations */
  stagger?: StaggerConfig;
  /** Animation config for content open/close */
  content?: ExpandableAnimate;
}

interface AccordionRootBaseProps {
  className?: string;
  /** Animation configuration */
  animate?: AccordionAnimateConfig | false;
  children?: React.ReactNode;
}

interface AccordionSingleProps extends AccordionRootBaseProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}

interface AccordionMultipleProps extends AccordionRootBaseProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

const defaultRootAnimation: AccordionAnimateConfig = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.95, 1], easing: 'snappy' },
  },
  stagger: { delay: 50 },
  content: defaultAnimations.expandable,
};

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  (props, ref) => {
    const {
      className,
      animate: animateProp,
      type,
      value: controlledValue,
      defaultValue,
      onValueChange: onValueChangeProp,
      children,
      ...rest
    } = props as AccordionRootBaseProps & {
      type: 'single' | 'multiple';
      value?: string | string[];
      defaultValue?: string | string[];
      onValueChange?: ((value: string) => void) | ((value: string[]) => void);
      collapsible?: boolean;
    };

    const itemIndexRef = React.useRef(0);

    // Track which items are animating out or in
    const [animatingOutItems, setAnimatingOutItems] = React.useState<Set<string>>(new Set());
    const [animatingInItems, setAnimatingInItems] = React.useState<Set<string>>(new Set());
    const registeredElements = React.useRef<Map<string, number>>(new Map());
    const prevValueRef = React.useRef<string | string[] | undefined>(undefined);

    // Internal value state
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[] | undefined>(
      defaultValue
    );
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    // Compute radix value: keep animating-out items open
    const radixValue = React.useMemo(() => {
      if (type === 'single') {
        const currentValue = value as string | undefined;
        // If current value is animating out, keep it in radix
        if (currentValue && animatingOutItems.has(currentValue)) {
          return currentValue;
        }
        // Also include any animating out items
        const animatingOut = Array.from(animatingOutItems)[0];
        if (animatingOut && !currentValue) {
          return animatingOut;
        }
        return currentValue || '';
      } else {
        const currentValues = (value as string[] | undefined) || [];
        // Include both current values and animating out items
        return [...new Set([...currentValues, ...animatingOutItems])];
      }
    }, [type, value, animatingOutItems]);

    const config =
      animateProp === false
        ? { enter: undefined, stagger: undefined, content: {} }
        : mergeAnimateConfig(defaultRootAnimation, animateProp);

    const getItemIndex = React.useCallback(() => {
      return itemIndexRef.current++;
    }, []);

    // Reset index on each render
    React.useEffect(() => {
      itemIndexRef.current = 0;
    });

    const isAnimatingOut = React.useCallback(
      (itemValue: string) => animatingOutItems.has(itemValue),
      [animatingOutItems]
    );

    const isAnimatingIn = React.useCallback(
      (itemValue: string) => animatingInItems.has(itemValue),
      [animatingInItems]
    );

    const registerAnimatedElement = React.useCallback((itemValue: string) => {
      const count = registeredElements.current.get(itemValue) || 0;
      registeredElements.current.set(itemValue, count + 1);
    }, []);

    const unregisterAnimatedElement = React.useCallback((itemValue: string) => {
      const count = registeredElements.current.get(itemValue) || 0;
      if (count <= 1) {
        registeredElements.current.delete(itemValue);
      } else {
        registeredElements.current.set(itemValue, count - 1);
      }
    }, []);

    const onExitComplete = React.useCallback((itemValue: string) => {
      setAnimatingOutItems((prev) => {
        const next = new Set(prev);
        next.delete(itemValue);
        return next;
      });
    }, []);

    const onEnterComplete = React.useCallback((itemValue: string) => {
      setAnimatingInItems((prev) => {
        const next = new Set(prev);
        next.delete(itemValue);
        return next;
      });
    }, []);

    // Handle value change from Radix
    const handleValueChange = React.useCallback(
      (newValue: string | string[]) => {
        if (type === 'single') {
          const newSingleValue = newValue as string;
          const oldSingleValue = value as string | undefined;

          // Check if an item is being closed
          if (oldSingleValue && oldSingleValue !== newSingleValue) {
            // Start animating out the old value
            setAnimatingOutItems((prev) => new Set(prev).add(oldSingleValue));
          }

          // Check if an item is being opened
          if (newSingleValue && newSingleValue !== oldSingleValue) {
            // Start animating in the new value
            setAnimatingInItems((prev) => new Set(prev).add(newSingleValue));
          }

          // Update value immediately for opening
          if (!isControlled) {
            setUncontrolledValue(newSingleValue);
          }
          (onValueChangeProp as ((value: string) => void) | undefined)?.(newSingleValue);
        } else {
          const newMultipleValue = newValue as string[];
          const oldMultipleValue = (value as string[] | undefined) || [];

          // Find items being closed
          const closingItems = oldMultipleValue.filter((v) => !newMultipleValue.includes(v));
          if (closingItems.length > 0) {
            setAnimatingOutItems((prev) => {
              const next = new Set(prev);
              closingItems.forEach((v) => next.add(v));
              return next;
            });
          }

          // Find items being opened
          const openingItems = newMultipleValue.filter((v) => !oldMultipleValue.includes(v));
          if (openingItems.length > 0) {
            setAnimatingInItems((prev) => {
              const next = new Set(prev);
              openingItems.forEach((v) => next.add(v));
              return next;
            });
          }

          // Update value immediately
          if (!isControlled) {
            setUncontrolledValue(newMultipleValue);
          }
          (onValueChangeProp as ((value: string[]) => void) | undefined)?.(newMultipleValue);
        }
      },
      [type, value, isControlled, onValueChangeProp]
    );

    const contextValue: AccordionContextValue = {
      stagger: config.stagger,
      enterAnimation: config.enter,
      getItemIndex,
      animatingOutItems,
      animatingInItems,
      isAnimatingOut,
      isAnimatingIn,
      onExitComplete,
      onEnterComplete,
      registerAnimatedElement,
      unregisterAnimatedElement,
      contentAnimate: config.content || defaultAnimations.expandable,
    };

    if (type === 'single') {
      return (
        <AccordionContext.Provider value={contextValue}>
          <RadixAccordion.Root
            ref={ref}
            type="single"
            className={`${styles.root} ${className || ''}`}
            value={radixValue as string}
            onValueChange={handleValueChange as (value: string) => void}
            collapsible={(props as AccordionSingleProps).collapsible}
            {...rest}
          >
            {children}
          </RadixAccordion.Root>
        </AccordionContext.Provider>
      );
    }

    return (
      <AccordionContext.Provider value={contextValue}>
        <RadixAccordion.Root
          ref={ref}
          type="multiple"
          className={`${styles.root} ${className || ''}`}
          value={radixValue as string[]}
          onValueChange={handleValueChange as (value: string[]) => void}
          {...rest}
        >
          {children}
        </RadixAccordion.Root>
      </AccordionContext.Provider>
    );
  }
);
AccordionRoot.displayName = 'Accordion.Root';

// ============================================================================
// Item
// ============================================================================

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Item> {
  className?: string;
  value: string;
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  AccordionItemProps
>(({ className, style, value, children, ...props }, ref) => {
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const context = useAccordionContext();
  const indexRef = React.useRef<number | null>(null);
  const hasAnimated = React.useRef(false);

  // Get index on first render only
  if (indexRef.current === null) {
    indexRef.current = context.getItemIndex();
  }

  // Calculate initial styles for stagger animation
  const initialStyles = React.useMemo(() => {
    if (!context.enterAnimation) return {};
    return getInitialStyles(context.enterAnimation);
  }, [context.enterAnimation]);

  // Stagger enter animation
  React.useEffect(() => {
    const el = itemRef.current;
    if (!el || !context.enterAnimation || hasAnimated.current) return;

    hasAnimated.current = true;
    const reducedMotion = prefersReducedMotion();
    const index = indexRef.current ?? 0;
    const staggerDelay = context.stagger?.delay ?? 0;
    const delay = index * staggerDelay;

    if (reducedMotion) {
      el.style.opacity = '1';
      el.style.transform = '';
      return;
    }

    const params = toAnimeParams(context.enterAnimation);
    animate(el, {
      ...params,
      delay,
    });
  }, [context.enterAnimation, context.stagger]);

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <RadixAccordion.Item
        ref={(node) => {
          itemRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`${styles.item} ${className || ''}`}
        style={{ ...initialStyles, ...style }}
        value={value}
        {...props}
      >
        {children}
      </RadixAccordion.Item>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = 'Accordion.Item';

// ============================================================================
// Header
// ============================================================================

export interface AccordionHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixAccordion.Header>, 'asChild'> {
  className?: string;
}

const AccordionHeader = React.forwardRef<HTMLDivElement, AccordionHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <RadixAccordion.Header asChild {...props}>
      <div ref={ref} className={`${styles.header} ${className || ''}`}>
        {children}
      </div>
    </RadixAccordion.Header>
  )
);
AccordionHeader.displayName = 'Accordion.Header';

// ============================================================================
// Trigger
// ============================================================================

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> {
  className?: string;
  icon?: React.ReactNode;
  /** Animation configuration for hover interaction */
  animate?: Pick<InteractiveAnimate, 'hover'> | false;
}

const defaultTriggerAnimation: Pick<InteractiveAnimate, 'hover'> = {
  hover: { scale: 1.005, easing: 'snappy' },
};

// Track active animations per element
const triggerAnimations = new WeakMap<HTMLElement, JSAnimation>();

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, animate: animateProp, ...props }, ref) => {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const iconAnimRef = React.useRef<JSAnimation | null>(null);

  const config =
    animateProp === false
      ? { hover: false as const }
      : mergeAnimateConfig(defaultTriggerAnimation, animateProp);

  const handleMouseEnter = () => {
    if (!triggerRef.current || !config.hover || typeof config.hover === 'boolean') return;

    const existing = triggerAnimations.get(triggerRef.current);
    if (existing) existing.pause();

    const params = prefersReducedMotion()
      ? toInstantParams(config.hover)
      : toAnimeParams(config.hover);
    const anim = animate(triggerRef.current, params);
    triggerAnimations.set(triggerRef.current, anim);
  };

  const handleMouseLeave = () => {
    if (!triggerRef.current || !config.hover) return;

    const existing = triggerAnimations.get(triggerRef.current);
    if (existing) existing.pause();

    const anim = animate(triggerRef.current, {
      scale: 1,
      duration: prefersReducedMotion() ? 0 : 150,
      ease: 'outQuad',
    });
    triggerAnimations.set(triggerRef.current, anim);
  };

  // Icon rotation animation
  React.useEffect(() => {
    const trigger = triggerRef.current;
    const iconEl = iconRef.current;
    if (!trigger || !iconEl) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const state = trigger.getAttribute('data-state');
          const targetRotation = state === 'open' ? 180 : 0;

          if (iconAnimRef.current) iconAnimRef.current.pause();

          iconAnimRef.current = animate(iconEl, {
            rotate: targetRotation,
            ease: 'outQuart',
            duration: prefersReducedMotion() ? 0 : 300,
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

// ============================================================================
// Content
// ============================================================================

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Content> {
  className?: string;
}

// Track content animations
const contentAnimations = new WeakMap<HTMLElement, { height?: JSAnimation; opacity?: JSAnimation }>();

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const context = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const config = context.contentAnimate;
  const isAnimatingIn = context.isAnimatingIn(itemContext.value);
  const isAnimatingOut = context.isAnimatingOut(itemContext.value);

  // Register this element for exit coordination
  React.useEffect(() => {
    context.registerAnimatedElement(itemContext.value);
    return () => context.unregisterAnimatedElement(itemContext.value);
  }, [context, itemContext.value]);

  // Enter animation - triggered by isAnimatingIn from context
  React.useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner || !isAnimatingIn) return;

    if (!config.open) {
      content.style.height = 'auto';
      inner.style.opacity = '1';
      context.onEnterComplete(itemContext.value);
      return;
    }

    const reducedMotion = prefersReducedMotion();
    const anims = contentAnimations.get(content) || {};

    // Cancel existing animations
    if (anims.height) anims.height.pause();
    if (anims.opacity) anims.opacity.pause();

    if (reducedMotion) {
      content.style.height = 'auto';
      inner.style.opacity = '1';
      context.onEnterComplete(itemContext.value);
      return;
    }

    // Set initial state for animation
    content.style.height = '0px';
    inner.style.opacity = '0';

    // Measure target height
    content.style.height = 'auto';
    const targetHeight = content.scrollHeight;
    content.style.height = '0px';

    // Animate height first, then opacity
    const heightParams = toAnimeParams({
      height: config.open.height,
      easing: config.open.easing,
      duration: config.open.duration,
    });

    anims.height = animate(content, {
      height: [0, targetHeight],
      ease: heightParams.ease || 'outQuart',
      duration: heightParams.duration || 300,
      onComplete: () => {
        content.style.height = 'auto';

        // Then animate opacity
        const opacityParams = toAnimeParams({
          opacity: config.open!.opacity,
          easing: config.open!.easing,
        });

        anims.opacity = animate(inner, {
          ...opacityParams,
          onComplete: () => {
            context.onEnterComplete(itemContext.value);
          },
        });
        contentAnimations.set(content, anims);
      },
    });

    contentAnimations.set(content, anims);
  }, [isAnimatingIn, config, context, itemContext.value]);

  // Exit animation - triggered by isAnimatingOut from context
  React.useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner || !isAnimatingOut) return;

    if (!config.close) {
      context.onExitComplete(itemContext.value);
      return;
    }

    const reducedMotion = prefersReducedMotion();
    const anims = contentAnimations.get(content) || {};

    // Cancel existing animations
    if (anims.height) anims.height.pause();
    if (anims.opacity) anims.opacity.pause();

    if (reducedMotion) {
      content.style.height = '0px';
      inner.style.opacity = '0';
      context.onExitComplete(itemContext.value);
      return;
    }

    const currentHeight = content.scrollHeight;

    // Animate opacity first, then height
    const opacityParams = toAnimeParams({
      opacity: config.close.opacity,
      easing: config.close.easing,
      duration: config.close.duration,
    });

    anims.opacity = animate(inner, {
      ...opacityParams,
      onComplete: () => {
        // Then animate height
        const heightParams = toAnimeParams({
          height: config.close!.height,
          easing: config.close!.easing,
          duration: config.close!.duration,
        });

        anims.height = animate(content, {
          height: [currentHeight, 0],
          ease: heightParams.ease || 'outQuart',
          duration: heightParams.duration || 200,
          onComplete: () => {
            context.onExitComplete(itemContext.value);
          },
        });

        contentAnimations.set(content, anims);
      },
    });

    contentAnimations.set(content, anims);
  }, [isAnimatingOut, config, context, itemContext.value]);

  // Set initial state on mount
  React.useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    const state = content.getAttribute('data-state');
    if (state === 'closed') {
      content.style.height = '0px';
      inner.style.opacity = '0';
    }
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

// ============================================================================
// Export
// ============================================================================

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
