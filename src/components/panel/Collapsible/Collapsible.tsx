'use client';
// Generated from Collapsible.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Slot } from 'radix-ui';
import { animate, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useCollapsible } from './useCollapsible';
import {
  toAnimeParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../../animation';
import {
  defaultAnimations,
} from '../../../animation';
import type { ExpandAnimate } from '../../../animation';
import { useResolvedIcon } from '../../../infrastructure/Icon';
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
  contentAnimate: ExpandAnimate;
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

export type { ExpandAnimate as CollapsibleAnimate };

// ============================================================================
// Root
// ============================================================================

export interface CollapsibleRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  animate?: ExpandAnimate | false;
  sp?: SlotPropsMap<'root'>;
}

const CollapsibleRoot = withMoveComponent<'root', CollapsibleRootProps, HTMLDivElement>({
  name: 'Collapsible',
  styles,
  slots: ['root'] as const,
  defaults: { disabled: false },
  moveProps: ['open', 'defaultOpen', 'onOpenChange', 'disabled', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, disabled, animate: animateProp } = props;

    const collapsible = useCollapsible({
      open: props.open as boolean | undefined,
      defaultOpen: props.defaultOpen as boolean | undefined,
      onOpenChange: props.onOpenChange as ((open: boolean) => void) | undefined,
    });

    // Animation config
    const config = animateProp === false
      ? {} as ExpandAnimate
      : mergeAnimateConfig(defaultAnimations.content, animateProp as ExpandAnimate | undefined);

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
      forceRender(c => c + 1);
    }, []);

    const onCloseComplete = React.useCallback(() => {
      isClosingRef.current = false;
      forceRender(c => c + 1);
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

export interface CollapsibleTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const CollapsibleTrigger = withMoveComponent<'trigger', CollapsibleTriggerProps, HTMLButtonElement>({
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
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;

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
});

// ============================================================================
// Icon — auto-rotating chevron, place anywhere inside Root
// ============================================================================

export interface CollapsibleIconProps extends Record<string, unknown> {
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
    const resolvedChevron = useResolvedIcon('chevron-down', 15);
    const iconRef = React.useRef<HTMLSpanElement | null>(null);
    const iconAnimRef = React.useRef<JSAnimation | null>(null);

    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);

    // Set initial rotation on mount (no animation)
    React.useEffect(() => {
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (context.open) {
        iconEl.style.transform = 'rotate(180deg)';
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Rotate closed together with content collapse
    React.useEffect(() => {
      if (!context.isClosing) return;
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
    }, [context.isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    // Rotate open together with content expand
    React.useEffect(() => {
      if (!context.isOpening) return;
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
    }, [context.isOpening]); // eslint-disable-line react-hooks/exhaustive-deps

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

export interface CollapsibleContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

const contentAnimTracker = new WeakMap<HTMLElement, { height?: JSAnimation; opacity?: JSAnimation }>();

const CollapsibleContent = withMoveComponent<'content' | 'contentInner', CollapsibleContentProps, HTMLDivElement>({
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

    // Open animation
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner || !context.isOpening) return;

      if (!config.open) {
        content.style.height = 'auto';
        inner.style.opacity = '1';
        context.onOpenComplete();
        return;
      }

      const reducedMotion = prefersReducedMotion();
      const anims = contentAnimTracker.get(content) || {};
      if (anims.height) anims.height.pause();
      if (anims.opacity) anims.opacity.pause();

      if (reducedMotion) {
        content.style.height = 'auto';
        inner.style.opacity = '1';
        context.onOpenComplete();
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

      const enterDuration = (heightParams.duration as number) || 400;

      let heightDone = false;
      let opacityDone = false;
      const checkComplete = () => {
        if (heightDone && opacityDone) {
          content.style.height = 'auto';
          context.onOpenComplete();
        }
      };

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
    }, [context.isOpening]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close animation
    React.useEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner || !context.isClosing) return;

      if (!config.close) {
        content.style.height = '0px';
        inner.style.opacity = '0';
        context.onCloseComplete();
        return;
      }

      const reducedMotion = prefersReducedMotion();
      const anims = contentAnimTracker.get(content) || {};
      if (anims.height) anims.height.pause();
      if (anims.opacity) anims.opacity.pause();

      if (reducedMotion) {
        content.style.height = '0px';
        inner.style.opacity = '0';
        context.onCloseComplete();
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
        onComplete: () => context.onCloseComplete(),
      });

      contentAnimTracker.set(content, anims);
    }, [context.isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    // Render only when open or close-animating
    const shouldRender = context.open || context.isClosing;

    return {
      render() {
        if (!shouldRender) return null;

        const contentSp = sp('content');
        const innerSp = sp('contentInner');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = innerSp as Record<string, unknown>;

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
