'use client';
// Generated from Collapsible.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useCollapsible } from './useCollapsible';
import { expandContent, useAnimations } from '../../../animation';
import type { Animation, AnimationTrigger } from '../../../animation';
import { useIcon } from '../../../infrastructure/Icon';
import styles from './Collapsible.module.css';

// ============================================================================
// Context
// ============================================================================

interface CollapsibleContextValue {
  open: boolean;
  isClosing: boolean;
  isOpening: boolean;
  toggle: () => void;
  disabled: boolean;
  contentAnimate: { open?: Animation; close?: Animation };
  onOpenComplete: () => void;
  onCloseComplete: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error('Collapsible components must be used within Collapsible.Root');
  return context;
}

// ============================================================================
// Types
// ============================================================================

export type CollapsibleAnimate = { open?: Animation; close?: Animation };

// ============================================================================
// Root
// ============================================================================

export interface CollapsibleRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  animations?: { open?: Animation; close?: Animation } | false;
  sp?: SlotPropsMap<'root'>;
}

const CollapsibleRoot = withMoveComponent<'root', CollapsibleRootProps, HTMLDivElement>({
  name: 'Collapsible',
  styles,
  slots: ['root'] as const,
  defaults: { disabled: false },
  moveProps: ['open', 'defaultOpen', 'onOpenChange', 'disabled', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, disabled, animations: animationsProp } = props;

    const collapsible = useCollapsible({
      open: props.open as boolean | undefined,
      defaultOpen: props.defaultOpen as boolean | undefined,
      onOpenChange: props.onOpenChange as ((open: boolean) => void) | undefined,
    });

    // Animation config — uses expandContent preset as default
    const userAnims = animationsProp as { open?: Animation; close?: Animation } | false | undefined;
    const config: { open?: Animation; close?: Animation } =
      userAnims === false
        ? {}
        : {
            open: userAnims?.open ?? expandContent.open,
            close: userAnims?.close ?? expandContent.close,
          };

    // Track open/close transitions synchronously during render
    const isClosingRef = React.useRef(false);
    const isOpeningRef = React.useRef(false);
    const [, forceRender] = React.useState(0);
    const prevOpenRef = React.useRef<boolean | undefined>(undefined);

    if (prevOpenRef.current !== undefined && prevOpenRef.current !== collapsible.open) {
      if (collapsible.open) {
        isOpeningRef.current = true;
        isClosingRef.current = false;
      } else {
        isClosingRef.current = true;
        isOpeningRef.current = false;
      }
    }
    prevOpenRef.current = collapsible.open;

    const onOpenComplete = React.useCallback(() => {
      isOpeningRef.current = false;
      forceRender((c) => c + 1);
    }, []);

    const onCloseComplete = React.useCallback(() => {
      isClosingRef.current = false;
      forceRender((c) => c + 1);
    }, []);

    const contextValue: CollapsibleContextValue = {
      open: collapsible.open,
      isClosing: isClosingRef.current,
      isOpening: isOpeningRef.current,
      toggle: collapsible.toggle,
      disabled: !!disabled,
      contentAnimate: config,
      onOpenComplete,
      onCloseComplete,
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        return (
          <CollapsibleContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('root', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
              data-state={collapsible.open ? 'open' : 'closed'}
              data-disabled={disabled || undefined}
            >
              {children}
            </div>
          </CollapsibleContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Trigger — minimal wrapper, supports asChild
// ============================================================================

export interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const CollapsibleTrigger = withMoveComponent<'trigger', CollapsibleTriggerProps, HTMLButtonElement>(
  {
    name: 'CollapsibleTrigger',
    styles,
    slots: ['trigger'] as const,
    moveProps: ['asChild'],

    setup({ props, ref, cx, sp, attrs }) {
      const { className, style, children, asChild } = props;
      const context = useCollapsibleContext();

      return {
        render() {
          const Comp = asChild ? Slot.Root : 'button';
          const triggerSp = sp('trigger');
          const {
            className: spClass,
            style: spStyle,
            ...spRest
          } = triggerSp as Record<string, unknown>;

          return (
            <Comp
              {...attrs}
              {...spRest}
              ref={ref}
              type={asChild ? undefined : 'button'}
              className={cx('trigger', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
              data-state={context.open ? 'open' : 'closed'}
              data-disabled={context.disabled || undefined}
              disabled={context.disabled || undefined}
              aria-expanded={context.open}
              onClick={() => context.toggle()}
            >
              {children}
            </Comp>
          );
        },
      };
    },
  },
);

// ============================================================================
// Icon — auto-rotating chevron, place anywhere inside Root
// ============================================================================

export interface CollapsibleIconProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'icon'>;
}

const CollapsibleIcon = withMoveComponent<'icon', CollapsibleIconProps, HTMLSpanElement>({
  name: 'CollapsibleIcon',
  styles,
  slots: ['icon'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children } = props;
    const context = useCollapsibleContext();
    const resolvedChevron = useIcon('expand', 15);
    const iconRef = React.useRef<HTMLSpanElement | null>(null);

    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);

    // Icon rotation durations synced to content animation
    const closeDuration = context.contentAnimate?.close
      ? (context.contentAnimate.close.height as any)?.duration || 300
      : 0;
    const openDuration = context.contentAnimate?.open
      ? (context.contentAnimate.open.height as any)?.duration || 400
      : 0;

    const iconConfig: AnimationTrigger[] = React.useMemo(
      () => [
        {
          trigger: 'icon-open',
          deps: [context.isOpening],
          sequence: context.isOpening
            ? [
                {
                  target: 'Icon',
                  animation: { rotate: { to: 180, ease: 'outQuart', duration: openDuration } },
                },
              ]
            : false,
        },
        {
          trigger: 'icon-close',
          deps: [context.isClosing],
          sequence: context.isClosing
            ? [
                {
                  target: 'Icon',
                  animation: { rotate: { to: 0, ease: 'outQuart', duration: closeDuration } },
                },
              ]
            : false,
        },
      ],
      [context.isOpening, context.isClosing, openDuration, closeDuration],
    );

    const iconRefs = React.useMemo(
      () => ({ Icon: iconRef as React.RefObject<HTMLElement | null> }),
      [],
    );
    useAnimations(iconConfig, iconRefs);

    // Set initial rotation on mount (no animation)
    React.useEffect(() => {
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (context.open) {
        iconEl.style.transform = 'rotate(180deg)';
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const iconSp = sp('icon');
        const { className: spClass, style: spStyle, ...spRest } = iconSp as Record<string, unknown>;

        return (
          <span
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('icon', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            aria-hidden="true"
          >
            {children ?? resolvedChevron}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Content
// ============================================================================

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

const CollapsibleContent = withMoveComponent<
  'content' | 'contentInner',
  CollapsibleContentProps,
  HTMLDivElement
>({
  name: 'CollapsibleContent',
  styles,
  slots: ['content', 'contentInner'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children } = props;
    const context = useCollapsibleContext();

    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    const config = context.contentAnimate;

    // Compute opacity timing from height animation config
    const enterHeightDuration = config.open ? (config.open.height as any)?.duration || 400 : 400;
    const exitHeightDuration = config.close ? (config.close.height as any)?.duration || 300 : 300;

    // No-animation fallback — immediately set styles when no config
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;
      if (context.isOpening && !config.open) {
        content.style.height = 'auto';
        inner.style.opacity = '1';
        context.onOpenComplete();
      }
    }, [context.isOpening]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;
      if (context.isClosing && !config.close) {
        content.style.height = '0px';
        inner.style.opacity = '0';
        context.onCloseComplete();
      }
    }, [context.isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    // Animated content via useAnimations with deps
    const hasAnimConfig = !!config.open || !!config.close;

    const contentConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!hasAnimConfig) return null;
      return [
        {
          trigger: 'content-open',
          deps: [context.isOpening],
          sequence:
            context.isOpening && config.open
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
          onComplete: () => context.onOpenComplete(),
          direction: 'enter' as const,
        },
        {
          trigger: 'content-close',
          deps: [context.isClosing],
          sequence:
            context.isClosing && config.close
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
          onComplete: () => context.onCloseComplete(),
          direction: 'exit' as const,
        },
      ];
    }, [
      context.isOpening,
      context.isClosing,
      config.open,
      config.close,
      hasAnimConfig,
      enterHeightDuration,
      exitHeightDuration,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    const contentRefs = React.useMemo(
      () => ({
        Content: contentRef as React.RefObject<HTMLElement | null>,
        ContentInner: innerRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    useAnimations(contentConfig, contentRefs);

    // Set initial state on mount (no animation)
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;

      if (context.open && !context.isOpening) {
        content.style.height = 'auto';
        inner.style.opacity = '1';
      } else if (!context.open) {
        content.style.height = '0px';
        inner.style.opacity = '0';
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Render only when open or close-animating
    const shouldRender = context.open || context.isClosing;

    return {
      render() {
        if (!shouldRender) return null;

        const contentSp = sp('content');
        const innerSp = sp('contentInner');
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
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('content', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            data-state={context.open ? 'open' : 'closed'}
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

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Icon: CollapsibleIcon,
  Content: CollapsibleContent,
};
