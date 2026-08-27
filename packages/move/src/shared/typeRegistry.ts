/**
 * Runtime registry of the canonical type unions defined in
 * `./types.ts`. Specs reference these by name (`typeRef: 'Size'`) and
 * tooling — PropsTable renderer, drift linter, AI skills — looks up
 * the resolved literal union here.
 *
 * The TypeScript types in `./types.ts` and the literal arrays here
 * are the same data in two forms. Keep them in sync; the spec linter
 * verifies both when it boots.
 */

import { MOVE_COLORS } from './color';

export const CANONICAL_TYPES = {
  // Controls scale (md-anchored)
  Size: ['sm', 'md', 'lg'] as const,
  SizeWithXS: ['xs', 'sm', 'md', 'lg'] as const,
  SizeWithXL: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
  SizeFull: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const,

  // Typography scale (base-anchored)
  TypographySize: ['xs', 'sm', 'base', 'lg', 'xl'] as const,
  DisplaySize: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const,

  // Spacing scale (used by `gap`, `padding`)
  Gap: ['xs', 'sm', 'md', 'lg', 'xl', 'none'] as const,
  GapWithXL2: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'none'] as const,

  // Color palette (Open Color + Move gray) — the default built-in set.
  // Consumer themes extend the type via `MoveColors` augmentation; this
  // list stays the documented default. Single-sourced from MOVE_COLORS.
  Color: MOVE_COLORS,

  // Border-radius scale for media surfaces
  Radius: ['none', 'sm', 'md', 'lg', 'full'] as const,

  // Form-control widths, sized by the content a field expects
  FieldWidth: ['auto', 'xs', 'sm', 'md', 'lg', 'full'] as const,

  // Where an anchored popover takes its width from
  PopoverWidth: ['anchor', 'content'] as const,
} as const;

export type CanonicalTypeName = keyof typeof CANONICAL_TYPES;

/** Resolve `typeRef: 'Size'` → `"'sm' | 'md' | 'lg'"` for display in
 *  PropsTable, codegen, etc. */
export function resolveTypeRef(name: CanonicalTypeName | string): string | null {
  const values = (CANONICAL_TYPES as Record<string, readonly string[]>)[name];
  if (!values) return null;
  return values.map((v) => `'${v}'`).join(' | ');
}

/** The set of values for a typeRef, or null if unknown. Useful when
 *  you want to render chips per value (PropsTable does this). */
export function valuesForTypeRef(name: CanonicalTypeName | string): readonly string[] | null {
  return (CANONICAL_TYPES as Record<string, readonly string[]>)[name] ?? null;
}
