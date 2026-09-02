'use client';
// Generated from Accordion.spec.ts

import * as React from 'react';
import { composeHandlers, useMergedRef, withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAccordion } from './useAccordion';
import { resolveAnimationsConfig, expandContent, snappy, useAnimations } from '../../../animation';
import type { Animation, AnimationTrigger } from '../../../animation';
import { useIcon } from '../../../infrastructure/Icon';
import { useSurfaceFlip, SurfaceProvider } from '../../../infrastructure/Surface';
import type { Size } from '../../../shared/types';
import acStyles from './Accordion.module.css';

// ============================================================================
// Context
// ============================================================================

interface AccordionContextValue {
  animatingOutItems: Set<string>;
  animatingInItems: Set<string>;
  isAnimatingOut: (value: string) => boolean;
  isAnimatingIn: (value: string) => boolean;
  onExitComplete: (value: string) => void;
  onEnterComplete: (value: string) => void;
  contentAnimate: { open?: Animation; close?: Animation };
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

/** Re-exported for backwards-compatible imports. Prefer `Size` from
 *  `'move'` directly going forward. */
export type AccordionSize = Size;
export type AccordionVariant = 'default' | 'contained' | 'ghost';

export interface AccordionAnimateConfig {
  content?: { open?: Animation; close?: Animation };
}

export interface AccordionRootProps extends React.HTMLAttributes<HTMLElement> {
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
  animations?: AccordionAnimateConfig | false;
  sp?: SlotPropsMap<'root'>;
}

const defaultRootAnimation: AccordionAnimateConfig = {
  content: expandContent,
};

const AccordionRoot = withMoveComponent<'root', AccordionRootProps, HTMLDivElement>({
  name: 'Accordion',
  styles: acStyles,
  slots: ['root'] as const,
  defaults: { type: 'single', collapsible: true, size: 'md', variant: 'default' },
  moveProps: [
    'type',
    'value',
    'defaultValue',
    'onValueChange',
    'collapsible',
    'size',
    'variant',
    'animations',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const {
      className,
      style,
      children,
      type,
      value: controlledValue,
      defaultValue,
      onValueChange,
      animations: animationsProp,
    } = props;

    const multiple = type === 'multiple';

    const accordion = useAccordion({
      value: controlledValue as string | string[] | undefined,
      defaultValue: defaultValue as string | string[] | undefined,
      multiple,
      collapsible: props.collapsible as boolean | undefined,
      onValueChange: onValueChange as ((value: string | string[]) => void) | undefined,
    });

    const animatingOutRef = React.useRef<Set<string>>(new Set());
    const animatingInRef = React.useRef<Set<string>>(new Set());
    const [, forceRender] = React.useState(0);
    const prevValueRef = React.useRef<string | string[] | undefined>(undefined);

    const config =
      animationsProp === false
        ? { content: {} as { open?: Animation; close?: Animation } }
        : ((animationsProp as AccordionAnimateConfig | undefined) ?? defaultRootAnimation);

    const prev = prevValueRef.current;
    const current = accordion.value;
    if (prev !== undefined && prev !== current) {
      if (multiple) {
        const prevArr = Array.isArray(prev) ? prev : [];
        const currArr = Array.isArray(current) ? current : [];
        const closing = prevArr.filter((v) => !currArr.includes(v));
        const opening = currArr.filter((v) => !prevArr.includes(v));

        closing.forEach((v) => {
          animatingOutRef.current.add(v);
          animatingInRef.current.delete(v);
        });
        opening.forEach((v) => {
          animatingInRef.current.add(v);
          animatingOutRef.current.delete(v);
        });
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
      forceRender((c) => c + 1);
    }, []);

    const onEnterComplete = React.useCallback((v: string) => {
      animatingInRef.current.delete(v);
      forceRender((c) => c + 1);
    }, []);

    const contextValue: AccordionContextValue = {
      animatingOutItems,
      animatingInItems,
      isAnimatingOut: (v) => animatingOutItems.has(v),
      isAnimatingIn: (v) => animatingInItems.has(v),
      onExitComplete,
      onEnterComplete,
      contentAnimate: config.content || expandContent,
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

export interface AccordionItemProps extends React.HTMLAttributes<HTMLElement> {
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

    const isActive =
      context.isItemActive(value as string) || context.isAnimatingOut(value as string);

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <AccordionItemContext.Provider value={{ value: value as string, isActive }}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('item', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
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

export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = headerSp as Record<string, unknown>;
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

export interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'trigger' | 'icon'>;
}

const DEFAULT_TRIGGER_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Trigger.hover',
    sequence: [{ animation: { scale: { from: 1, to: 1.005, ease: snappy } } }],
  },
];

const AccordionTrigger = withMoveComponent<
  'trigger' | 'icon',
  AccordionTriggerProps,
  HTMLButtonElement
>({
  name: 'AccordionTrigger',
  styles: acStyles,
  slots: ['trigger', 'icon'] as const,
  moveProps: ['icon', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, icon, animations: animationsProp } = props;
    const context = useAccordionContext();
    const itemContext = useAccordionItemContext();
    const resolvedChevron = useIcon('expand', 15);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const iconRef = React.useRef<HTMLSpanElement>(null);

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, triggerRef);

    const animConfig =
      (animationsProp as AnimationTrigger[] | false | undefined) === false
        ? null
        : resolveAnimationsConfig(
            DEFAULT_TRIGGER_ANIMATIONS,
            animationsProp as AnimationTrigger[] | undefined,
          );

    const isClosing = context.isAnimatingOut(itemContext.value);
    const isOpening = context.isAnimatingIn(itemContext.value);

    // Icon rotation durations synced to content animation
    const closeDuration = context.contentAnimate?.close
      ? (context.contentAnimate.close.height as any)?.duration || 300
      : 0;
    const openDuration = context.contentAnimate?.open
      ? (context.contentAnimate.open.height as any)?.duration || 400
      : 0;

    // Combined trigger + icon animation config
    const iconConfig: AnimationTrigger[] = React.useMemo(
      () => [
        {
          trigger: 'icon-open',
          deps: [isOpening],
          sequence: isOpening
            ? [
                {
                  target: 'Icon',
                  animation: {
                    rotate: { from: 0, to: 180, ease: 'outQuart', duration: openDuration },
                  },
                },
              ]
            : false,
        },
        {
          trigger: 'icon-close',
          deps: [isClosing],
          sequence: isClosing
            ? [
                {
                  target: 'Icon',
                  animation: {
                    rotate: { from: 180, to: 0, ease: 'outQuart', duration: closeDuration },
                  },
                },
              ]
            : false,
        },
      ],
      [isOpening, isClosing, openDuration, closeDuration],
    );

    const triggerRefs = React.useMemo(
      () => ({
        Trigger: triggerRef as React.RefObject<HTMLElement | null>,
        Icon: iconRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    // Merge trigger hover config with icon rotation config
    const mergedConfig = React.useMemo(() => {
      const all: AnimationTrigger[] = [...iconConfig];
      if (animConfig) all.push(...animConfig);
      return all;
    }, [animConfig, iconConfig]);

    const { handlers } = useAnimations(mergedConfig, triggerRefs);

    // Set initial icon rotation on mount (no animation)
    React.useEffect(() => {
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (context.isItemActive(itemContext.value)) {
        iconEl.style.transform = 'rotate(180deg)';
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const triggerSp = sp('trigger');
        const iconSp = sp('icon');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
        const {
          className: iconSpClass,
          style: iconSpStyle,
          ...iconSpRest
        } = iconSp as Record<string, unknown>;

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
            onMouseEnter={() => handlers.Trigger?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Trigger?.onMouseLeave?.()}
            onClick={composeHandlers(attrs.onClick, () => context.onHeaderClick(itemContext.value))}
            onKeyDown={composeHandlers(attrs.onKeyDown, (e) =>
              context.onHeaderKeyDown(e, itemContext.value),
            )}
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

export interface AccordionContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

const AccordionContent = withMoveComponent<
  'content' | 'contentInner',
  AccordionContentProps,
  HTMLDivElement
>({
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

    // Compute opacity timing from height animation config
    const enterHeightDuration = config.open ? (config.open.height as any)?.duration || 400 : 400;
    const exitHeightDuration = config.close ? (config.close.height as any)?.duration || 300 : 300;

    // No-animation fallback — immediately set styles when no config
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;
      if (isAnimatingIn && !config.open) {
        content.style.height = 'auto';
        inner.style.opacity = '1';
        context.onEnterComplete(itemContext.value);
      }
    }, [isAnimatingIn]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;
      if (isAnimatingOut && !config.close) {
        content.style.height = '0px';
        inner.style.opacity = '0';
        context.onExitComplete(itemContext.value);
      }
    }, [isAnimatingOut]); // eslint-disable-line react-hooks/exhaustive-deps

    // Animated content via useAnimations with deps (only when animation configs exist)
    const hasAnimConfig = !!config.open || !!config.close;

    const contentConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!hasAnimConfig) return null;
      return [
        {
          trigger: 'content-open',
          deps: [isAnimatingIn],
          sequence:
            isAnimatingIn && config.open
              ? [
                  [
                    { target: 'Content', fn: 'animateDimension' as const, animation: config.open },
                    {
                      target: 'ContentInner',
                      animation: {
                        opacity: {
                          from: 0,
                          to: 1,
                          ease: 'linear',
                          duration: enterHeightDuration - 150,
                        },
                        delay: 150,
                      },
                    },
                  ],
                ]
              : false,
          onComplete: () => context.onEnterComplete(itemContext.value),
          direction: 'enter' as const,
        },
        {
          trigger: 'content-close',
          deps: [isAnimatingOut],
          sequence:
            isAnimatingOut && config.close
              ? [
                  [
                    { target: 'Content', fn: 'animateDimension' as const, animation: config.close },
                    {
                      target: 'ContentInner',
                      animation: {
                        opacity: {
                          from: 1,
                          to: 0,
                          ease: 'linear',
                          duration: Math.round(exitHeightDuration * 0.4),
                        },
                      },
                    },
                  ],
                ]
              : false,
          onComplete: () => context.onExitComplete(itemContext.value),
          direction: 'exit' as const,
        },
      ];
      // `context` is deliberately absent: the provider builds a fresh value on
      // every render, so depending on it would rebuild this config every render
      // and the memo would do nothing. Only `onExitComplete` is read, and at completion
      // time the closure's latest value is the one wanted.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      isAnimatingIn,
      isAnimatingOut,
      config.open,
      config.close,
      hasAnimConfig,
      enterHeightDuration,
      exitHeightDuration,
      itemContext.value,
    ]);

    const contentRefs = React.useMemo(
      () => ({
        Content: contentRef as React.RefObject<HTMLElement | null>,
        ContentInner: innerRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    useAnimations(contentConfig, contentRefs);

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

    const shouldRender = itemContext.isActive || isAnimatingOut;
    const surface = useSurfaceFlip();

    return {
      render() {
        const contentSp = sp('content');
        const innerSp = sp('contentInner');

        if (!shouldRender) return null;

        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = contentSp as Record<string, unknown>;
        const {
          className: innerSpClass,
          style: innerSpStyle,
          ...innerSpRest
        } = innerSp as Record<string, unknown>;

        return (
          <SurfaceProvider value={surface}>
            <div
              {...attrs}
              {...spRest}
              ref={mergedRef}
              className={cx('content', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
              data-state={itemContext.isActive ? 'open' : 'closed'}
              data-surface={surface}
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
          </SurfaceProvider>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
