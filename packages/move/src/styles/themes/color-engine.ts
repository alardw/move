/**
 * Color engine — the pure math behind `defineTheme`.
 *
 * OKLCH ⇄ sRGB conversion + WCAG 2.2 contrast, and a lightness clamp that holds
 * a target contrast ratio. Framework-agnostic and side-effect-free so it can run
 * in `defineTheme`, the `check:theme-contrast` guard, and the Theme Builder alike.
 *
 * WCAG contrast is computed from the ACTUAL displayed 8-bit sRGB (matches
 * WebAIM/axe), not full-precision linear values.
 */

/** Linear-light sRGB triple, each channel clamped to [0,1] (out-of-gamut folded in). */
export type LinRGB = readonly [number, number, number];

function oklabToLinearRaw(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inSrgb = (lin: [number, number, number]) => lin.every((x) => x >= -1e-4 && x <= 1 + 1e-4);
const clamp01 = (lin: [number, number, number]): LinRGB => [
  Math.min(1, Math.max(0, lin[0])),
  Math.min(1, Math.max(0, lin[1])),
  Math.min(1, Math.max(0, lin[2])),
];

/**
 * OKLCH → linear-light sRGB. L in [0,1], C ~[0,0.4], H in degrees.
 *
 * Out-of-gamut colors are **gamut-mapped by reducing chroma** (lightness + hue
 * preserved), NOT clamped per channel — per-channel clamping shifts the hue, and
 * shifts it *differently* at different lightnesses, which made a single seed read
 * bluer in light and greener in dark. Reducing chroma keeps the hue identical
 * across modes.
 */
export function oklchToLinear(L: number, C: number, H: number): LinRGB {
  const hr = (H * Math.PI) / 180;
  const ca = Math.cos(hr);
  const cb = Math.sin(hr);
  const at = (c: number) => oklabToLinearRaw(L, c * ca, c * cb);
  const full = at(C);
  if (inSrgb(full)) return clamp01(full);
  // Binary-search the largest chroma that fits sRGB at this L + H.
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 18; i += 1) {
    const mid = (lo + hi) / 2;
    if (inSrgb(at(mid))) lo = mid;
    else hi = mid;
  }
  return clamp01(at(lo));
}

const linearToSrgb8 = (lin: LinRGB): [number, number, number] => {
  const g = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  return [Math.round(g(lin[0]) * 255), Math.round(g(lin[1]) * 255), Math.round(g(lin[2]) * 255)];
};

/** Linear sRGB → `#rrggbb`. */
export function linearToHex(lin: LinRGB): string {
  return (
    '#' +
    linearToSrgb8(lin)
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

/** `oklch(L C H)` → `#rrggbb`. */
export function oklchHex(L: number, C: number, H: number): string {
  return linearToHex(oklchToLinear(L, C, H));
}

/** `#rgb`/`#rrggbb` → linear-light sRGB (for auditing existing hex colors). */
export function hexToLinear(hex: string): LinRGB {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.slice(0, 6);
  const n = parseInt(full, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return [ch[0], ch[1], ch[2]];
}

/** Linear-light sRGB → OKLCH `{ L, C, H }` (H in degrees). Inverse of oklchToLinear;
 *  used to read a hue/chroma back out of a picked color (Theme Builder). */
export function linearToOklch(lin: LinRGB): { L: number; C: number; H: number } {
  const [r, g, b] = lin;
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C: Math.hypot(a, bb), H };
}

/** `#hex` → OKLCH `{ L, C, H }`. */
export function hexToOklch(hex: string): { L: number; C: number; H: number } {
  return linearToOklch(hexToLinear(hex));
}

/** WCAG relative luminance of a linear-sRGB color, via the displayed 8-bit values. */
export function luminance(lin: LinRGB): number {
  const [r, g, b] = linearToSrgb8(lin).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.2 contrast ratio between two colors (order-independent), 1..21. */
export function contrast(a: LinRGB, b: LinRGB): number {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Adjust an OKLCH color's lightness until it clears `target` contrast against the
 * WORST of `surfaces` — chroma and hue stay fixed, lightness bends. `dark` sets the
 * search direction (dark themes brighten text, light themes darken it).
 *
 * Returns the resolved `{ L, hex, ratio, clamped }`. `clamped: true` means the seed
 * would not have met the target unaided — surface this to the themer, never block.
 */
export function clampToContrast(
  L: number,
  C: number,
  H: number,
  surfaces: LinRGB[],
  target: number,
  dark: boolean,
): { L: number; hex: string; ratio: number; clamped: boolean } {
  const worst = (lL: number) => {
    const fg = oklchToLinear(lL, C, H);
    return Math.min(...surfaces.map((s) => contrast(fg, s)));
  };
  let cur = L;
  let tries = 0;
  while (worst(cur) < target && tries < 140) {
    cur += dark ? 0.006 : -0.006;
    tries += 1;
    if (cur >= 0.995 || cur <= 0.02) break;
  }
  return { L: cur, hex: oklchHex(cur, C, H), ratio: worst(cur), clamped: tries > 0 };
}

/** WCAG 2.2 conformance level for a text pair. `large` text uses the 3:1 floor. */
export function wcagLevel(ratio: number, large = false): 'AAA' | 'AA' | 'fail' {
  if (large) return ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'fail';
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail';
}
