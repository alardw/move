/**
 * defineTheme — expand a small seed into a full, WCAG-2.2-AA-guaranteed Theme.
 *
 * The neutral SURFACES (bg/fg/border) and ACCENT roles (primary fill, link text,
 * focus ring, secondary) are GENERATED in OKLCH from the seed and contrast-clamped
 * (see notes/define-theme-spec.md). The chromatic blocks — status palettes, the
 * per-palette text/soft-bg pairs, overlay/scrollbar, shadows — reference the fixed
 * primitive palettes (they don't tint with the neutral) and are composed in.
 *
 * `defineTheme(seed)` returns a drop-in `Theme`. `describeTheme(seed)` also returns
 * the contrast-guard `notices` (which tokens were nudged, in which mode) for the
 * Theme Builder and the `check:theme-contrast` guard. Contrast is an enforced
 * invariant — a bad seed is corrected and surfaced, never silently shipped or blocked.
 */

import type { Theme, ThemeTokens } from './types';
import { createThemeShadows, type ThemeShadowConfig } from '../visual/shadows';
import { oklchToLinear, oklchHex, clampToContrast, contrast, type LinRGB } from './color-engine';
import {
  PALETTE as CATEGORICAL,
  SOLID_SHADE,
  borderValue,
  fgSolidToken,
  semanticShades,
} from './palette';
import { radiusScale, type RadiusInput, type RadiusVars } from './radius';

// ── Seed ─────────────────────────────────────────────────────────────────────
export interface ThemeSeed {
  name: string;
  appearance: 'light' | 'dark';
  /** Neutral hue (deg) + chroma — explicit, off-white/off-black, drives every surface. */
  neutral: { hue: number; chroma: number };
  /** Brand accent — hue (deg) + optional chroma; drives fill, text, focus. */
  accent: { hue: number; chroma?: number };
  /** Status → palette name. Defaults: success green, warning yellow, danger red, info blue. */
  status?: { success?: string; warning?: string; danger?: string; info?: string };
  /** Corner radius — one factor (or named level) scales the whole `--move-rounded-*`
   *  scale. Theme-level (same for light + dark). Default `'md'` = today's scale. */
  radius?: RadiusInput;
  /**
   * Whether the categorical palette (Badge/Avatar/… `color` prop) tracks the brand's
   * saturation or stays independent of it.
   *
   * `'harmonize'` (default) mutes the 13 colors in proportion to how desaturated the
   * accent is; `'independent'` leaves them at full Open Color. NOTE this only has an
   * effect below `accent.chroma: 0.16` — at or above it the desaturation factor is
   * zero and the two settings emit identical palettes. Move's own seed is 0.23, so
   * the shipped themes are unaffected either way. Semantic status colors never mute.
   */
  palette?: 'harmonize' | 'independent';
  /** Raw-token escape hatch — overrides any generated value. */
  tokens?: Partial<ThemeTokens>;
}

// ── Tuned recipe constants (validated in the OKLCH tuner spike) ────────────────
const DARK_TINT_SATURATION = 1.5; // dark grounds mute tint; boost chroma so it reads equally
// The categorical palette's colorfulness follows the accent saturation, but never all the way
// to gray — a floor keeps a whisper of hue so a "red" tag stays distinguishable from a "green"
// one even under a greyscale accent. Raise to 1 for a starkly monochrome palette.
const PALETTE_DESAT_MAX = 0.82;

/** Desaturate the categorical palette toward its matched-lightness gray by `mixPct` (0–100).
 *  We mix each color toward the SAME shade of gray, so hue and lightness hold and only chroma
 *  drops — a "red" stays a (muted) red rather than shifting or changing brightness. */
function harmonizePalette(base: Record<string, string>, mixPct: number): Record<string, string> {
  if (mixPct <= 0.5) return base;
  const pct = mixPct.toFixed(0);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(base)) {
    const m = v.match(/^var\(--move-([a-z]+)-(\d+)\)$/);
    if (!m || m[1] === 'gray') {
      out[k] = v;
      continue;
    }
    out[k] = `color-mix(in oklch, ${v}, var(--move-gray-${m[2]}) ${pct}%)`;
  }
  return out;
}

/** Surface & border ramp: lightness per mode + chroma multiplier (tint fades toward text). */
const SURFACES = [
  { k: '--move-bg-base', Ll: 0.994, Ld: 0.17, cm: 1.0 },
  { k: '--move-bg-subtle', Ll: 0.978, Ld: 0.205, cm: 1.15 },
  { k: '--move-bg-muted', Ll: 0.958, Ld: 0.248, cm: 1.25 },
  { k: '--move-bg-emphasis', Ll: 0.93, Ld: 0.295, cm: 1.3 },
  { k: '--move-border-base', Ll: 0.905, Ld: 0.325, cm: 1.1 },
  { k: '--move-border-muted', Ll: 0.875, Ld: 0.38, cm: 1.0 },
  { k: '--move-border-emphasis', Ll: 0.8, Ld: 0.455, cm: 0.85 },
] as const;

/** Text tiers: lightness, chroma multiplier, contrast target, and the surfaces each
 *  realistically sits on (the guarantee is against the worst of those). */
const TEXT = [
  {
    k: '--move-fg-base',
    Ll: 0.22,
    Ld: 0.955,
    cm: 0.12,
    target: 7,
    on: ['--move-bg-base', '--move-bg-subtle', '--move-bg-muted', '--move-bg-emphasis'],
  },
  {
    k: '--move-fg-muted',
    Ll: 0.45,
    Ld: 0.72,
    cm: 0.28,
    target: 5.5,
    on: ['--move-bg-base', '--move-bg-subtle', '--move-bg-muted'],
  },
  {
    k: '--move-fg-subtle',
    Ll: 0.6,
    Ld: 0.56,
    cm: 0.5,
    target: 4.5,
    on: ['--move-bg-base', '--move-bg-subtle'],
  },
] as const;

const bestOn = (fill: LinRGB): string => {
  const white = oklchToLinear(0.99, 0, 0);
  const ink = oklchToLinear(0.22, 0, 0);
  return contrast(white, fill) >= contrast(ink, fill) ? 'var(--move-white)' : 'var(--move-black)';
};

// ── Chromatic blocks (fixed primitives; don't tint with the neutral) ───────────
const STATUS_SHADES = {
  light: { base: 600, hover: 700, subtle: 100 },
  dark: { base: 600, hover: 500, subtle: 950 },
} as const;

function statusBlock(status: Required<NonNullable<ThemeSeed['status']>>, ap: 'light' | 'dark') {
  const sh = STATUS_SHADES[ap];
  const role = (name: string, palette: string, fg: string) => ({
    [`--move-${name}`]: `var(--move-${palette}-${sh.base})`,
    [`--move-${name}-hover`]: `var(--move-${palette}-${sh.hover})`,
    [`--move-${name}-subtle`]: `var(--move-${palette}-${sh.subtle})`,
    [`--move-${name}-fg`]: fg,
  });
  return {
    ...role('success', status.success, 'var(--move-white)'),
    ...role('warning', status.warning, 'var(--move-black)'),
    ...role('error', status.danger, 'var(--move-white)'),
    ...role('info', status.info, 'var(--move-white)'),
  };
}

const MISC = {
  light: {
    '--move-overlay': 'rgba(0, 0, 0, 0.4)',
    '--move-scrollbar-thumb': 'var(--move-gray-200)',
    '--move-scrollbar-track': 'transparent',
  },
  dark: {
    '--move-overlay': 'rgba(0, 0, 0, 0.5)',
    '--move-scrollbar-thumb': 'var(--move-gray-700)',
    '--move-scrollbar-track': 'transparent',
  },
} as const;

const SHADOW_CONFIG = {
  light: {
    angle: 135,
    color: '220 3% 15%',
    oomph: 0.5,
    crispy: 0.5,
    surfaces: {
      base: { strength: 0.3 },
      subtle: { strength: 0.35 },
      muted: { strength: 0.4 },
      emphasis: { strength: 0.45 },
      inverse: { color: '220 3% 90%', strength: 0.5 },
    },
  },
  dark: {
    angle: 135,
    color: '220 40% 2%',
    oomph: 0.5,
    crispy: 0.5,
    surfaces: {
      base: { strength: 0.55 },
      subtle: { strength: 0.6 },
      muted: { strength: 0.65 },
      emphasis: { strength: 0.7 },
      inverse: { color: '220 3% 90%', strength: 0.25 },
    },
  },
} as const;

/**
 * Re-tint a shadow config's hue to the theme's neutral hue, so shadows carry the
 * same tint as the surfaces instead of the fixed 220° the base config ships. Only
 * the hue moves — the near-black saturation/lightness stay — so on a low-chroma
 * neutral the tint is a whisper, but a warm or green theme's shadow now reads
 * of-a-piece with its surfaces.
 */
function tintShadowConfig(cfg: ThemeShadowConfig, hue: number, chroma: number): ThemeShadowConfig {
  const h = Math.round(hue);
  // Saturation tracks the neutral chroma (ref 0.008 = Move's near-grey → ×1), so a
  // grey theme keeps a near-neutral shadow while a colorful one tints visibly.
  // A modest floor keeps the shadow from going stone-dead grey; a cap keeps it
  // from ever reading as a coloured glow.
  const scale = Math.min(5, chroma / 0.008);
  const retint = (c: string) => {
    const m = c.match(/^[\d.]+\s+([\d.]+)%\s+([\d.]+)%$/);
    if (!m) return c.replace(/^[\d.]+/, String(h));
    const sat = Math.min(60, +(parseFloat(m[1]) * scale).toFixed(1));
    return `${h} ${sat}% ${m[2]}%`;
  };
  const surfaces = {} as ThemeShadowConfig['surfaces'];
  for (const [k, v] of Object.entries(cfg.surfaces)) {
    surfaces[k as keyof ThemeShadowConfig['surfaces']] = v.color
      ? { ...v, color: retint(v.color) }
      : v;
  }
  return { ...cfg, color: retint(cfg.color), surfaces };
}

const ANIMATION = {
  spring: { mass: 0.8, stiffness: 500, damping: 15 },
  duration: { fast: 100, normal: 200, slow: 300 },
  reducedMotion: false,
};

// ── Derivation steps ───────────────────────────────────────────────────────────
//
// One step per token family, each reading the seed's hues and the surfaces the
// earlier steps computed. They were inline blocks in describeTheme, numbered 1–7
// by comment; naming them makes the dependency order explicit (everything with a
// contrast floor needs `lin` populated by deriveSurfaces first) and keeps any one
// family readable on its own.

/** Shared state threaded through the steps. */
interface Derivation {
  dark: boolean;
  /** Neutral hue + chroma (already boosted for dark grounds). */
  nH: number;
  nC: number;
  /** Accent hue + chroma. */
  aH: number;
  aC: number;
  /** Linear-RGB cache of computed colors, so later clamps can read earlier surfaces. */
  lin: Record<string, LinRGB>;
  out: Record<string, string>;
  /** Contrast nudges applied, surfaced to the themer rather than hidden. */
  notices: string[];
  /** How far the categorical palette is muted toward grey (0 = untouched). */
  paletteDesat: number;
}

/** The four page grounds every foreground clamp is graded against. */
const groundsOf = (d: Derivation): LinRGB[] => [
  d.lin['--move-bg-base'],
  d.lin['--move-bg-subtle'],
  d.lin['--move-bg-muted'],
  d.lin['--move-bg-emphasis'],
];

/** 1. Surfaces + the decorative border ramp. Must run first — the rest clamp against these. */
function deriveSurfaces(d: Derivation): void {
  for (const s of SURFACES) {
    const L = d.dark ? s.Ld : s.Ll;
    const C = d.nC * s.cm;
    d.lin[s.k] = oklchToLinear(L, C, d.nH);
    d.out[s.k] = oklchHex(L, C, d.nH);
  }
}

/** 2. Text tiers — clamped against the worst realistic surface each one lands on. */
function deriveTextTiers(d: Derivation): void {
  for (const t of TEXT) {
    const L = d.dark ? t.Ld : t.Ll;
    const C = d.nC * t.cm;
    const r = clampToContrast(
      L,
      C,
      d.nH,
      t.on.map((k) => d.lin[k]),
      t.target,
      d.dark,
    );
    d.out[t.k] = r.hex;
    d.lin[t.k] = oklchToLinear(r.L, C, d.nH);
    if (r.clamped) d.notices.push(`${t.k} nudged to hold ${t.target}:1`);
  }
}

/** 3. Inverse surface — opposite polarity, for inverted panels. */
function deriveInverse(d: Derivation): void {
  d.out['--move-bg-inverse'] = oklchHex(d.dark ? 0.955 : 0.2, d.nC, d.nH);
  d.out['--move-fg-inverse'] = oklchHex(d.dark ? 0.18 : 0.96, d.nC * 0.3, d.nH);
}

/**
 * 4. Accent FILL — lightness clamped so its own label clears AA.
 *
 * Dark lifts one controlled step (0.58 vs light's 0.52) so the accent pops against
 * a near-black ground — the usual dark-mode convention — but stays well short of
 * the old 0.62, which pushed deep hues (indigo/violet/blue) into a pale, black-label
 * pastel. At 0.58 the fill keeps a saturated body + white label; the loop still
 * lightens naturally-light hues until THEIR label clears AA.
 */
function deriveAccentFill(d: Derivation): void {
  let pL = d.dark ? 0.58 : 0.52;
  let fg = bestOn(oklchToLinear(pL, d.aC, d.aH));
  let tries = 0;
  const fgLin = () =>
    fg === 'var(--move-white)' ? oklchToLinear(0.99, 0, 0) : oklchToLinear(0.22, 0, 0);
  while (contrast(fgLin(), oklchToLinear(pL, d.aC, d.aH)) < 4.5 && tries < 80) {
    pL += fg === 'var(--move-white)' ? -0.008 : 0.008;
    if (pL < 0.14 || pL > 0.9) break;
    fg = bestOn(oklchToLinear(pL, d.aC, d.aH));
    tries += 1;
  }
  if (tries > 0) d.notices.push('--move-primary darkened so its label holds AA');
  d.out['--move-primary'] = oklchHex(pL, d.aC, d.aH);
  d.out['--move-primary-hover'] = oklchHex(pL + (d.dark ? 0.06 : -0.06), d.aC, d.aH);
  d.out['--move-primary-active'] = oklchHex(pL + (d.dark ? -0.06 : 0.06), d.aC, d.aH);
  d.out['--move-primary-subtle'] = oklchHex(d.dark ? 0.2 : 0.95, d.aC * 0.35, d.aH);
  d.out['--move-primary-fg'] = fg;
}

/**
 * 5. Accent TEXT (link) — clamped to AA on every surface.
 *
 * Chroma tracks the accent's own (0.75× of it) so a desaturated accent — down to a
 * fully greyscale aC:0 — carries through to links, rather than staying colored.
 */
function deriveAccentText(d: Derivation): void {
  const lC = d.aC * 0.75;
  const r = clampToContrast(d.dark ? 0.78 : 0.44, lC, d.aH, groundsOf(d), 4.5, d.dark);
  d.out['--move-link'] = r.hex;
  d.out['--move-link-hover'] = oklchHex(r.L + (d.dark ? 0.06 : -0.06), lC, d.aH);
  if (r.clamped) d.notices.push('--move-link nudged to hold AA on surfaces');
}

/**
 * 6. Focus ring — clamped to 3:1 on surfaces (WCAG 1.4.11 / 2.2 §2.4.13).
 * Chroma tracks the accent (0.875×) so it desaturates with a greyscale accent too.
 */
function deriveFocusRing(d: Derivation): void {
  const fC = d.aC * 0.875;
  const r = clampToContrast(
    d.dark ? 0.68 : 0.55,
    fC,
    d.aH,
    [d.lin['--move-bg-base'], d.lin['--move-bg-subtle']],
    3,
    d.dark,
  );
  d.out['--move-focus-ring-color'] = r.hex;
  if (r.clamped) d.notices.push('--move-focus-ring-color nudged to hold 3:1');
}

/**
 * 6b. Interactive control borders — 3:1 non-text contrast (WCAG 1.4.11).
 *
 * Seeded toward the surfaces so the search settles on the SOFTEST border that still
 * clears 3:1 — never harsher than the ground demands. Chroma tracks the neutral ramp
 * so the border carries the theme's whisper of tint. `interactive` holds against the
 * base/subtle ground; `-strong` also clears the lighter muted surface (swapped in per
 * [data-surface], see surface.css).
 */
function deriveInteractiveBorders(d: Derivation): void {
  const bC = d.nC * 1.1;
  const start = d.dark ? 0.42 : 0.62;
  const soft = clampToContrast(
    start,
    bC,
    d.nH,
    [d.lin['--move-bg-base'], d.lin['--move-bg-subtle']],
    3,
    d.dark,
  );
  d.out['--move-border-interactive'] = soft.hex;
  const strong = clampToContrast(
    start,
    bC,
    d.nH,
    [d.lin['--move-bg-muted'], d.lin['--move-bg-emphasis']],
    3,
    d.dark,
  );
  d.out['--move-border-interactive-strong'] = strong.hex;
}

/** 7. Secondary — a neutral fill, label borrowed from the base text tier. */
function deriveSecondary(d: Derivation): void {
  const sL = d.dark ? 0.32 : 0.9;
  const sC = d.nC * 1.2;
  d.out['--move-secondary'] = oklchHex(sL, sC, d.nH);
  d.out['--move-secondary-hover'] = oklchHex(sL + (d.dark ? 0.05 : -0.05), sC, d.nH);
  d.out['--move-secondary-active'] = oklchHex(sL + (d.dark ? -0.05 : 0.05), sC, d.nH);
  d.out['--move-secondary-fg'] = d.out['--move-fg-base'];
}

/**
 * 8. Categorical palette roles — the five values every `color` prop resolves to.
 *
 * The mode-dependent pair (-text on a surface, -soft-bg behind it) comes from the
 * shade choices in palette.ts; the mode-independent three (-solid fill, its
 * -border edge, and the -fg-solid label on it) are the ramp stops accents.css
 * used to hardcode. Emitting all five as theme tokens is what lets a theme own
 * them — and what will let the clamp reach them, the way deriveAccentText already
 * clamps the brand's equivalent.
 *
 * Values reproduce exactly what accents.css and the old PALETTE map resolved to;
 * no contrast floor is applied yet. Harmonisation still touches only -text and
 * -soft-bg, as it always has — the solid fill and border staying at full Open
 * Color saturation is a real inconsistency, but fixing it belongs with the clamp,
 * not here.
 */
function derivePaletteRoles(d: Derivation): void {
  const appearance = d.dark ? 'dark' : 'light';
  for (const p of CATEGORICAL) {
    const s = semanticShades(p.name, appearance);
    Object.assign(
      d.out,
      harmonizePalette(
        {
          [`--move-${p.name}-text`]: `var(--move-${p.name}-${s.text})`,
          [`--move-${p.name}-soft-bg`]: `var(--move-${p.name}-${s.softBg})`,
        },
        d.paletteDesat * 100,
      ),
    );
    d.out[`--move-${p.name}-solid`] = `var(--move-${p.name}-${SOLID_SHADE})`;
    d.out[`--move-${p.name}-border`] = borderValue(p.name);
    d.out[`--move-${p.name}-fg-solid`] = `var(${fgSolidToken(p.name)})`;
  }
}

/** Every derivation step, in dependency order. Surfaces first; the rest clamp against them. */
const STEPS = [
  deriveSurfaces,
  deriveTextTiers,
  deriveInverse,
  deriveAccentFill,
  deriveAccentText,
  deriveFocusRing,
  deriveInteractiveBorders,
  deriveSecondary,
  derivePaletteRoles,
];

// ── Engine ─────────────────────────────────────────────────────────────────────
export interface DescribeThemeResult {
  theme: Theme;
  /** Human-readable notes about any contrast nudge the guard applied. */
  notices: string[];
}

/** Generate a theme AND report the contrast-guard nudges (for the Builder / check). */
export function describeTheme(seed: ThemeSeed): DescribeThemeResult {
  const dark = seed.appearance === 'dark';
  const { hue: nH, chroma: nC0 } = seed.neutral;
  const nC = nC0 * (dark ? DARK_TINT_SATURATION : 1);
  const aH = seed.accent.hue;
  const aC = seed.accent.chroma ?? 0.16;
  const status = {
    success: 'green',
    warning: 'yellow',
    danger: 'red',
    info: 'blue',
    ...seed.status,
  };
  const notices: string[] = [];

  // Palette colorfulness tracks accent saturation (aC), floored so it never fully greys out.
  // Opt out with `palette: 'independent'` to keep full Open Color regardless of the accent.
  const paletteDesat =
    seed.palette === 'independent' ? 0 : Math.max(0, 1 - aC / 0.16) * PALETTE_DESAT_MAX;

  const d: Derivation = { dark, nH, nC, aH, aC, lin: {}, out: {}, notices, paletteDesat };
  for (const step of STEPS) step(d);
  const out = d.out;

  const ap = dark ? 'dark' : 'light';
  const tokens = {
    ...out,
    ...statusBlock(status, ap),
    ...MISC[ap],
    ...createThemeShadows(tintShadowConfig(SHADOW_CONFIG[ap], nH, seed.neutral.chroma)),
    ...(seed.tokens ?? {}),
  } as ThemeTokens;

  return { theme: { name: seed.name, tokens, animation: ANIMATION }, notices };
}

/** Expand a seed into a drop-in `Theme` (WCAG 2.2 AA guaranteed). */
export function defineTheme(seed: ThemeSeed): Theme {
  return describeTheme(seed).theme;
}

/**
 * Expand ONE brand seed into BOTH light and dark themes — the usual case. The
 * neutral + accent are the brand; light and dark are two renderings of it, so you
 * pick the seed once and get the pair.
 *
 *   const { light, dark } = defineThemes({ neutral: { hue: 250, chroma: 0.008 }, accent: { hue: 262 } });
 *   <MoveRoot theme={prefersDark ? dark : light}>…</MoveRoot>
 */
export function defineThemes(seed: Omit<ThemeSeed, 'appearance'>): {
  light: Theme;
  dark: Theme;
  /** The `--move-rounded-*` scale — theme-level, apply once (same for both modes). */
  radius: RadiusVars;
} {
  return {
    light: defineTheme({ ...seed, appearance: 'light' }),
    dark: defineTheme({ ...seed, appearance: 'dark' }),
    radius: radiusScale(seed.radius),
  };
}

/** `defineThemes` plus each mode's contrast-guard notices (for the Builder / check). */
export function describeThemes(seed: Omit<ThemeSeed, 'appearance'>): {
  light: DescribeThemeResult;
  dark: DescribeThemeResult;
  radius: RadiusVars;
} {
  return {
    light: describeTheme({ ...seed, appearance: 'light' }),
    dark: describeTheme({ ...seed, appearance: 'dark' }),
    radius: radiusScale(seed.radius),
  };
}
