/**
 * Radius — one seed value → the full `--move-rounded-*` semantic scale.
 *
 * Radius is a theme-level (not light/dark) decision, so it's generated once and
 * applied alongside either color theme. A single **factor** scales the sm→xl steps
 * proportionally; `none` stays sharp and `full` stays a pill (9999px) — those two
 * are structural, not aesthetic, so they don't scale.
 *
 *   factor 0   → sharp everywhere
 *   factor 1   → the default scale (sm 4 · md 8 · lg 12 · xl 16 px)
 *   factor 1.6 → 60% rounder across the board
 */

export type RadiusInput = number | 'none' | 'sm' | 'md' | 'lg' | 'xl';

/** Named levels → factor. `md` is the default (today's scale). */
const NAMED: Record<Exclude<RadiusInput, number>, number> = {
  none: 0,
  sm: 0.5,
  md: 1,
  lg: 1.5,
  xl: 2,
};

/** Factor-1 base of each step, in rem (matches the `--move-radius-*` primitives). */
const BASE_REM = { sm: 0.25, md: 0.5, lg: 0.75, xl: 1 } as const;

/** The CSS-var keys this produces — the semantic radius scale components read. */
export type RadiusVars = Record<
  | '--move-rounded-none'
  | '--move-rounded-sm'
  | '--move-rounded-md'
  | '--move-rounded-lg'
  | '--move-rounded-xl'
  | '--move-rounded-full',
  string
>;

/** Expand a radius seed value into the `--move-rounded-*` scale. */
export function radiusScale(radius: RadiusInput = 'md'): RadiusVars {
  const factor = typeof radius === 'number' ? Math.max(0, radius) : (NAMED[radius] ?? 1);
  const rem = (base: number) => (base * factor === 0 ? '0' : `${+(base * factor).toFixed(4)}rem`);
  return {
    '--move-rounded-none': '0',
    '--move-rounded-sm': rem(BASE_REM.sm),
    '--move-rounded-md': rem(BASE_REM.md),
    '--move-rounded-lg': rem(BASE_REM.lg),
    '--move-rounded-xl': rem(BASE_REM.xl),
    '--move-rounded-full': '9999px',
  };
}
