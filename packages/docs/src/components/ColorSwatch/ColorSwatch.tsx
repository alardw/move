import styles from './ColorSwatch.module.css';

/**
 * Returns true when the string looks like a renderable color value —
 * literal hex/rgb/hsl/named, or a CSS variable whose name strongly
 * suggests it resolves to a color. Used to decide whether a token row
 * deserves a swatch; non-color tokens (spacing, radius, shadow) skip it.
 */
export function isColorValue(value: string): boolean {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return true;
  if (/^rgba?\(/.test(v)) return true;
  if (/^hsla?\(/.test(v)) return true;
  if (v === 'transparent' || v === 'currentColor') return true;
  if (/^var\(/.test(v)) {
    // Move colour tokens are prefixed with a small set of recognisable words.
    return /--move-(bg|border|fg|primary|secondary|error|warning|success|info|surface|selected|gray|red|pink|grape|violet|indigo|blue|cyan|teal|green|lime|yellow|orange|scrollbar)/.test(v);
  }
  return false;
}

export interface ColorSwatchProps {
  value: string;
}

export function ColorSwatch({ value }: ColorSwatchProps) {
  return <span className={styles.swatch} style={{ backgroundColor: value }} aria-hidden="true" />;
}
