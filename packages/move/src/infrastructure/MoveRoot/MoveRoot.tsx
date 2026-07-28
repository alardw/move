'use client';

import * as React from 'react';
import { ThemeProvider } from '../Theme';
import { IconProvider, IconRolesProvider } from '../Icon';
import { MoveProvider } from '../../engine';

// Bundlers (Vite, webpack, Next) statically replace `process.env.NODE_ENV`; declare it
// locally so tsc is happy without pulling @types/node into a browser library.
declare const process: { env: { NODE_ENV?: string } };
// Import the standalone TooltipProvider directly — going through the
// Tooltip compound would pull in the animated Tooltip code (and the
// animation engine) for every app, even ones that never render a
// Tooltip themselves.
import { TooltipProvider } from '../../components/overlays/Tooltip/TooltipProvider';
import { darkTheme } from '../../styles/themes/dark';
import type { Theme } from '../../styles/themes/types';
import type { IconResolver } from '../Icon/IconProvider';
import type { IconRoleOverrides } from '../Icon';
import type { GlobalSlotProps } from '../../engine/types';

export interface MoveRootProps {
  children: React.ReactNode;
  /** Theme object — defaults to darkTheme */
  theme?: Theme;
  /** Icon resolver function for your icon library (name → icon) */
  iconResolver?: IconResolver;
  /** Semantic icon overrides keyed by role (e.g. `{ close: <X/>, expand: 'caret-down' }`) */
  icons?: IconRoleOverrides;
  /** Global slot-props overrides keyed by component name */
  slotProps?: GlobalSlotProps;
  /**
   * Make the app own the window height instead of scrolling the document.
   *
   * This is the ONE place a viewport height enters a Move app. Everything below
   * is relative to it — `fill="remaining"` down the chain, a ScrollArea at the
   * leaf — so no layout component has to know what a viewport is. Opt-in,
   * because a document that should scroll (docs, marketing, long forms) is a
   * perfectly good app.
   *
   * Sets `height: 100%` on html/body and renders a wrapper that clips, so a
   * region that overflows can't silently escape the window. Requires the mount
   * node between body and this wrapper to be sized too — see /systems/layout;
   * a dev-only warning fires if the chain is broken.
   */
  fullHeight?: boolean;
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
  fullHeight,
  theme = darkTheme,
  iconResolver,
  icons,
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
    if (fullHeight) {
      // The percentage chain starts here: html and body must be sized for a
      // relative height anywhere below to resolve against the viewport.
      root.style.height = '100%';
      document.body.style.height = '100%';
    }
    return () => {
      root.style.removeProperty('background-color');
      root.style.removeProperty('color');
      root.style.removeProperty('font-family');
      root.style.removeProperty('font-size');
      document.body.style.removeProperty('background-color');
      if (fullHeight) {
        root.style.removeProperty('height');
        document.body.style.removeProperty('height');
      }
    };
  }, [theme, fullHeight]);

  const frameRef = React.useRef<HTMLDivElement>(null);

  // Dev-only: the mount node (usually #root) sits between body and this wrapper.
  // If it isn't sized, `height: 100%` here resolves against nothing and the whole
  // chain silently falls back to content height — the failure this prop exists to
  // prevent. Cheap to detect, impossible to guess from the symptom.
  React.useEffect(() => {
    if (!fullHeight || process.env.NODE_ENV !== 'development') return;
    const el = frameRef.current;
    if (!el) return;
    const short = window.innerHeight - el.getBoundingClientRect().height;
    if (short > 1) {
      console.warn(
        `[Move] <MoveRoot fullHeight> is ${Math.round(short)}px shorter than the window. ` +
          'The element it renders into is not sized — add `height: 100%` to it ' +
          '(commonly `#root`), or the layout chain below will size to content instead ' +
          'of the viewport. See /systems/layout.',
      );
    }
  }, [fullHeight]);

  let content = (
    <ThemeProvider theme={theme} asWrapper={false}>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );

  if (fullHeight) {
    content = (
      <div
        ref={frameRef}
        data-move-frame=""
        style={{ height: '100%', overflow: 'clip', display: 'flex', flexDirection: 'column' }}
      >
        {content}
      </div>
    );
  }

  if (iconResolver) {
    content = <IconProvider resolver={iconResolver}>{content}</IconProvider>;
  }

  if (icons) {
    content = <IconRolesProvider icons={icons}>{content}</IconRolesProvider>;
  }

  if (slotProps) {
    content = <MoveProvider slotProps={slotProps}>{content}</MoveProvider>;
  }

  return content;
}

MoveRoot.displayName = 'MoveRoot';
