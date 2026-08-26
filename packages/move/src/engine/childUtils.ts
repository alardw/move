import * as React from 'react';

/**
 * Walk a React children tree looking for an element of a given component type.
 *
 * Used by compound components that render an affordance automatically unless
 * the consumer already supplied one — a header that adds its own Close button
 * only when no `Close` appears among its children, for example. Doing that by
 * inspection keeps the common case (write nothing, get a working control) and
 * the explicit case (write your own, get exactly that) from colliding into a
 * duplicate.
 *
 * Only the JSX the consumer wrote is visible here, so a `Close` hidden inside
 * their own wrapper component is not found — that call site keeps the automatic
 * one and can pass `closable={false}` to opt out.
 *
 * @param children  The children tree to search.
 * @param type      The component to look for (compared by reference).
 * @param maxDepth  How far to descend. Deep trees are rare in a header slot.
 * @returns `true` when an element of `type` appears anywhere in the tree.
 */
export function containsElementOfType(
  children: React.ReactNode,
  type: React.ElementType,
  maxDepth = 4,
): boolean {
  if (maxDepth < 0) return false;

  let found = false;
  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return;
    if (child.type === type) {
      found = true;
      return;
    }
    const nested = (child.props as { children?: React.ReactNode } | null)?.children;
    if (nested != null && containsElementOfType(nested, type, maxDepth - 1)) {
      found = true;
    }
  });
  return found;
}
