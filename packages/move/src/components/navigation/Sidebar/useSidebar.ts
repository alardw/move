import { useCallback, useEffect, useState } from 'react';
import { useControlledState } from '../../../engine';

export interface UseSidebarOptions {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  /** Breakpoint in pixels below which mobile mode activates. Default: 768 */
  breakpoint?: number;
}

export interface UseSidebarReturn {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleMobileOpen: () => void;
  isMobile: boolean;
}

export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const { breakpoint = 768 } = options;

  const [collapsed, setCollapsed] = useControlledState<boolean>({
    value: options.collapsed,
    defaultValue: options.defaultCollapsed ?? false,
    onChange: options.onCollapsedChange,
  });

  const [mobileOpen, setMobileOpen] = useControlledState<boolean>({
    value: options.mobileOpen,
    defaultValue: options.defaultMobileOpen ?? false,
    onChange: options.onMobileOpenChange,
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  // matchMedia listener for breakpoint
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      // Auto-close mobile sheet when viewport crosses to desktop
      if (!e.matches) {
        setMobileOpen(false);
      }
    };

    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint, setMobileOpen]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, [setCollapsed]);

  const toggleMobileOpen = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, [setMobileOpen]);

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,
    mobileOpen,
    setMobileOpen,
    toggleMobileOpen,
    isMobile,
  };
}
