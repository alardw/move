'use client';

import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Tooltip.module.css';

// ============================================================================
// Provider (stateless — no factory needed)
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
// Root (stateless — no factory needed)
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
  pt?: PassThrough<'trigger'>;
}

const TooltipTrigger = withMoveComponent<'trigger', TooltipTriggerProps, HTMLButtonElement>({
  name: 'TooltipTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const triggerPt = ptm('trigger');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;
        return (
          <RadixTooltip.Trigger
            {...attrs}
            {...ptRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixTooltip.Trigger>
        );
      },
    };
  },
});

// ============================================================================
// Portal (stateless — no factory needed)
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
// ============================================================================

export interface TooltipContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  pt?: PassThrough<'content'>;
}

const TooltipContent = withMoveComponent<'content', TooltipContentProps, HTMLDivElement>({
  name: 'TooltipContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['side', 'sideOffset', 'align', 'alignOffset'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;
        return (
          <RadixTooltip.Content
            {...attrs}
            {...ptRest}
            ref={ref}
            side={props.side as 'top' | 'right' | 'bottom' | 'left'}
            sideOffset={props.sideOffset as number}
            align={props.align as 'start' | 'center' | 'end'}
            alignOffset={props.alignOffset as number}
            className={cx('content', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'arrow'>;
}

const TooltipArrow = withMoveComponent<'arrow', TooltipArrowProps, HTMLElement>({
  name: 'TooltipArrow',
  styles,
  slots: ['arrow'] as const,
  moveProps: ['width', 'height'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const arrowPt = ptm('arrow');
        const { className: ptClass, style: ptStyle, ...ptRest } = arrowPt as Record<string, unknown>;
        return (
          <RadixTooltip.Arrow
            {...attrs}
            {...ptRest}
            ref={ref as any}
            width={props.width as number}
            height={props.height as number}
            className={cx('arrow', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
};
