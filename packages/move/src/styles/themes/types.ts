import type { BuiltInColor, PaletteRole } from './palette';
/**
 * Every palette's five semantic roles, keyed off the ramps in palette.ts.
 *
 * Written out by hand this is 65 lines that must stay in step with the ramp list;
 * as a mapped type, adding a palette or a role updates the contract in one place.
 */
type PaletteRoleTokens = {
  [K in `--move-${BuiltInColor}-${PaletteRole}`]: string;
};

export interface ThemeTokens extends PaletteRoleTokens {
  // Background
  '--move-bg-base': string;
  '--move-bg-subtle': string;
  '--move-bg-muted': string;
  '--move-bg-emphasis': string;
  '--move-bg-inverse': string;

  // Foreground
  '--move-fg-base': string;
  '--move-fg-muted': string;
  '--move-fg-subtle': string;
  '--move-fg-inverse': string;

  // Border
  '--move-border-base': string;
  '--move-border-muted': string;
  '--move-border-emphasis': string;

  // Interactive control borders — clamped to WCAG 1.4.11 non-text contrast (3:1)
  // against the surfaces a control realistically sits on. `interactive` targets
  // the base/subtle ground; `-strong` holds 3:1 on more-elevated surfaces and is
  // swapped in per [data-surface] (see surface.css).
  '--move-border-interactive': string;
  '--move-border-interactive-strong': string;

  // Primary
  '--move-primary': string;
  '--move-primary-hover': string;
  '--move-primary-active': string;
  '--move-primary-subtle': string;
  '--move-primary-fg': string;

  // Accent TEXT — the accent hue tuned as readable on-surface text, as distinct
  // from the solid --move-primary FILL. Lighter than --move-primary in dark mode
  // so it clears WCAG AA against the page background.
  //
  // Any accent-coloured text takes this: a "today" marker, a required asterisk,
  // an eyebrow, a step number. Reaching for a palette token instead (
  // --move-indigo-text) is what made an amber-themed app render blue eyebrows.
  '--move-accent-text': string;
  '--move-accent-text-hover': string;

  // Link — the same value under its most common name. Kept so `--move-link`
  // stays meaningful at a link call site, and so nothing that already uses it
  // breaks.
  '--move-link': string;
  '--move-link-hover': string;

  // Secondary
  '--move-secondary': string;
  '--move-secondary-hover': string;
  '--move-secondary-active': string;
  '--move-secondary-fg': string;

  // Success
  '--move-success': string;
  '--move-success-hover': string;
  '--move-success-subtle': string;
  '--move-success-fg': string;

  // Warning
  '--move-warning': string;
  '--move-warning-hover': string;
  '--move-warning-subtle': string;
  '--move-warning-fg': string;

  // Error
  '--move-error': string;
  '--move-error-hover': string;
  '--move-error-subtle': string;
  '--move-error-fg': string;

  // Info
  '--move-info': string;
  '--move-info-hover': string;
  '--move-info-subtle': string;
  '--move-info-fg': string;

  // Palette roles come from PaletteRoleTokens below — 5 roles × 13 palettes,
  // derived from the ramps rather than transcribed. This block used to list
  // text + soft-bg by hand for all 13.

  // Focus
  '--move-focus-ring-color': string;

  // Overlay
  '--move-overlay': string;

  // Scrollbar
  '--move-scrollbar-thumb': string;
  '--move-scrollbar-track': string;

  // Shadows — config
  '--move-shadow-angle': string;
  // Shadows — per surface (5 × 4 = 20)
  '--move-shadow-base-sm': string;
  '--move-shadow-base-md': string;
  '--move-shadow-base-lg': string;
  '--move-shadow-base-xl': string;
  '--move-shadow-subtle-sm': string;
  '--move-shadow-subtle-md': string;
  '--move-shadow-subtle-lg': string;
  '--move-shadow-subtle-xl': string;
  '--move-shadow-muted-sm': string;
  '--move-shadow-muted-md': string;
  '--move-shadow-muted-lg': string;
  '--move-shadow-muted-xl': string;
  '--move-shadow-emphasis-sm': string;
  '--move-shadow-emphasis-md': string;
  '--move-shadow-emphasis-lg': string;
  '--move-shadow-emphasis-xl': string;
  '--move-shadow-inverse-sm': string;
  '--move-shadow-inverse-md': string;
  '--move-shadow-inverse-lg': string;
  '--move-shadow-inverse-xl': string;
}

export interface ThemeAnimation {
  spring: {
    mass: number;
    stiffness: number;
    damping: number;
  };
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  reducedMotion: boolean;
}

export interface Theme {
  name: string;
  tokens: ThemeTokens;
  animation: ThemeAnimation;
}
