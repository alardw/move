'use client';

import * as React from 'react';
import { animate, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { useAccordion } from './useAccordion';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
  getInitialStyles,
} from '../../../animation/utils';
import {
  defaultAnimations,
  type ExpandableAnimate,
  type InteractiveAnimate,
  type Animation,
  type StaggerConfig,
} from '../../../animation/types';
import acStyles from './Accordion.module.css';

// ============================================================================
// Context
// ============================================================================

interface AccordionContextValue {
  stagger?: StaggerConfig;
  enterAnimation?: Animation;
  getItemIndex: () => number;
  animatingOutItems: Set<string>;
  animatingInItems: Set<string>;
  isAnimatingOut: (value: string) => boolean;
  isAnimatingIn: (value: string) => boolean;
  onExitComplete: (value: string) => void;
  onEnterComplete: (value: string) => void;
  contentAnimate: ExpandableAnimate;
  isItemActive: (value: string) => boolean;
  onHeaderClick: (value: string) => void;
  onHeaderKeyDown: (e: React.KeyboardEvent, value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within Accordion.Root');
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isActive: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error('Accordion.Content must be used within Accordion.Item');
  return context;
}

// ============================================================================
// Root
// ============================================================================

export interface AccordionAnimateConfig {
  enter?: Animation;
  stagger?: StaggerConfig;
  content?: ExpandableAnimate;
}

export interface AccordionRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  animate?: AccordionAnimateConfig | false;
  pt?: PassThrough<'root'>;
}

const defaultRootAnimation: AccordionAnimateConfig = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.9, 1], easing: 'poppy' },
  },
  stagger: { delay: 80 },
  content: defaultAnimations.expandable,
};

const AccordionRoot = withMoveComponent<'root', AccordionRootProps, HTMLDivElement>({
  name: 'Accordion',
  styles: acStyles,
  slots: ['root'] as const,
  defaults: { type: 'single', collapsible: true },
  moveProps: ['type', 'value', 'defaultValue', 'onValueChange', 'collapsible', 'animate'],

  setup({ props, ref, cx, ptm, attrs }) {
    const {
      className,
      style,
      children,
      type,
      value: controlledValue,
      defaultValue,
      onValueChange,
      animate: animateProp,
    } = props;

    const multiple = type === 'multiple';
    const itemIndexRef = React.useRef(0);

    // Headless accordion state
    const accordion = useAccordion({
      value: controlledValue as string | string[] | undefined,
      defaultValue: defaultValue as string | string[] | undefined,
      multiple,
      onValueChange: onValueChange as ((value: string | string[]) => void) | undefined,
    });

    // Animation coordination — computed synchronously during render
    // to avoid a frame where content unmounts before animatingOut is set
    const animatingOutRef = React.useRef<Set<string>>(new Set());
    const animatingInRef = React.useRef<Set<string>>(new Set());
    const [, forceRender] = React.useState(0);
    const prevValueRef = React.useRef<string | string[] | undefined>(undefined);

    const config = animateProp === false
      ? { enter: undefined, stagger: undefined, content: {} as ExpandableAnimate }
      : mergeAnimateConfig(defaultRootAnimation, animateProp as AccordionAnimateConfig | undefined);

    const getItemIndex = React.useCallback(() => itemIndexRef.current++, []);

    React.useEffect(() => { itemIndexRef.current = 0; });

    // Detect opening/closing items synchronously during render
    const prev = prevValueRef.current;
    const current = accordion.value;
    if (prev !== undefined && prev !== current) {
      if (multiple) {
        const prevArr = Array.isArray(prev) ? prev : [];
        const currArr = Array.isArray(current) ? current : [];
        const closing = prevArr.filter(v => !currArr.includes(v));
        const opening = currArr.filter(v => !prevArr.includes(v));

        closing.forEach(v => { animatingOutRef.current.add(v); animatingInRef.current.delete(v); });
        opening.forEach(v => { animatingInRef.current.add(v); animatingOutRef.current.delete(v); });
      } else {
        const prevStr = typeof prev === 'string' ? prev : '';
        const currStr = typeof current === 'string' ? current : '';

        if (prevStr && prevStr !== currStr) {
          animatingOutRef.current.add(prevStr);
          animatingInRef.current.delete(prevStr);
        }
        if (currStr && currStr !== prevStr) {
          animatingInRef.current.add(currStr);
          animatingOutRef.current.delete(currStr);
        }
      }
    }
    prevValueRef.current = current;

    const animatingOutItems = animatingOutRef.current;
    const animatingInItems = animatingInRef.current;

    const onExitComplete = React.useCallback((v: string) => {
      animatingOutRef.current.delete(v);
      forceRender(c => c + 1);
    }, []);

    const onEnterComplete = React.useCallback((v: string) => {
      animatingInRef.current.delete(v);
      forceRender(c => c + 1);
    }, []);

    const contextValue: AccordionContextValue = {
      stagger: config.stagger,
      enterAnimation: config.enter,
      getItemIndex,
      animatingOutItems,
      animatingInItems,
      isAnimatingOut: (v) => animatingOutItems.has(v),
      isAnimatingIn: (v) => animatingInItems.has(v),
      onExitComplete,
      onEnterComplete,
      contentAnimate: config.content || defaultAnimations.expandable,
      isItemActive: accordion.isItemActive,
      onHeaderClick: accordion.onHeaderClick,
      onHeaderKeyDown: accordion.onHeaderKeyDown,
    };

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        return (
          <AccordionContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...ptRest}
              ref={ref}
              className={cx('root', className, ptClass as string | undefined)}
              style={{ ...style, ...(ptStyle as React.CSSProperties) }}
              data-move-accordion-root=""
            >
              {children}
            </div>
          </AccordionContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface AccordionItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  pt?: PassThrough<'item'>;
}

const AccordionItem = withMoveComponent<'item', AccordionItemProps, HTMLDivElement>({
  name: 'AccordionItem',
  styles: acStyles,
  slots: ['item'] as const,
  moveProps: ['value'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { className, style, children, value } = props;
    const context = useAccordionContext();
    const indexRef = React.useRef<number | null>(null);
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const hasAnimated = React.useRef(false);

    if (indexRef.current === null) {
      indexRef.current = context.getItemIndex();
    }

    const isActive = context.isItemActive(value as string) || context.isAnimatingOut(value as string);

    const mergedRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    // Stagger enter animation
    const initialStyles = React.useMemo(() => {
      if (!context.enterAnimation) return {};
      return getInitialStyles(context.enterAnimation);
    }, [context.enterAnimation]);

    React.useEffect(() => {
      const el = itemRef.current;
      if (!el || !context.enterAnimation || hasAnimated.current) return;

      hasAnimated.current = true;
      const reducedMotion = prefersReducedMotion();
      const index = indexRef.current ?? 0;
      const delay = (context.stagger?.delay ?? 0) * index;

      if (reducedMotion) {
        el.style.opacity = '1';
        el.style.transform = '';
        return;
      }

      const params = toAnimeParams(context.enterAnimation);
      animate(el, { ...params, delay });
    }, [context.enterAnimation, context.stagger]);

    return {
      render() {
        const itemPt = ptm('item');
        const { className: ptClass, style: ptStyle, ...ptRest } = itemPt as Record<string, unknown>;
        return (
          <AccordionItemContext.Provider value={{ value: value as string, isActive }}>
            <div
              {...attrs}
              {...ptRest}
              ref={mergedRef}
              className={cx('item', className, ptClass as string | undefined)}
              style={{ ...initialStyles, ...style, ...(ptStyle as React.CSSProperties) }}
              data-state={isActive ? 'open' : 'closed'}
            >
              {children}
            </div>
          </AccordionItemContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Header
// ============================================================================

export interface AccordionHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'header'>;
}

const AccordionHeader = withMoveComponent<'header', AccordionHeaderProps, HTMLDivElement>({
  name: 'AccordionHeader',
  styles: acStyles,
  slots: ['header'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const headerPt = ptm('header');
        const { className: ptClass, style: ptStyle, ...ptRest } = headerPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('header', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Trigger
// ============================================================================

export interface AccordionTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  animate?: Pick<InteractiveAnimate, 'hover'> | false;
  pt?: PassThrough<'trigger' | 'icon'>;
}

const defaultTriggerAnimation: Pick<InteractiveAnimate, 'hover'> = {
  hover: { scale: 1.005, easing: 'snappy' },
};

const triggerAnimations = new WeakMap<HTMLElement, JSAnimation>();

const AccordionTrigger = withMoveComponent<'trigger' | 'icon', AccordionTriggerProps, HTMLButtonElement>({
  name: 'AccordionTrigger',
  styles: acStyles,
  slots: ['trigger', 'icon'] as const,
  moveProps: ['icon', 'animate'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { className, style, children, icon, animate: animateProp } = props;
    const context = useAccordionContext();
    const itemContext = useAccordionItemContext();
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const iconRef = React.useRef<HTMLSpanElement>(null);
    const iconAnimRef = React.useRef<JSAnimation | null>(null);

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, triggerRef);

    const config = animateProp === false
      ? { hover: false as const }
      : mergeAnimateConfig(defaultTriggerAnimation, animateProp as Pick<InteractiveAnimate, 'hover'> | undefined);

    const handleMouseEnter = () => {
      if (!triggerRef.current || !config.hover || typeof config.hover === 'boolean') return;
      const existing = triggerAnimations.get(triggerRef.current);
      if (existing) existing.pause();
      const params = prefersReducedMotion() ? toInstantParams(config.hover) : toAnimeParams(config.hover);
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

    // Icon rotation
    React.useEffect(() => {
      const trigger = triggerRef.current;
      const iconEl = iconRef.current;
      if (!trigger || !iconEl) return;

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
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
        }
      });

      observer.observe(trigger, { attributes: true });
      return () => observer.disconnect();
    }, []);

    return {
      render() {
        const triggerPt = ptm('trigger');
        const iconPt = ptm('icon');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;
        const { className: iconPtClass, style: iconPtStyle, ...iconPtRest } = iconPt as Record<string, unknown>;

        return (
          <button
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type="button"
            className={cx('trigger', className, ptClass as string | undefined)}
            style={{ ...style, ...(ptStyle as React.CSSProperties) }}
            data-state={itemContext.isActive ? 'open' : 'closed'}
            data-value={itemContext.value}
            data-move-accordion-trigger=""
            aria-expanded={itemContext.isActive}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => context.onHeaderClick(itemContext.value)}
            onKeyDown={(e) => context.onHeaderKeyDown(e, itemContext.value)}
          >
            {children}
            <span
              {...iconPtRest}
              ref={iconRef}
              className={cx('icon', iconPtClass as string | undefined)}
              style={iconPtStyle as React.CSSProperties}
            >
              {icon ?? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              )}
            </span>
          </button>
        );
      },
    };
  },
});

// ============================================================================
// Content
// ============================================================================

export interface AccordionContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'content' | 'contentInner'>;
}

// Track content animations
const contentAnimTracker = new WeakMap<HTMLElement, { height?: JSAnimation; opacity?: JSAnimation }>();

const AccordionContent = withMoveComponent<'content' | 'contentInner', AccordionContentProps, HTMLDivElement>({
  name: 'AccordionContent',
  styles: acStyles,
  slots: ['content', 'contentInner'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    const { className, style, children } = props;
    const context = useAccordionContext();
    const itemContext = useAccordionItemContext();

    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    const config = context.contentAnimate;
    const isAnimatingIn = context.isAnimatingIn(itemContext.value);
    const isAnimatingOut = context.isAnimatingOut(itemContext.value);

    // Enter animation
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
      const anims = contentAnimTracker.get(content) || {};
      if (anims.height) anims.height.pause();
      if (anims.opacity) anims.opacity.pause();

      if (reducedMotion) {
        content.style.height = 'auto';
        inner.style.opacity = '1';
        context.onEnterComplete(itemContext.value);
        return;
      }

      content.style.height = '0px';
      inner.style.opacity = '0';
      content.style.height = 'auto';
      const targetHeight = content.scrollHeight;
      content.style.height = '0px';

      const heightParams = toAnimeParams({
        height: config.open.height,
        easing: config.open.easing,
        duration: config.open.duration,
      });

      let heightDone = false;
      let opacityDone = false;
      const checkComplete = () => {
        if (heightDone && opacityDone) {
          content.style.height = 'auto';
          context.onEnterComplete(itemContext.value);
        }
      };

      const enterDuration = (heightParams.duration as number) || 400;

      anims.height = animate(content, {
        height: [0, targetHeight],
        ease: heightParams.ease || 'outQuart',
        duration: enterDuration,
        onComplete: () => { heightDone = true; checkComplete(); },
      });

      const currentOpacity = parseFloat(getComputedStyle(inner).opacity) || 0;
      anims.opacity = animate(inner, {
        opacity: [currentOpacity, 1],
        delay: currentOpacity > 0 ? 0 : 150,
        duration: currentOpacity > 0 ? (enterDuration * (1 - currentOpacity)) : (enterDuration - 150),
        ease: 'linear',
        onComplete: () => { opacityDone = true; checkComplete(); },
      });

      contentAnimTracker.set(content, anims);
    }, [isAnimatingIn]); // eslint-disable-line react-hooks/exhaustive-deps

    // Exit animation
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner || !isAnimatingOut) return;

      if (!config.close) {
        context.onExitComplete(itemContext.value);
        return;
      }

      const reducedMotion = prefersReducedMotion();
      const anims = contentAnimTracker.get(content) || {};
      if (anims.height) anims.height.pause();
      if (anims.opacity) anims.opacity.pause();

      if (reducedMotion) {
        content.style.height = '0px';
        inner.style.opacity = '0';
        context.onExitComplete(itemContext.value);
        return;
      }

      const currentHeight = content.scrollHeight;
      content.style.height = `${currentHeight}px`;

      const heightParams = toAnimeParams({
        height: config.close.height,
        easing: config.close.easing,
        duration: config.close.duration,
      });

      const exitDuration = (heightParams.duration as number) || 300;

      const currentOpacity = parseFloat(getComputedStyle(inner).opacity) || 1;
      anims.opacity = animate(inner, {
        opacity: [currentOpacity, 0],
        duration: exitDuration * 0.4 * currentOpacity,
        ease: 'linear',
      });

      anims.height = animate(content, {
        height: [currentHeight, 0],
        ease: heightParams.ease || 'outQuart',
        duration: exitDuration,
        onComplete: () => context.onExitComplete(itemContext.value),
      });

      contentAnimTracker.set(content, anims);
    }, [isAnimatingOut]); // eslint-disable-line react-hooks/exhaustive-deps

    // Set initial state on mount
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;

      if (!itemContext.isActive) {
        content.style.height = '0px';
        inner.style.opacity = '0';
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Render only when active or animating out
    const shouldRender = itemContext.isActive || isAnimatingOut;

    return {
      render() {
        const contentPt = ptm('content');
        const innerPt = ptm('contentInner');

        if (!shouldRender) return null;

        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;
        const { className: innerPtClass, style: innerPtStyle, ...innerPtRest } = innerPt as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            className={cx('content', className, ptClass as string | undefined)}
            style={{ ...style, ...(ptStyle as React.CSSProperties) }}
            data-state={itemContext.isActive ? 'open' : 'closed'}
            role="region"
          >
            <div
              {...innerPtRest}
              ref={innerRef}
              className={cx('contentInner', innerPtClass as string | undefined)}
              style={innerPtStyle as React.CSSProperties}
            >
              {children}
            </div>
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
