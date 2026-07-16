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
  /** Categorical palette (Badge/Avatar/… `color` prop) styling. `'harmonize'` (default) mutes
   *  the 13 colors along with the accent saturation; `'vivid'` keeps full Open Color regardless.
   *  Semantic status colors are unaffected either way. */
  palette?: 'harmonize' | 'vivid';
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

// Per-palette readable text + soft-bg. Hand-tuned per palette for AA; ported verbatim.
const PALETTE = {
  light: {
    '--move-gray-text': 'var(--move-gray-700)',
    '--move-gray-soft-bg': 'var(--move-gray-100)',
    '--move-red-text': 'var(--move-red-900)',
    '--move-red-soft-bg': 'var(--move-red-50)',
    '--move-pink-text': 'var(--move-pink-800)',
    '--move-pink-soft-bg': 'var(--move-pink-50)',
    '--move-grape-text': 'var(--move-grape-800)',
    '--move-grape-soft-bg': 'var(--move-grape-50)',
    '--move-violet-text': 'var(--move-violet-700)',
    '--move-violet-soft-bg': 'var(--move-violet-50)',
    '--move-indigo-text': 'var(--move-indigo-800)',
    '--move-indigo-soft-bg': 'var(--move-indigo-50)',
    '--move-blue-text': 'var(--move-blue-800)',
    '--move-blue-soft-bg': 'var(--move-blue-50)',
    '--move-cyan-text': 'var(--move-cyan-900)',
    '--move-cyan-soft-bg': 'var(--move-cyan-50)',
    '--move-teal-text': 'var(--move-teal-900)',
    '--move-teal-soft-bg': 'var(--move-teal-50)',
    '--move-green-text': 'var(--move-green-950)',
    '--move-green-soft-bg': 'var(--move-green-50)',
    '--move-lime-text': 'var(--move-lime-950)',
    '--move-lime-soft-bg': 'var(--move-lime-50)',
    '--move-yellow-text': 'var(--move-yellow-950)',
    '--move-yellow-soft-bg': 'var(--move-yellow-50)',
    '--move-orange-text': 'var(--move-orange-950)',
    '--move-orange-soft-bg': 'var(--move-orange-50)',
  },
  dark: {
    '--move-gray-text': 'var(--move-gray-300)',
    '--move-gray-soft-bg': 'var(--move-gray-950)',
    '--move-red-text': 'var(--move-red-300)',
    '--move-red-soft-bg': 'var(--move-red-950)',
    '--move-pink-text': 'var(--move-pink-300)',
    '--move-pink-soft-bg': 'var(--move-pink-950)',
    '--move-grape-text': 'var(--move-grape-300)',
    '--move-grape-soft-bg': 'var(--move-grape-950)',
    '--move-violet-text': 'var(--move-violet-300)',
    '--move-violet-soft-bg': 'var(--move-violet-950)',
    '--move-indigo-text': 'var(--move-indigo-300)',
    '--move-indigo-soft-bg': 'var(--move-indigo-950)',
    '--move-blue-text': 'var(--move-blue-300)',
    '--move-blue-soft-bg': 'var(--move-blue-950)',
    '--move-cyan-text': 'var(--move-cyan-300)',
    '--move-cyan-soft-bg': 'var(--move-cyan-950)',
    '--move-teal-text': 'var(--move-teal-300)',
    '--move-teal-soft-bg': 'var(--move-teal-950)',
    '--move-green-text': 'var(--move-green-300)',
    '--move-green-soft-bg': 'var(--move-green-950)',
    '--move-lime-text': 'var(--move-lime-300)',
    '--move-lime-soft-bg': 'var(--move-lime-950)',
    '--move-yellow-text': 'var(--move-yellow-300)',
    '--move-yellow-soft-bg': 'var(--move-yellow-950)',
    '--move-orange-text': 'var(--move-orange-300)',
    '--move-orange-soft-bg': 'var(--move-orange-950)',
  },
} as const;

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

  // lin cache for computed surfaces (fg clamps read these)
  const lin: Record<string, LinRGB> = {};
  const out: Partial<ThemeTokens> = {};

  // 1. surfaces + borders
  for (const s of SURFACES) {
    const L = dark ? s.Ld : s.Ll;
    const C = nC * s.cm;
    lin[s.k] = oklchToLinear(L, C, nH);
    (out as Record<string, string>)[s.k] = oklchHex(L, C, nH);
  }

  // 2. text tiers — clamped against the worst realistic surface
  for (const t of TEXT) {
    const L = dark ? t.Ld : t.Ll;
    const C = nC * t.cm;
    const surfs = t.on.map((k) => lin[k]);
    const r = clampToContrast(L, C, nH, surfs, t.target, dark);
    (out as Record<string, string>)[t.k] = r.hex;
    lin[t.k] = oklchToLinear(r.L, C, nH);
    if (r.clamped) notices.push(`${t.k} nudged to hold ${t.target}:1`);
  }

  // 3. inverse surface (opposite polarity)
  (out as Record<string, string>)['--move-bg-inverse'] = oklchHex(dark ? 0.955 : 0.2, nC, nH);
  (out as Record<string, string>)['--move-fg-inverse'] = oklchHex(dark ? 0.18 : 0.96, nC * 0.3, nH);

  const baseLin = [
    lin['--move-bg-base'],
    lin['--move-bg-subtle'],
    lin['--move-bg-muted'],
    lin['--move-bg-emphasis'],
  ];

  // 4. accent fill — clamp lightness so its label clears AA
  {
    // Accent-fill lightness per mode. Dark lifts one controlled step (0.58 vs
    // light's 0.52) so the accent pops against a near-black ground — the usual
    // dark-mode convention — but stays well short of the old 0.62, which pushed
    // deep hues (indigo/violet/blue) into a pale, black-label pastel. At 0.58 the
    // fill keeps a saturated body + white label; the loop below still lightens
    // naturally-light hues until THEIR label clears AA.
    let pL = dark ? 0.58 : 0.52;
    let fg = bestOn(oklchToLinear(pL, aC, aH));
    let tries = 0;
    const fgLin = () =>
      fg === 'var(--move-white)' ? oklchToLinear(0.99, 0, 0) : oklchToLinear(0.22, 0, 0);
    while (contrast(fgLin(), oklchToLinear(pL, aC, aH)) < 4.5 && tries < 80) {
      pL += fg === 'var(--move-white)' ? -0.008 : 0.008;
      if (pL < 0.14 || pL > 0.9) break;
      fg = bestOn(oklchToLinear(pL, aC, aH));
      tries += 1;
    }
    if (tries > 0) notices.push('--move-primary darkened so its label holds AA');
    (out as Record<string, string>)['--move-primary'] = oklchHex(pL, aC, aH);
    (out as Record<string, string>)['--move-primary-hover'] = oklchHex(
      pL + (dark ? 0.06 : -0.06),
      aC,
      aH,
    );
    (out as Record<string, string>)['--move-primary-active'] = oklchHex(
      pL + (dark ? -0.06 : 0.06),
      aC,
      aH,
    );
    (out as Record<string, string>)['--move-primary-subtle'] = oklchHex(
      dark ? 0.2 : 0.95,
      aC * 0.35,
      aH,
    );
    (out as Record<string, string>)['--move-primary-fg'] = fg;
  }

  // 5. accent TEXT (link) — clamp to AA on every surface.
  //    Chroma tracks the accent's own (0.75× of it) so a desaturated accent — down to a
  //    fully greyscale aC:0 — carries through to links, rather than staying colored.
  {
    const lC = aC * 0.75;
    const r = clampToContrast(dark ? 0.78 : 0.44, lC, aH, baseLin, 4.5, dark);
    (out as Record<string, string>)['--move-link'] = r.hex;
    (out as Record<string, string>)['--move-link-hover'] = oklchHex(
      r.L + (dark ? 0.06 : -0.06),
      lC,
      aH,
    );
    if (r.clamped) notices.push('--move-link nudged to hold AA on surfaces');
  }

  // 6. focus ring — clamp to 3:1 on surfaces (WCAG 1.4.11 / 2.2 §2.4.13).
  //    Chroma tracks the accent (0.875× of it) so it desaturates with a greyscale accent too.
  {
    const fC = aC * 0.875;
    const r = clampToContrast(
      dark ? 0.68 : 0.55,
      fC,
      aH,
      [lin['--move-bg-base'], lin['--move-bg-subtle']],
      3,
      dark,
    );
    (out as Record<string, string>)['--move-focus-ring-color'] = r.hex;
    if (r.clamped) notices.push('--move-focus-ring-color nudged to hold 3:1');
  }

  // 6b. interactive control borders — 3:1 non-text contrast (WCAG 1.4.11).
  //     Seeded toward the surfaces so the search settles on the SOFTEST border
  //     that still clears 3:1 — never harsher than the ground demands. Chroma
  //     tracks the neutral ramp so the border carries the theme's whisper of tint.
  //     `interactive` holds against the base/subtle ground; `-strong` also clears
  //     the lighter muted surface (swapped in per [data-surface], see surface.css).
  {
    const bC = nC * 1.1;
    const seed = dark ? 0.42 : 0.62;
    const soft = clampToContrast(
      seed,
      bC,
      nH,
      [lin['--move-bg-base'], lin['--move-bg-subtle']],
      3,
      dark,
    );
    (out as Record<string, string>)['--move-border-interactive'] = soft.hex;
    const strong = clampToContrast(
      seed,
      bC,
      nH,
      [lin['--move-bg-muted'], lin['--move-bg-emphasis']],
      3,
      dark,
    );
    (out as Record<string, string>)['--move-border-interactive-strong'] = strong.hex;
  }

  // 7. secondary (neutral fill)
  {
    const sL = dark ? 0.32 : 0.9;
    const sC = nC * 1.2;
    (out as Record<string, string>)['--move-secondary'] = oklchHex(sL, sC, nH);
    (out as Record<string, string>)['--move-secondary-hover'] = oklchHex(
      sL + (dark ? 0.05 : -0.05),
      sC,
      nH,
    );
    (out as Record<string, string>)['--move-secondary-active'] = oklchHex(
      sL + (dark ? -0.05 : 0.05),
      sC,
      nH,
    );
    (out as Record<string, string>)['--move-secondary-fg'] = (out as Record<string, string>)[
      '--move-fg-base'
    ];
  }

  const ap = dark ? 'dark' : 'light';
  // Palette colorfulness tracks accent saturation (aC), floored so it never fully greys out.
  // Opt out with `palette: 'vivid'` to keep full Open Color regardless of the accent.
  const paletteDesat =
    seed.palette === 'vivid' ? 0 : Math.max(0, 1 - aC / 0.16) * PALETTE_DESAT_MAX;
  const tokens = {
    ...out,
    ...statusBlock(status, ap),
    ...harmonizePalette(PALETTE[ap] as Record<string, string>, paletteDesat * 100),
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
