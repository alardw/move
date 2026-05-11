'use client';
import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';

/**
 * Standalone TooltipProvider — split out from Tooltip.tsx so apps that
 * only need the provider (e.g. via MoveRoot) don't pull in the rest of
 * the Tooltip code, including the animation engine. Re-exported as
 * `Tooltip.Provider` from the compound, so consumer-facing API is
 * unchanged.
 */

export interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = (props) => (
  <RadixTooltip.Provider {...props} />
);
TooltipProvider.displayName = 'Tooltip.Provider';
