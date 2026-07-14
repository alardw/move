/**
 * Color palette — runtime enumeration of the built-in accent colors.
 *
 * `Color` (src/shared/types.ts) is the type; this is the matching runtime
 * list, for docs, the generated API surface, validators, and consumer color
 * pickers. Consumer themes may augment `MoveColors` with more names; those
 * cannot be enumerated here.
 */

/** The built-in (default-theme) palette color names, in canonical order. */
export const MOVE_COLORS = [
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
] as const;
