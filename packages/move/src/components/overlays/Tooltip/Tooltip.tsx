'use client';
// Generated from Tooltip.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import {
  useAnimations,
  resolveAnimationsConfig,
  quick,
  useDismissable,
  useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { SlotPropsMap } from '../../../engine';
import styles from './Tooltip.module.css';

// ============================================================================
// Direction-aware offset helper
// ============================================================================

function getSideOffset(side: string): { x: number; y: number } {
  switch (side) {
    case 'top':
      return { x: 0, y: 6 };
    case 'bottom':
      return { x: 0, y: -6 };
    case 'left':
      return { x: 6, y: 0 };
    case 'right':
      return { x: -6, y: 0 };
    default:
      return { x: 0, y: 6 };
  }
}

// ============================================================================
// Default animations (direction offsets are added at runtime based on data-side)
// ============================================================================

// The animation targets the inner surface (the visible box). The outer Content
// is the Radix-positioned shell — Radix owns its `transform: translate(x,y)` and
// re-applies it on scroll, so we never animate transform there. `data-side` lives
// on the shell, so the entrance reads it via closest(). One animation object →
// opacity + scale + slide all run together (parallel).
const DEFAULT_TOOLTIP_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    vars: (el: HTMLElement) => {
      const side = el.closest<HTMLElement>('[data-side]')?.getAttribute('data-side') || 'top';
      const offset = getSideOffset(side);
      return { offsetX: offset.x, offsetY: offset.y };
    },
    sequence: [
      {
        animation: {
          opacity: { from: 0, to: 1, ease: quick },
          scale: { from: 0.88, to: 1, ease: quick },
          translateX: { from: '$offsetX', to: 0, ease: quick },
          translateY: { from: '$offsetY', to: 0, ease: quick },
        },
      },
    ],
  },
  {
    // Exit via the Move system (no CSS @keyframes).
    trigger: 'Content.exit',
    sequence: [
      {
        animation: {
          opacity: { to: 0, duration: 120 },
          scale: { to: 0.9, duration: 120, ease: 'outQuart' },
        },
      },
    ],
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
// Context + Root (stateful — defers unmount so the Move exit animation plays)
// ============================================================================

interface TooltipContextValue {
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
}
const TooltipContext = React.createContext<TooltipContextValue | null>(null);
const useTooltipContext = () => React.useContext(TooltipContext);

export interface TooltipRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
}

const TooltipRoot: React.FC<TooltipRootProps> = ({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...rest
}) => {
  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded). See useDismissable. Hover/focus open
  // timing is still owned by Radix — we only defer the close for the exit.
  const dismissable = useDismissable({ open: controlledOpen, defaultOpen, onOpenChange });
  const { isOpen: open, isClosing, epoch, onExitDone, open: openFn, close } = dismissable;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        openFn();
      } else {
        // Defer the real close so the Move exit animation can play first.
        close();
      }
    },
    [openFn, close],
  );

  return (
    <TooltipContext.Provider value={{ isClosing, epoch, onExitDone }}>
      <RadixTooltip.Root {...rest} open={open || isClosing} onOpenChange={handleOpenChange}>
        {children}
      </RadixTooltip.Root>
    </TooltipContext.Provider>
  );
};
TooltipRoot.displayName = 'Tooltip.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
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
// dynamic vars and computes translate offset accordingly. Entrance AND exit
// both run through the Move animation system (useAnimations) — no CSS keyframes.
// ============================================================================

export interface TooltipContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  container?: HTMLElement;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

/**
 * Inner animated surface. Lives INSIDE RadixTooltip.Content so it mounts/unmounts
 * with the portal each time the tooltip opens — that is what makes the lifecycle
 * `Content.enter` fire on every open (useAnimations runs its enter once per mount;
 * keeping the hook in the always-mounted outer component fired it only once, at
 * page load, when the ref was still null). Carries the scale/slide transform; the
 * outer shell keeps Radix' positioning transform.
 */
const TooltipContentInner: React.FC<{
  animations?: AnimationTrigger[] | false;
  className?: string;
  style?: React.CSSProperties;
  rest?: Record<string, unknown>;
  children?: React.ReactNode;
}> = ({ animations, className, style, rest, children }) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const ctx = useTooltipContext();

  const animConfig = React.useMemo(
    // Pass `animations` straight through: `|| undefined` would coerce `false`
    // (disable) into `undefined`, which resolveAnimationsConfig treats as "use
    // defaults" — so animations={false} silently did nothing.
    () =>
      resolveAnimationsConfig(
        DEFAULT_TOOLTIP_ANIMATIONS,
        animations as AnimationTrigger[] | false | undefined,
      ),
    [animations],
  );
  const refs = React.useMemo(
    () => ({ Content: innerRef as React.RefObject<HTMLElement | null> }),
    [],
  );
  const { runExit, runEnter, pauseAll } = useAnimations(animConfig, refs, undefined, {
    onEnterComplete: () => {
      const el = innerRef.current;
      if (el) {
        el.style.opacity = '';
        el.style.transform = '';
      }
    },
  });

  // Exit through the Move system, then let Radix unmount.
  useDismissableExit({
    isClosing: ctx?.isClosing ?? false,
    epoch: ctx?.epoch ?? 0,
    onExitDone: ctx?.onExitDone ?? (() => {}),
    runExit,
    runEnter,
    pauseAll,
  });

  return (
    <div ref={innerRef} {...rest} className={className} style={style}>
      {children}
    </div>
  );
};

const TooltipContent = withMoveComponent<
  'content' | 'contentInner',
  TooltipContentProps,
  HTMLDivElement
>({
  name: 'TooltipContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['side', 'sideOffset', 'align', 'alignOffset', 'container', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    return {
      render() {
        const animationsProp = props.animations as AnimationTrigger[] | false | undefined;
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
              <TooltipContentInner
                animations={animationsProp}
                className={cx('contentInner', innerSpClass as string | undefined)}
                style={innerSpStyle as React.CSSProperties}
                rest={innerSpRest}
              >
                {props.children}
              </TooltipContentInner>
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

export interface TooltipArrowProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = arrowSp as Record<string, unknown>;
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
