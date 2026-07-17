import { defineThemes } from 'move';

/**
 * The Veldsink portal's design system, distilled to a seed.
 *
 * Source: /opt/veldsink/portal-prototype/src/styles/variables.css — 374 lines of
 * Figma-exported tokens. Almost none of it is ported: Move regenerates the ramps,
 * so the import reduces to the two colors the ramps were built around.
 *
 *   accent  — `--brand-primary` #333366 → OKLCH hue 281.
 *             The source ramp peaks at `--violet-500` #5555aa (chroma 0.133), so we
 *             seed the family's vividness rather than the dark 700 step's 0.087.
 *   neutral — `--neutral-7` #6f6a7c → hue 300, chroma 0.028. The source file's own
 *             comment calls this "with violet tint toward brand-primary", which is
 *             a hand-built description of exactly what neutral.chroma does.
 *   radius  — the source's `--border-radius: 8px` is Move's --move-rounded-md at
 *             factor 1. Exact match, nothing to tune.
 *
 * Deliberately NOT ported:
 *   - Spacing + type scales — already identical to Move's (one exception: the source's
 *     28px h2, where Move steps 24 → 30).
 *   - `--status-success-text: #15803d` — hand-darkened by eye "voor tekst op wit
 *     (WCAG AA: ~5:1)". The engine generates AA-safe status text by construction.
 *   - `--shadow-focus` — focus rings are part of the engine's AA guarantee.
 *   - Layout constants (`--side-menu-width`, `--header-height`) — app CSS, not theme.
 *   - The ~90-line legacy alias block — a migration artifact.
 */
export const VELDSINK_SEED = {
  name: 'veldsink',
  neutral: { hue: 300, chroma: 0.025 },
  accent: { hue: 281, chroma: 0.13 },
  radius: 1,
} as const;

/** The same seed at the dark 700 step's own chroma — duller. Kept to compare. */
export const VELDSINK_MUTED_SEED = {
  ...VELDSINK_SEED,
  name: 'veldsink-muted',
  accent: { hue: 281, chroma: 0.087 },
} as const;

export const veldsink = defineThemes(VELDSINK_SEED);
export const veldsinkMuted = defineThemes(VELDSINK_MUTED_SEED);
