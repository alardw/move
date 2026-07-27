/**
 * The categorical color ramps — the SINGLE source for every palette value.
 *
 * These 13 ramps back the `color` prop (Badge, Avatar, ChatBubble, Stepper,
 * Timeline) and the status colors. They were CSS, which meant nothing in TS
 * could read them: `defineTheme` could only reference shades by name, the Theme
 * Builder had to hand-copy a set of OKLCH approximations to draw its swatches,
 * and the skills carried a third transcription. Three copies of one palette, and
 * the copies had already drifted.
 *
 * So the ramps live here as data, and `primitives/colors.css` is GENERATED from
 * them (`npm run gen:tokens`, proven by `check:tokens-surface`). The CSS still
 * ships — components and consumers reference `--move-red-700` directly — it just
 * stops being the source. Anything that needs the numbers imports this.
 *
 * PRIMITIVE ONLY. No value here answers to a contrast floor: these are raw hues,
 * not decisions. The semantic layer over them — `-text`, `-soft-bg`, `-fg-solid`,
 * each of which owes a WCAG ratio against a specific background — is derived per
 * theme by the engine, the same way the brand's `--move-link` and
 * `--move-primary-fg` already are.
 */

/** Shade stops, light to dark. 950 is a Move addition (Open Color stops at 900). */
export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Shade = (typeof SHADES)[number];

/** One ramp: 11 hex stops in SHADES order. */
export type Ramp = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export interface PaletteEntry {
  /** Palette name — matches MOVE_COLORS, the `Color` type, and the `color` prop. */
  name: string;
  /** What it's for, and its Open Color provenance. Rendered into the generated CSS. */
  note: readonly string[];
  /** Hex stops in SHADES order. */
  ramp: Ramp;
}

/**
 * Open Color (MIT) plus Move's own gray, in canonical order. The 950 stop is
 * interpolated one step darker than Open Color's 900, for dark-mode tinted
 * backgrounds (`-soft-bg`).
 */
export const PALETTE: readonly PaletteEntry[] = [
  {
    name: 'gray',
    note: ['Gray — neutral base (Move custom scale)'],
    ramp: [
      '#fafafa',
      '#f4f4f5',
      '#e4e4e7',
      '#d4d4d8',
      '#a1a1aa',
      '#71717a',
      '#52525b',
      '#3f3f46',
      '#27272a',
      '#18181b',
      '#09090b',
    ],
  },
  {
    name: 'red',
    note: ['Red — errors, danger, destructive', 'Open Color red'],
    ramp: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a',
      '#7a1a1a',
    ],
  },
  {
    name: 'pink',
    note: ['Pink — highlights, playful accents', 'Open Color pink'],
    ramp: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d',
      '#6b1434',
    ],
  },
  {
    name: 'grape',
    note: ['Grape — warm purple, tags, categories', 'Open Color grape'],
    ramp: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c',
      '#5a1e6a',
    ],
  },
  {
    name: 'violet',
    note: ['Violet — cool purple, avatars, badges', 'Open Color violet'],
    ramp: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4',
      '#3d2880',
    ],
  },
  {
    name: 'indigo',
    note: ['Indigo — brand primary, links, focus', 'Open Color indigo'],
    ramp: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7',
      '#233080',
    ],
  },
  {
    name: 'blue',
    note: ['Blue — info, links, data', 'Open Color blue'],
    ramp: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
      '#0f406e',
    ],
  },
  {
    name: 'cyan',
    note: ['Cyan — cool info, data visualization', 'Open Color cyan'],
    ramp: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285',
      '#074a57',
    ],
  },
  {
    name: 'teal',
    note: ['Teal — cool secondary, dashboards', 'Open Color teal'],
    ramp: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b',
      '#05503a',
    ],
  },
  {
    name: 'green',
    note: ['Green — success, positive', 'Open Color green'],
    ramp: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057',
      '#37b24d',
      '#2f9e44',
      '#2b8a3e',
      '#1b5727',
    ],
  },
  {
    name: 'lime',
    note: ['Lime — fresh positive, eco', 'Open Color lime'],
    ramp: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d',
      '#3b5f09',
    ],
  },
  {
    name: 'yellow',
    note: ['Yellow — warnings, caution', 'Open Color yellow'],
    ramp: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005',
      '#f59f00',
      '#f08c00',
      '#e67700',
      '#8a4800',
    ],
  },
  {
    name: 'orange',
    note: ['Orange — warm accent', 'Open Color orange'],
    ramp: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f',
      '#873008',
    ],
  },
];

/**
 * The SEMANTIC layer's shade choices, per appearance.
 *
 * Which stop of a ramp serves as readable text, and which as the soft tinted
 * background. These were written out as 26 literal `var(--move-red-900)` strings
 * per mode in defineTheme AND again as a fallback block in semantic.css — where
 * 8 of the 26 had quietly drifted apart, invisible because ThemeProvider always
 * applies a theme over the fallback. One declaration now feeds both.
 *
 * These are still hand-picked, and hand-picking is why three palettes ship below
 * AA (light red 4.46, blue 4.10, teal 4.09 as text on the page background). The
 * clamp replaces the choice with a computed lightness; until then this is at
 * least a single, inspectable list of what was chosen.
 */
export interface SemanticShades {
  /** Readable text on the page background and on softBg. */
  text: Shade;
  /** Subtle tinted background. */
  softBg: Shade;
}

/** Shade choices that hold for most palettes, per appearance. */
const SEMANTIC_DEFAULT: Record<'light' | 'dark', SemanticShades> = {
  light: { text: 900, softBg: 50 },
  dark: { text: 300, softBg: 950 },
};

/** Palettes whose lightness curve needs a different stop than the default. */
const SEMANTIC_OVERRIDE: Partial<
  Record<string, Partial<Record<'light' | 'dark', Partial<SemanticShades>>>>
> = {
  gray: { light: { text: 700, softBg: 100 } },
  pink: { light: { text: 800 } },
  grape: { light: { text: 800 } },
  violet: { light: { text: 700 } },
  indigo: { light: { text: 800 } },
  blue: { light: { text: 800 } },
  // Naturally light hues need a deeper stop to clear AA on a white ground.
  green: { light: { text: 950 } },
  lime: { light: { text: 950 } },
  yellow: { light: { text: 950 } },
  orange: { light: { text: 950 } },
};

/** The semantic shade choices for one palette in one appearance. */
export function semanticShades(name: string, appearance: 'light' | 'dark'): SemanticShades {
  return {
    ...SEMANTIC_DEFAULT[appearance],
    ...SEMANTIC_OVERRIDE[name]?.[appearance],
  };
}

/**
 * Which ramp stops back the two mode-independent roles. `solid` is the filled
 * surface (Badge solid, Avatar, the Stepper's complete step); `border` is its
 * edge, one stop darker.
 */
export const SOLID_SHADE: Shade = 600;
export const BORDER_SHADE: Shade = 700;

/** Text/icon on a solid fill — today's hand-set choice per palette. */
const FG_SOLID_BLACK = new Set(['lime', 'yellow', 'orange']);

/** `'--move-white'` or `'--move-black'`, whichever is legible on this fill. */
export function fgSolidToken(name: string): string {
  return FG_SOLID_BLACK.has(name) ? '--move-black' : '--move-white';
}

/** Absolutes — not part of any ramp, and never theme-derived. */
export const STATIC_COLORS: readonly (readonly [string, string])[] = [
  ['--move-white', '#ffffff'],
  ['--move-black', '#000000'],
  ['--move-transparent', 'transparent'],
];

/** A ramp by palette name. */
export function rampOf(name: string): Ramp | undefined {
  return PALETTE.find((p) => p.name === name)?.ramp;
}

/** One stop, e.g. `shadeOf('red', 600)` → `'#fa5252'`. */
export function shadeOf(name: string, shade: Shade): string | undefined {
  const ramp = rampOf(name);
  return ramp?.[SHADES.indexOf(shade)];
}
