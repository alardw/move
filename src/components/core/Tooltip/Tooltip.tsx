'use client';
// Generated from Tooltip.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { animate, spring, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { prefersReducedMotion } from '../../../animation';
import type { LifecycleAnimate } from '../../../animation';
import type { SlotPropsMap } from '../../../engine';
import styles from './Tooltip.module.css';

// ============================================================================
// Type: LayerAnimate (alias for LifecycleAnimate in overlay/popup context)
// ============================================================================

export type LayerAnimate = LifecycleAnimate;

// ============================================================================
// Direction-aware offset helper
// ============================================================================

function getSideOffset(side: string): { x: number; y: number } {
  switch (side) {
    case 'top': return { x: 0, y: 6 };
    case 'bottom': return { x: 0, y: -6 };
    case 'left': return { x: 6, y: 0 };
    case 'right': return { x: -6, y: 0 };
    default: return { x: 0, y: 6 };
  }
}

// ============================================================================
// Custom tooltip spring (mass: 0.4, stiffness: 450, damping: 18)
// ============================================================================

const tooltipSpring = { mass: 0.4, stiffness: 450, damping: 18, velocity: 0 };

// ============================================================================
// Provider (stateless -- no factory needed)
// ============================================================================

export interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

const TooltipProvider: React.FC<TooltipProviderProps> = (props) => (
  <RadixTooltip.Provider {...props} />
);
TooltipProvider.displayName = 'Tooltip.Provider';

// ============================================================================
// Root (stateless -- no factory needed)
// ============================================================================

export interface TooltipRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
}

const TooltipRoot: React.FC<TooltipRootProps> = (props) => (
  <RadixTooltip.Root {...props} />
);
TooltipRoot.displayName = 'Tooltip.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface TooltipTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const TooltipTrigger = withMoveComponent<'trigger', TooltipTriggerProps, HTMLButtonElement>({
  name: 'TooltipTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        return (
          <RadixTooltip.Trigger
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixTooltip.Trigger>
        );
      },
    };
  },
});

// ============================================================================
// Portal (stateless -- no factory needed)
// ============================================================================

export interface TooltipPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const TooltipPortal: React.FC<TooltipPortalProps> = (props) => (
  <RadixTooltip.Portal {...props} />
);
TooltipPortal.displayName = 'Tooltip.Portal';

// ============================================================================
// Content
//
// Entrance animation is direction-aware: reads data-side from Radix and
// computes translate offset accordingly. Uses useLifecycleAnimate pattern
// (anime.js spring) but with custom direction logic.
// Exit animation is CSS @keyframes via data-state=closed (Radix lifecycle).
// ============================================================================

export interface TooltipContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  animate?: LifecycleAnimate | false;
  sp?: SlotPropsMap<'content'>;
}

const TooltipContent = withMoveComponent<'content', TooltipContentProps, HTMLDivElement>({
  name: 'TooltipContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['side', 'sideOffset', 'align', 'alignOffset', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);
    const animRef = React.useRef<JSAnimation | null>(null);
    const animateProp = props.animate as LifecycleAnimate | false | undefined;

    // Direction-aware entrance animation using anime.js spring
    React.useLayoutEffect(() => {
      if (animateProp === false || prefersReducedMotion()) return;

      const el = contentRef.current;
      if (!el) return;

      const side = el.getAttribute('data-side') || 'top';
      const offset = getSideOffset(side);

      // Hide until animation starts (prevent flash)
      el.style.opacity = '0';

      // Animate entrance with anime.js spring — direction-aware
      animRef.current = animate(el, {
        opacity: [0, 1],
        transform: [
          `translate(${offset.x}px, ${offset.y}px) scale(0.88)`,
          'translate(0px, 0px) scale(1)',
        ],
        ease: spring(tooltipSpring),
        onComplete: () => {
          // Clear inline styles so CSS exit animation can take over
          if (el) {
            el.style.opacity = '';
            el.style.transform = '';
          }
        },
      });

      return () => {
        if (animRef.current) animRef.current.pause();
      };
    }, [animateProp]);

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        return (
          <RadixTooltip.Content
            {...attrs}
            {...spRest}
            ref={mergedRef}
            side={props.side as 'top' | 'right' | 'bottom' | 'left'}
            sideOffset={props.sideOffset as number}
            align={props.align as 'start' | 'center' | 'end'}
            alignOffset={props.alignOffset as number}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixTooltip.Content>
        );
      },
    };
  },
});

// ============================================================================
// Arrow
// ============================================================================

export interface TooltipArrowProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  sp?: SlotPropsMap<'arrow'>;
}

const TooltipArrow = withMoveComponent<'arrow', TooltipArrowProps, HTMLElement>({
  name: 'TooltipArrow',
  styles,
  slots: ['arrow'] as const,
  moveProps: ['width', 'height'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const arrowSp = sp('arrow');
        const { className: spClass, style: spStyle, ...spRest } = arrowSp as Record<string, unknown>;
        return (
          <RadixTooltip.Arrow
            {...attrs}
            {...spRest}
            ref={ref as any}
            width={props.width as number}
            height={props.height as number}
            className={cx('arrow', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Simple wrapper -- covers the common case
// ============================================================================

export interface TooltipSimpleProps {
  /** Tooltip label text */
  label: React.ReactNode;
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** Placement side */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Offset from trigger */
  sideOffset?: number;
  /** Alignment along the side */
  align?: 'start' | 'center' | 'end';
  /** Show arrow */
  arrow?: boolean;
  /** Animation configuration (false to disable) */
  animate?: LifecycleAnimate | false;
  /** Delay before showing */
  delayDuration?: number;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open change */
  onOpenChange?: (open: boolean) => void;
}

const TooltipSimple: React.FC<TooltipSimpleProps> = ({
  label,
  children,
  side = 'top',
  sideOffset = 6,
  align,
  arrow = true,
  animate: animateProp,
  delayDuration,
  open,
  onOpenChange,
}) => (
  <TooltipRoot delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipPortal>
      <TooltipContent side={side} sideOffset={sideOffset} align={align} animate={animateProp}>
        {arrow && <TooltipArrow />}
        {label}
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
);
TooltipSimple.displayName = 'Tooltip';

// ============================================================================
// Export
// ============================================================================

export const Tooltip = Object.assign(TooltipSimple, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
});
