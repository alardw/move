import type * as React from 'react';

/**
 * Run the caller's event handler and the component's own, in that order.
 *
 * A component spreads the caller's props onto its element and then sets its own
 * handlers. JSX compiles that to an object literal, so whatever it writes after
 * the spread REPLACES what the caller passed — their `onClick` never runs, with
 * no error and nothing in the DOM to show for it. Worse when the component's
 * value is conditional: `onClick={sortable ? sort : undefined}` deletes the
 * caller's handler outright on every non-sortable header.
 *
 * Unlike a name (the caller wins) or a role (the component wins), a handler has
 * no winner — both are meant to run. So compose rather than choose.
 *
 * The caller's runs FIRST, and the component's is skipped if they called
 * `preventDefault()`. That ordering is what makes opting out possible: a caller
 * who wants the click but not the sort has somewhere to stand. It matches
 * Radix's `composeEventHandlers`, which every Move component already sits on
 * top of, so the two layers behave the same way.
 *
 * `theirs` is typed `unknown` because it comes off the factory's
 * `attrs: Record<string, unknown>`, where the caller's props land untyped.
 *
 * @example
 * onClick={composeHandlers(attrs.onClick, sortable ? handleSort : undefined)}
 */
export function composeHandlers<E extends { defaultPrevented?: boolean }>(
  theirs: unknown,
  ours: ((event: E) => void) | undefined,
): ((event: E) => void) | undefined {
  const callerHandler = typeof theirs === 'function' ? (theirs as (event: E) => void) : undefined;
  if (!callerHandler) return ours;
  if (!ours) return callerHandler;
  return (event: E) => {
    callerHandler(event);
    if (!event.defaultPrevented) ours(event);
  };
}

/** The shape `composeHandlers` returns, for a slot that stores one. */
export type ComposedHandler<E extends React.SyntheticEvent> = ((event: E) => void) | undefined;
