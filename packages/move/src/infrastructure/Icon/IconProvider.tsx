'use client';

import * as React from 'react';

export interface IconProps {
  /** Size of the icon - uses em units to scale with text */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Icon color - defaults to currentColor */
  color?: string;
  /** Additional CSS class */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Hide from screen readers (use when icon is decorative) */
  'aria-hidden'?: boolean;
}

export type IconResolver = (name: string) => React.ComponentType<any> | React.ReactNode | null;

export interface IconProviderProps {
  children: React.ReactNode;
  /**
   * Function that resolves icon names to components or elements.
   * You create this based on your icon library of choice.
   *
   * @example
   * ```tsx
   * // With Lucide
   * import * as Icons from 'lucide-react';
   * const resolver = (name) => Icons[name] || Icons[toPascalCase(name)];
   *
   * // With a custom map
   * const icons = { plus: PlusIcon, minus: MinusIcon };
   * const resolver = (name) => icons[name];
   *
   * // With dynamic import
   * const resolver = (name) => React.lazy(() => import(`lucide-react/icons/${name}`));
   * ```
   */
  resolver: IconResolver;
  /**
   * Fallback to render when icon is not found
   */
  fallback?: React.ReactNode;
}

interface IconContextValue {
  resolver: IconResolver;
  fallback?: React.ReactNode;
}

const IconContext = React.createContext<IconContextValue | null>(null);

export function useIconContext() {
  return React.useContext(IconContext);
}

/**
 * Provider that supplies an icon resolver to all Icon components in the tree.
 *
 * The resolver is a simple function you write - move doesn't know or care
 * which icon library you use.
 *
 * @example
 * ```tsx
 * // Lucide icons
 * import * as Icons from 'lucide-react';
 *
 * function toPascalCase(str) {
 *   return str.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
 * }
 *
 * <IconProvider resolver={(name) => Icons[toPascalCase(name)]}>
 *   <Icon name="plus" />
 *   <Icon name="arrow-left" />
 * </IconProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Simple object map
 * import { Plus, Minus, Check } from './my-icons';
 *
 * const icons = { plus: Plus, minus: Minus, check: Check };
 *
 * <IconProvider resolver={(name) => icons[name]}>
 *   <Icon name="plus" />
 * </IconProvider>
 * ```
 */
export function IconProvider({ children, resolver, fallback }: IconProviderProps) {
  const value = React.useMemo(() => ({ resolver, fallback }), [resolver, fallback]);

  return (
    <IconContext.Provider value={value}>
      {children}
    </IconContext.Provider>
  );
}

IconProvider.displayName = 'IconProvider';
