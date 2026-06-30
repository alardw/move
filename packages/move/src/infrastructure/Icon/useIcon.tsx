'use client';

import * as React from 'react';
import { useResolvedIcon } from './useResolvedIcon';
import { roleIconName, type IconRole } from './roles';

/** Consumer overrides keyed by semantic role. A value is either a built-in icon
 *  name (string, re-resolved through the name resolver) or a ready React node. */
export type IconRoleOverrides = Partial<Record<IconRole, React.ReactNode | string>>;

const IconRolesContext = React.createContext<IconRoleOverrides | null>(null);

export function IconRolesProvider({
  icons,
  children,
}: {
  icons: IconRoleOverrides;
  children: React.ReactNode;
}) {
  return <IconRolesContext.Provider value={icons}>{children}</IconRolesContext.Provider>;
}

export function useIconRoles(): IconRoleOverrides | null {
  return React.useContext(IconRolesContext);
}

/**
 * Resolve an icon by its SEMANTIC ROLE — the single icon system.
 *
 * Resolution order:
 *   role override (`MoveRoot icons={{ … }}`)
 *     → the role's default built-in name
 *     → name resolver (`iconResolver`)
 *     → built-in essential.
 *
 * Components call `useIcon('close')` / `useIcon('status.success')` and never a
 * raw icon name, so the vocabulary in `roles.ts` is the one source of truth.
 *
 * @example
 * const close = useIcon('close', 16);
 */
export function useIcon(role: IconRole, size = 16): React.ReactNode | null {
  const overrides = useIconRoles();
  const override = overrides?.[role];
  const name = typeof override === 'string' ? override : roleIconName(role);
  // useResolvedIcon is always called (hook rules); a node override wins after.
  const resolved = useResolvedIcon(name, size);
  if (override != null && typeof override !== 'string') return override;
  return resolved;
}
