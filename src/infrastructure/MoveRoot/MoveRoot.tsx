'use client';

import * as React from 'react';
import { ThemeProvider } from '../Theme';
import { IconProvider } from '../Icon';
import { MoveProvider } from '../../engine';
import { Tooltip } from '../../components/core/Tooltip';
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
  /** Additional class name on the theme wrapper */
  className?: string;
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
  className,
}: MoveRootProps) {
  // Apply background color to html/body once
  React.useLayoutEffect(() => {
    const bg = theme.tokens['--move-bg-base'];
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    return () => {
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
    };
  }, [theme]);

  let content = (
    <ThemeProvider theme={theme} className={className}>
      <Tooltip.Provider>
        {children}
      </Tooltip.Provider>
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
