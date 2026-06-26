'use client';

import * as React from 'react';
import { ThemeProvider } from '../Theme';
import { IconProvider } from '../Icon';
import { MoveProvider } from '../../engine';
// Import the standalone TooltipProvider directly — going through the
// Tooltip compound would pull in the animated Tooltip code (and the
// animation engine) for every app, even ones that never render a
// Tooltip themselves.
import { TooltipProvider } from '../../components/overlays/Tooltip/TooltipProvider';
import { darkTheme } from '../../styles/themes/dark';
import type { Theme } from '../../styles/themes/types';
import type { IconResolver } from '../Icon/IconProvider';
import type { GlobalSlotProps } from '../../engine/types';

export interface MoveRootProps {
  children: React.ReactNode;
  /** Theme object — defaults to darkTheme */
  theme?: Theme;
  /** Icon resolver function for your icon library */
  iconResolver?: IconResolver;
  /** Global slot-props overrides keyed by component name */
  slotProps?: GlobalSlotProps;
}

/**
 * MoveRoot — single wrapper that bootstraps a Move application.
 *
 * Composes ThemeProvider, IconProvider, and MoveProvider so consumers
 * only need one import and one component at their app root.
 *
 * @example
 * ```tsx
 * import { MoveRoot, darkTheme } from 'move';
 * import * as Icons from 'lucide-react';
 *
 * const iconResolver = (name: string) => Icons[toPascalCase(name)];
 *
 * <MoveRoot theme={darkTheme} iconResolver={iconResolver}>
 *   <App />
 * </MoveRoot>
 * ```
 */
export function MoveRoot({
  children,
  theme = darkTheme,
  iconResolver,
  slotProps,
}: MoveRootProps) {
  // ThemeProvider with asWrapper=false applies tokens to :root only (no extra div).
  // Background color on html/body comes from the CSS tokens on :root.
  React.useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = 'var(--move-bg-base)';
    root.style.color = 'var(--move-fg-base)';
    root.style.fontFamily = 'var(--move-font-body)';
    root.style.fontSize = 'var(--move-size-base)';
    document.body.style.backgroundColor = 'var(--move-bg-base)';
    return () => {
      root.style.removeProperty('background-color');
      root.style.removeProperty('color');
      root.style.removeProperty('font-family');
      root.style.removeProperty('font-size');
      document.body.style.removeProperty('background-color');
    };
  }, [theme]);

  let content = (
    <ThemeProvider theme={theme} asWrapper={false}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );

  if (iconResolver) {
    content = <IconProvider resolver={iconResolver}>{content}</IconProvider>;
  }

  if (slotProps) {
    content = <MoveProvider slotProps={slotProps}>{content}</MoveProvider>;
  }

  return content;
}

MoveRoot.displayName = 'MoveRoot';
