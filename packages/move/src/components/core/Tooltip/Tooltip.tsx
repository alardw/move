'use client';
// Generated from Tooltip.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, tooltip as tooltipSpring } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { SlotPropsMap } from '../../../engine';
import styles from './Tooltip.module.css';

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
// Default animations (direction offsets are added at runtime based on data-side)
// ============================================================================

const DEFAULT_TOOLTIP_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    vars: (el: HTMLElement) => {
      const side = el.getAttribute('data-side') || 'top';
      const offset = getSideOffset(side);
      return { offsetX: offset.x, offsetY: offset.y };
    },
    sequence: [{
      animation: {
        opacity: { from: 0, to: 1, ease: tooltipSpring },
        scale: { from: 0.88, to: 1, ease: tooltipSpring },
        translateX: { from: '$offsetX', to: 0, ease: tooltipSpring },
        translateY: { from: '$offsetY', to: 0, ease: tooltipSpring },
      },
    }],
  },
];

// ============================================================================
// Provider — defined in a separate file so MoveRoot can import only the
// provider without dragging in the rest of Tooltip (and the animation
// engine). Re-exported here for the compound shape.
// ============================================================================

import { TooltipProvider } from './TooltipProvider';
export type { TooltipProviderProps } from './TooltipProvider';

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
// Content (auto-portals to document.body)
//
// Entrance animation is direction-aware: reads data-side from Radix via
// dynamic vars and computes translate offset accordingly.
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
  container?: HTMLElement;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'content'>;
}

const TooltipContent = withMoveComponent<'content', TooltipContentProps, HTMLDivElement>({
  name: 'TooltipContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['side', 'sideOffset', 'align', 'alignOffset', 'container', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);
    const animationsProp = props.animations as AnimationTrigger[] | false | undefined;

    const animConfig = React.useMemo(
      () => resolveAnimationsConfig(DEFAULT_TOOLTIP_ANIMATIONS, animationsProp || undefined),
      [animationsProp],
    );
    const contentRefs = React.useMemo(() => ({
      Content: contentRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(animConfig, contentRefs, undefined, {
      onEnterComplete: () => {
        // Clear inline styles so CSS exit animation can take over
        const el = contentRef.current;
        if (el) {
          el.style.opacity = '';
          el.style.transform = '';
        }
      },
    });

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        return (
          <RadixTooltip.Portal container={props.container as HTMLElement | undefined}>
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
          </RadixTooltip.Portal>
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
  animations?: AnimationTrigger[] | false;
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
  animations: animationsProp,
  delayDuration,
  open,
  onOpenChange,
}) => (
  <TooltipProvider delayDuration={delayDuration ?? 400}>
    <TooltipRoot delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} align={align} animations={animationsProp}>
        {arrow && <TooltipArrow />}
        {label}
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
);
TooltipSimple.displayName = 'Tooltip';

// ============================================================================
// Export
// ============================================================================

export const Tooltip = Object.assign(TooltipSimple, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
});
