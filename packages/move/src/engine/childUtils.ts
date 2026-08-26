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

/**
 * Safely read the component identity of a child element.
 *
 * Compound components inspect their children to decide what to do with them —
 * which ones are actions rather than content, which are the items whose labels
 * need seeding. The identity lives on the element's `type`, and `type` is
 * `undefined` when the JSX names a component that does not exist: a typo, or a
 * sub-component the compound never exported.
 *
 * Reading through that undefined throws a `TypeError` from inside the library,
 * which is the wrong error at the wrong moment. Several of these walks run
 * BEFORE their children render — over items inside a popup that is still closed,
 * for instance — so an unguarded read turns a typo in a dropdown nobody has
 * opened into a blank page at mount, and buries React's own precise "Element
 * type is invalid" under a stack trace pointing at internals.
 *
 * Returning `undefined` lets the walk skip the element and React report it
 * properly, if and when it renders.
 *
 * Reads `displayName` (set by `withMoveComponent`) and falls back to
 * `_moveComponentName`, the marker a couple of components assign by hand.
 *
 * @param child  A node from `React.Children.forEach`/`map`.
 * @returns The component's name, or `undefined` for host elements, text nodes,
 *          fragments, and elements whose type does not exist.
 */
export function elementTypeName(child: React.ReactNode): string | undefined {
  if (!React.isValidElement(child)) return undefined;
  const type = child.type as
    { displayName?: string; _moveComponentName?: string } | string | undefined;
  if (typeof type !== 'function' && typeof type !== 'object') return undefined;
  return type?.displayName ?? type?._moveComponentName;
}
