// Generated from ColorPicker.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
// Pure color conversion utilities — no framework dependencies

// ============================================================================
// Types
// ============================================================================

export interface HsvColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a: number; // 0-1
}

export interface RgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

export type ColorFormat = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
export type BaseColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorChannel {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
}

// ============================================================================
// HSV ↔ RGB
// ============================================================================

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const S = s / 100;
  const V = v / 100;
  const C = V * S;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = V - C;

  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = C; g = X; b = 0; }
  else if (h < 120) { r = X; g = C; b = 0; }
  else if (h < 180) { r = 0; g = C; b = X; }
  else if (h < 240) { r = 0; g = X; b = C; }
  else if (h < 300) { r = X; g = 0; b = C; }
  else              { r = C; g = 0; b = X; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d + 6) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
  }

  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;

  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
}

// ============================================================================
// RGB ↔ Hex
// ============================================================================

function toHex2(n: number): string {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
}

export function rgbaToHexa(r: number, g: number, b: number, a: number): string {
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2(Math.round(a * 255))}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } | null {
  const cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3 || cleaned.length === 4) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    const a = cleaned.length === 4 ? parseInt(cleaned[3] + cleaned[3], 16) / 255 : 1;
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
    return { r, g, b, a };
  }
  if (cleaned.length === 6 || cleaned.length === 8) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const a = cleaned.length === 8 ? parseInt(cleaned.slice(6, 8), 16) / 255 : 1;
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
    return { r, g, b, a };
  }
  return null;
}

// ============================================================================
// RGB ↔ HSL
// ============================================================================

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === R) h = ((G - B) / d + 6) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const S = s / 100;
  const L = l / 100;
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = L - C / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = C; g = X; b = 0; }
  else if (h < 120) { r = X; g = C; b = 0; }
  else if (h < 180) { r = 0; g = C; b = X; }
  else if (h < 240) { r = 0; g = X; b = C; }
  else if (h < 300) { r = X; g = 0; b = C; }
  else              { r = C; g = 0; b = X; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// ============================================================================
// Parse any color string → HsvColor
// ============================================================================

const RGB_RE = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+))?\s*\)$/i;
const HSL_RE = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*([\d.]+))?\s*\)$/i;

export function parseColor(value: string): HsvColor | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Try hex
  if (trimmed.startsWith('#')) {
    const rgb = hexToRgb(trimmed);
    if (!rgb) return null;
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return { ...hsv, a: rgb.a };
  }

  // Try rgb/rgba
  const rgbMatch = trimmed.match(RGB_RE);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1) return null;
    const hsv = rgbToHsv(r, g, b);
    return { ...hsv, a };
  }

  // Try hsl/hsla
  const hslMatch = trimmed.match(HSL_RE);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10);
    const l = parseInt(hslMatch[3], 10);
    const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;
    if (h > 360 || s > 100 || l > 100 || a < 0 || a > 1) return null;
    const rgb = hslToRgb(h, s, l);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return { ...hsv, a };
  }

  return null;
}

// ============================================================================
// Format HsvColor → string
// ============================================================================

export function formatColor(hsv: HsvColor, format: ColorFormat): string {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

  switch (format) {
    case 'hex':
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    case 'hexa':
      return rgbaToHexa(rgb.r, rgb.g, rgb.b, hsv.a);
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'rgba':
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${round2(hsv.a)})`;
    case 'hsl': {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    case 'hsla': {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${round2(hsv.a)})`;
    }
    default:
      return rgbToHex(rgb.r, rgb.g, rgb.b);
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ============================================================================
// Validate
// ============================================================================

export function isValidColor(value: string): boolean {
  return parseColor(value) !== null;
}

// ============================================================================
// Helpers
// ============================================================================

export function hasAlphaChannel(format: ColorFormat): boolean {
  return format === 'hexa' || format === 'rgba' || format === 'hsla';
}

export function getBaseFormat(format: ColorFormat): BaseColorFormat {
  if (format === 'hex' || format === 'hexa') return 'hex';
  if (format === 'rgb' || format === 'rgba') return 'rgb';
  return 'hsl';
}

export function formatWithAlpha(base: BaseColorFormat, withAlpha: boolean): ColorFormat {
  if (!withAlpha) return base;
  if (base === 'hex') return 'hexa';
  if (base === 'rgb') return 'rgba';
  return 'hsla';
}

export function getColorChannels(hsv: HsvColor, format: ColorFormat): ColorChannel[] {
  const base = getBaseFormat(format);
  if (base === 'rgb') {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    return [
      { label: 'R', value: rgb.r, min: 0, max: 255 },
      { label: 'G', value: rgb.g, min: 0, max: 255 },
      { label: 'B', value: rgb.b, min: 0, max: 255 },
    ];
  }
  if (base === 'hsl') {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return [
      { label: 'H', value: hsl.h, min: 0, max: 360 },
      { label: 'S', value: hsl.s, min: 0, max: 100, suffix: '%' },
      { label: 'L', value: hsl.l, min: 0, max: 100, suffix: '%' },
    ];
  }
  // hex — no individual channels
  return [];
}

export function setChannelFromInput(
  hsv: HsvColor,
  format: ColorFormat,
  channelIndex: number,
  value: number,
): HsvColor {
  const base = getBaseFormat(format);
  if (base === 'rgb') {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const arr = [rgb.r, rgb.g, rgb.b];
    arr[channelIndex] = Math.max(0, Math.min(255, Math.round(value)));
    const newHsv = rgbToHsv(arr[0], arr[1], arr[2]);
    return { ...newHsv, a: hsv.a };
  }
  if (base === 'hsl') {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const arr = [hsl.h, hsl.s, hsl.l];
    const maxes = [360, 100, 100];
    arr[channelIndex] = Math.max(0, Math.min(maxes[channelIndex], Math.round(value)));
    const newRgb = hslToRgb(arr[0], arr[1], arr[2]);
    const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
    return { ...newHsv, a: hsv.a };
  }
  return hsv;
}

export function getHexString(hsv: HsvColor): string {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return rgbToHex(rgb.r, rgb.g, rgb.b).slice(1);
}
