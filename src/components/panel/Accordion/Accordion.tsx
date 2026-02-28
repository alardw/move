'use client';

import * as React from 'react';
import { animate, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
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
  type ContentAnimate,
  type ElementAnimate,
  type Animation,
  type StaggerConfig,
} from '../../../animation/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
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
  contentAnimate: ContentAnimate;
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

export type AccordionSize = 'sm' | 'md' | 'lg';
export type AccordionVariant = 'default' | 'contained' | 'ghost';

export interface AccordionAnimateConfig {
  enter?: Animation;
  stagger?: StaggerConfig;
  content?: ContentAnimate;
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
  size?: AccordionSize;
  variant?: AccordionVariant;
  animate?: AccordionAnimateConfig | false;
  sp?: SlotPropsMap<'root'>;
}

const defaultRootAnimation: AccordionAnimateConfig = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.9, 1], easing: 'poppy' },
  },
  stagger: { delay: 80 },
  content: defaultAnimations.content,
};

const AccordionRoot = withMoveComponent<'root', AccordionRootProps, HTMLDivElement>({
  name: 'Accordion',
  styles: acStyles,
  slots: ['root'] as const,
  defaults: { type: 'single', collapsible: true, size: 'md', variant: 'default' },
  moveProps: ['type', 'value', 'defaultValue', 'onValueChange', 'collapsible', 'size', 'variant', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
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
      collapsible: props.collapsible as boolean | undefined,
      onValueChange: onValueChange as ((value: string | string[]) => void) | undefined,
    });

    // Animation coordination — computed synchronously during render
    // to avoid a frame where content unmounts before animatingOut is set
    const animatingOutRef = React.useRef<Set<string>>(new Set());
    const animatingInRef = React.useRef<Set<string>>(new Set());
    const [, forceRender] = React.useState(0);
    const prevValueRef = React.useRef<string | string[] | undefined>(undefined);

    const config = animateProp === false
      ? { enter: undefined, stagger: undefined, content: {} as ContentAnimate }
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
      contentAnimate: config.content || defaultAnimations.content,
      isItemActive: accordion.isItemActive,
      onHeaderClick: accordion.onHeaderClick,
      onHeaderKeyDown: accordion.onHeaderKeyDown,
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        return (
          <AccordionContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              data-size={props.size}
              data-variant={props.variant}
              className={cx('root', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'item'>;
}

const AccordionItem = withMoveComponent<'item', AccordionItemProps, HTMLDivElement>({
  name: 'AccordionItem',
  styles: acStyles,
  slots: ['item'] as const,
  moveProps: ['value'],

  setup({ props, ref, cx, sp, attrs }) {
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
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <AccordionItemContext.Provider value={{ value: value as string, isActive }}>
            <div
              {...attrs}
              {...spRest}
              ref={mergedRef}
              className={cx('item', className, spClass as string | undefined)}
              style={{ ...initialStyles, ...style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'header'>;
}

const AccordionHeader = withMoveComponent<'header', AccordionHeaderProps, HTMLDivElement>({
  name: 'AccordionHeader',
  styles: acStyles,
  slots: ['header'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const headerSp = sp('header');
        const { className: spClass, style: spStyle, ...spRest } = headerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  animate?: Pick<ElementAnimate, 'hover'> | false;
  sp?: SlotPropsMap<'trigger' | 'icon'>;
}

const defaultTriggerAnimation: Pick<ElementAnimate, 'hover'> = {
  hover: { scale: 1.005, easing: 'snappy' },
};

const triggerAnimations = new WeakMap<HTMLElement, JSAnimation>();

const AccordionTrigger = withMoveComponent<'trigger' | 'icon', AccordionTriggerProps, HTMLButtonElement>({
  name: 'AccordionTrigger',
  styles: acStyles,
  slots: ['trigger', 'icon'] as const,
  moveProps: ['icon', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, icon, animate: animateProp } = props;
    const context = useAccordionContext();
    const itemContext = useAccordionItemContext();
    const resolvedChevron = useResolvedIcon('chevron-down', 15);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const iconRef = React.useRef<HTMLSpanElement>(null);
    const iconAnimRef = React.useRef<JSAnimation | null>(null);

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, triggerRef);

    const config = animateProp === false
      ? { hover: false as const }
      : mergeAnimateConfig(defaultTriggerAnimation, animateProp as Pick<ElementAnimate, 'hover'> | undefined);

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

    // Icon rotation — synchronised with content animation
    const isClosing = context.isAnimatingOut(itemContext.value);
    const isOpening = context.isAnimatingIn(itemContext.value);

    // Set initial rotation on mount (no animation)
    React.useEffect(() => {
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (context.isItemActive(itemContext.value)) {
        iconEl.style.transform = 'rotate(180deg)';
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Rotate closed together with content collapse
    React.useEffect(() => {
      if (!isClosing) return;
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (iconAnimRef.current) iconAnimRef.current.pause();
      const closeConfig = context.contentAnimate?.close;
      const duration = closeConfig ? (closeConfig.duration || 300) : 0;
      iconAnimRef.current = animate(iconEl, {
        rotate: 0,
        ease: 'outQuart',
        duration: prefersReducedMotion() ? 0 : duration,
      });
    }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    // Rotate open together with content expand
    React.useEffect(() => {
      if (!isOpening) return;
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (iconAnimRef.current) iconAnimRef.current.pause();
      const openConfig = context.contentAnimate?.open;
      const duration = openConfig ? (openConfig.duration || 400) : 0;
      iconAnimRef.current = animate(iconEl, {
        rotate: 180,
        ease: 'outQuart',
        duration: prefersReducedMotion() ? 0 : duration,
      });
    }, [isOpening]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const triggerSp = sp('trigger');
        const iconSp = sp('icon');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        return (
          <button
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type="button"
            className={cx('trigger', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
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
              {...iconSpRest}
              ref={iconRef}
              className={cx('icon', iconSpClass as string | undefined)}
              style={iconSpStyle as React.CSSProperties}
            >
              {icon ?? resolvedChevron}
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
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

// Track content animations
const contentAnimTracker = new WeakMap<HTMLElement, { height?: JSAnimation; opacity?: JSAnimation }>();

const AccordionContent = withMoveComponent<'content' | 'contentInner', AccordionContentProps, HTMLDivElement>({
  name: 'AccordionContent',
  styles: acStyles,
  slots: ['content', 'contentInner'] as const,

  setup({ props, ref, cx, sp, attrs }) {
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
        const contentSp = sp('content');
        const innerSp = sp('contentInner');

        if (!shouldRender) return null;

        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = innerSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('content', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-state={itemContext.isActive ? 'open' : 'closed'}
            role="region"
          >
            <div
              {...innerSpRest}
              ref={innerRef}
              className={cx('contentInner', innerSpClass as string | undefined)}
              style={innerSpStyle as React.CSSProperties}
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
