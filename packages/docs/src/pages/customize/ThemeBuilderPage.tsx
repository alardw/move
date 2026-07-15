import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Grid,
  Heading,
  Text,
  Badge,
  Button,
  Alert,
  Code,
  Icon,
  Link,
  Breadcrumb,
  InputRange,
  Select,
  Switch,
  ThemeProvider,
  describeThemes,
  auditTheme,
  oklchHex,
  hexToLinear,
  type AuditRow,
  type AuditStatus,
  type Theme,
  type LinRGB,
} from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

const BADGES = [
  { icon: 'palette', label: 'One seed → light & dark' },
  { icon: 'circle-check', label: 'WCAG 2.2 AA' },
];

const TOC: TocItem[] = [
  { href: '#import', label: 'Import your theme' },
  { href: '#build', label: 'Build your theme' },
  { href: '#config', label: 'Use it in your app' },
  { href: '#override', label: 'Override anything' },
];

// Distinctive full looks — colour + radius + fonts — inspired by the aesthetics of
// well-known product teams (the vibe, not the trademarks).
// Each preset is a full identity — neutral tint (hue + chroma), accent hue, corner radius,
// and a display+body pairing. Accent hues are the *measured OKLCH* of real brand colours;
// pairings are drawn from published award-winning combinations. Bodies are deliberately
// varied (only one repeats Inter) so the samples don't read the same.
//   Accents (hex → OKLCH hue): Stripe #635BFF 278° · Linear #7C5CFC 287° · Vercel #0070F3 258°
//   · Supabase #3ECF8E 159° · Notion #14B8A6 182° · terracotta #C4623F 40° · rose 350°
const PRESETS: { label: string; hue: number; chroma: number; accentHue: number; accentChroma?: number; radius: number; heading: string; body: string }[] = [
  // Stock Move — barely-there gray tint + a balanced indigo, system fonts (matches the docs' own theme).
  { label: 'Move', hue: 250, chroma: 0.008, accentHue: 262, accentChroma: 0.16, radius: 1, heading: 'System', body: 'System' },
  // Linear — a vivid purple on a distinctly cool zinc ground, geometric display, tight corners.
  { label: 'Midnight', hue: 287, chroma: 0.024, accentHue: 287, accentChroma: 0.21, radius: 0.6, heading: 'Space Grotesk', body: 'Inter' },
  // Vercel / Geist — fully greyscale: zero-tint ground AND a neutral accent, monospaced over Plex.
  { label: 'Mono', hue: 250, chroma: 0, accentHue: 258, accentChroma: 0, radius: 0.2, heading: 'JetBrains Mono', body: 'IBM Plex Sans' },
  // Supabase — a punchy emerald on a green-tinted near-black ground, expressive grotesque.
  { label: 'Emerald', hue: 160, chroma: 0.0135, accentHue: 159, accentChroma: 0.18, radius: 0.8, heading: 'Bricolage Grotesque', body: 'Work Sans' },
  // NYT / editorial — a muted terracotta on warm cream paper, all-serif voice (Fraunces + Lora).
  { label: 'Editorial', hue: 60, chroma: 0.02, accentHue: 40, accentChroma: 0.09, radius: 1.2, heading: 'Fraunces', body: 'Lora' },
  // CONTRAST — warm peach ground meets a cool teal accent (bg 30° vs accent 195°), pillowy.
  { label: 'Dusk', hue: 30, chroma: 0.03, accentHue: 195, accentChroma: 0.14, radius: 1.5, heading: 'Outfit', body: 'Manrope' },
  // CONTRAST — cool violet ground meets a rich gold accent (bg 300° vs accent 75°), serif display.
  { label: 'Aubergine', hue: 300, chroma: 0.0135, accentHue: 75, accentChroma: 0.19, radius: 0.5, heading: 'Playfair Display', body: 'Libre Franklin' },
];

// A curated set of Google Fonts for the preview. Ship self-hosted (Fontsource) in production.
// All carry 400/600/700 so the weight query below never 404s.
const FONTS = [
  { label: 'System', stack: 'system-ui, -apple-system, sans-serif', google: null as string | null },
  { label: 'Inter', stack: "'Inter', sans-serif", google: 'Inter' },
  { label: 'DM Sans', stack: "'DM Sans', sans-serif", google: 'DM+Sans' },
  { label: 'Outfit', stack: "'Outfit', sans-serif", google: 'Outfit' },
  { label: 'Manrope', stack: "'Manrope', sans-serif", google: 'Manrope' },
  { label: 'Work Sans', stack: "'Work Sans', sans-serif", google: 'Work+Sans' },
  { label: 'IBM Plex Sans', stack: "'IBM Plex Sans', sans-serif", google: 'IBM+Plex+Sans' },
  { label: 'Sora', stack: "'Sora', sans-serif", google: 'Sora' },
  { label: 'Space Grotesk', stack: "'Space Grotesk', sans-serif", google: 'Space+Grotesk' },
  { label: 'Archivo', stack: "'Archivo', sans-serif", google: 'Archivo' },
  { label: 'Bricolage Grotesque', stack: "'Bricolage Grotesque', sans-serif", google: 'Bricolage+Grotesque' },
  { label: 'Libre Franklin', stack: "'Libre Franklin', sans-serif", google: 'Libre+Franklin' },
  { label: 'Fraunces', stack: "'Fraunces', serif", google: 'Fraunces' },
  { label: 'Playfair Display', stack: "'Playfair Display', serif", google: 'Playfair+Display' },
  { label: 'Lora', stack: "'Lora', serif", google: 'Lora' },
  { label: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace", google: 'JetBrains+Mono' },
];
const fontStack = (label: string) => FONTS.find((f) => f.label === label)?.stack ?? FONTS[0].stack;

/** Load a Google font into the doc for previewing (production ships self-hosted). */
function loadGoogleFont(googleName: string | null) {
  if (!googleName || typeof document === 'undefined') return;
  const id = `gf-${googleName}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleName}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

function FontSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger aria-label={label}>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {FONTS.map((f) => (
            <Select.Item key={f.label} value={f.label}>
              {f.label}
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}

// The 13 categorical palette colors (Open Color shade-500), measured in OKLCH. These are the
// hues behind Badge/Avatar/etc. `color` prop. Shown here nudged toward the theme so the whole
// set feels of-a-piece rather than a bag of stock crayons.
const PALETTE: { name: string; L: number; C: number; H: number }[] = [
  { name: 'gray', L: 0.77, C: 0.015, H: 248 },
  { name: 'red', L: 0.67, C: 0.204, H: 25 },
  { name: 'pink', L: 0.64, C: 0.197, H: 3 },
  { name: 'grape', L: 0.62, C: 0.225, H: 319 },
  { name: 'violet', L: 0.57, C: 0.229, H: 289 },
  { name: 'indigo', L: 0.59, C: 0.205, H: 269 },
  { name: 'blue', L: 0.63, C: 0.164, H: 250 },
  { name: 'cyan', L: 0.68, C: 0.114, H: 211 },
  { name: 'teal', L: 0.69, C: 0.143, H: 165 },
  { name: 'green', L: 0.71, C: 0.183, H: 146 },
  { name: 'lime', L: 0.76, C: 0.2, H: 131 },
  { name: 'yellow', L: 0.81, C: 0.167, H: 78 },
  { name: 'orange', L: 0.73, C: 0.183, H: 51 },
];

/** Harmonize a palette color to the theme by scaling its chroma with the accent saturation
 *  (relative to the 0.16 default), floored so it never fully greys out — matching the engine's
 *  `harmonizePalette`. Hue holds, so a "red" stays a (muted) red. */
function harmonize(p: { L: number; C: number; H: number }, accentChroma: number): string {
  const desat = Math.max(0, 1 - accentChroma / 0.16) * 0.82; // PALETTE_DESAT_MAX in the engine
  return oklchHex(p.L, p.C * (1 - desat), p.H);
}

const OVERRIDE_CSS = `/* Every value is a CSS variable — override one, or scope a whole set. */
:root {
  --move-primary: #7c5cfc;      /* one token, app-wide */
  --move-rounded-md: 2px;       /* sharper corners everywhere */
}

.marketing {
  --move-bg-base: #0b0b12;      /* scope overrides to any subtree */
}`;

// Rainbow track for the hue sliders — painting InputRange's `track` token + a transparent
// `range` turns the accessible slider into a hue slider. Stops are computed in OKLCH (the
// theme's space) so a hue's position matches the color it produces (HSL 250° ≠ OKLCH 250°).
const HUE_GRADIENT = `linear-gradient(90deg, ${Array.from({ length: 13 }, (_, i) => oklchHex(0.72, 0.15, i * 30)).join(', ')})`;
const hueTrackStyle = { '--move-range-track-bg': HUE_GRADIENT, '--move-range-range-bg': 'transparent' } as React.CSSProperties;

// Human names + WCAG level for the (optional) details table.
const SURFACE_NAME: Record<string, string> = { base: 'the page', subtle: 'cards', muted: 'insets', emphasis: 'chips' };
function humanPair(r: AuditRow): string {
  const bg = r.pair.split(' on ')[1] ?? '';
  if (bg.includes('primary')) return `${r.label} · on the button`;
  return `${r.label} · on ${SURFACE_NAME[bg.replace('--move-bg-', '')] ?? bg}`;
}
const LEVEL: Record<AuditStatus, { label: string; color: string }> = {
  AAA: { label: 'AAA', color: 'var(--move-success)' },
  AA: { label: 'AA', color: 'var(--move-success)' },
  pass: { label: '3:1', color: 'var(--move-success)' },
  warn: { label: 'AA', color: 'var(--move-warning)' },
  fail: { label: 'FAIL', color: 'var(--move-error)' },
  'n/a': { label: '—', color: 'var(--move-fg-subtle)' },
};

function makeColorOf(theme: Theme): (name: string) => LinRGB | null {
  const tokens = theme.tokens as unknown as Record<string, string>;
  return (name) => {
    const v = tokens[name];
    if (!v) return null;
    if (v.startsWith('#')) return hexToLinear(v);
    if (v === 'var(--move-white)') return hexToLinear('#ffffff');
    if (v === 'var(--move-black)') return hexToLinear('#000000');
    return null;
  };
}

/** A realistic little product screen — its surfaces (page → card → inset → chip) and every
 *  text tier, link, button, and control appear in context. Reads the scoped <ThemeProvider>. */
function HolisticSample({ label }: { label: string }) {
  return (
    <Stack gap="sm" style={{ background: 'var(--move-bg-base)', padding: 16, borderRadius: 'var(--move-rounded-lg)', border: '1px solid var(--move-border-base)' }}>
      <Text size="xs" style={{ color: 'var(--move-link)', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 650 }}>
        {label}
      </Text>
      <Heading level={4}>Weekly report</Heading>
      <Text size="sm">The numbers are in, and engagement is trending up across every channel.</Text>
      <Text size="sm" color="muted">A supporting detail line in the secondary text tier.</Text>

      <Stack gap="sm" style={{ background: 'var(--move-bg-subtle)', padding: 12, borderRadius: 'var(--move-rounded-md)', border: '1px solid var(--move-border-base)' }}>
        <Alert variant="success" title="Saved">
          Your changes are live.
        </Alert>
        <div style={{ background: 'var(--move-bg-muted)', padding: '8px 10px', borderRadius: 'var(--move-rounded-md)' }}>
          <Text size="xs" color="muted">Updated 2 min ago · v1.4 · draft</Text>
        </div>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button variant="primary" size="sm">Publish</Button>
          <Button variant="secondary" size="sm">Preview</Button>
          <Badge color="green" variant="soft">Live</Badge>
        </Stack>
        <div style={{ background: 'var(--move-bg-base)', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)', padding: '7px 10px' }}>
          <Text size="sm" color="subtle">Search reports…</Text>
        </div>
        <Text size="sm">
          Read the <Link href="#">full changelog</Link> for what shipped this week.
        </Text>
      </Stack>

      <Text size="xs" color="subtle">Subtle footnote — timestamps, hints, metadata.</Text>
    </Stack>
  );
}

/** The harmonized categorical palette, rendered on the scoped theme's own background so you
 *  see it in context. Reads the swatch colors computed by the page. */
function PaletteBar({ label, swatches }: { label: string; swatches: { name: string; color: string }[] }) {
  return (
    <Stack gap="xs" style={{ background: 'var(--move-bg-base)', padding: 12, borderRadius: 'var(--move-rounded-lg)', border: '1px solid var(--move-border-base)' }}>
      <Text size="xs" style={{ color: 'var(--move-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 650 }}>
        {label} · palette
      </Text>
      <div style={{ display: 'flex', gap: 4 }}>
        {swatches.map((s) => (
          <div key={s.name} title={s.name} style={{ flex: 1, height: 26, borderRadius: 'var(--move-rounded-sm)', background: s.color }} />
        ))}
      </div>
    </Stack>
  );
}

export function ThemeBuilderPage() {
  // Defaults = the official Move theme (matches the dogfooded MOVE_SEED in App.tsx).
  const [neutralHue, setNeutralHue] = React.useState(250);
  const [neutralChroma, setNeutralChroma] = React.useState(0.008);
  const [accentHue, setAccentHue] = React.useState(262);
  // Accent saturation — a real control. 0.16 is the engine default (a full, colorful accent);
  // drag it to 0 for a fully greyscale theme. This is what the Mono preset sets.
  const [accentChroma, setAccentChroma] = React.useState(0.16);
  const [radius, setRadius] = React.useState(1);
  const [headingFont, setHeadingFont] = React.useState('System');
  const [bodyFont, setBodyFont] = React.useState('System');
  const [showDetails, setShowDetails] = React.useState(false);
  // Whether the categorical palette mutes with the accent saturation (default) or stays vivid.
  const [paletteHarmonize, setPaletteHarmonize] = React.useState(true);

  React.useEffect(() => {
    [headingFont, bodyFont].forEach((label) => loadGoogleFont(FONTS.find((f) => f.label === label)?.google ?? null));
  }, [headingFont, bodyFont]);

  // One seed → BOTH themes. Light/dark is a view, so we show both.
  const both = React.useMemo(
    () =>
      describeThemes({
        name: 'brand',
        neutral: { hue: neutralHue, chroma: neutralChroma },
        accent: { hue: accentHue, chroma: accentChroma },
        radius,
        palette: paletteHarmonize ? 'harmonize' : 'vivid',
      }),
    [neutralHue, neutralChroma, accentHue, accentChroma, radius, paletteHarmonize],
  );
  const auditLight = React.useMemo(() => auditTheme(makeColorOf(both.light.theme)), [both]);
  const auditDark = React.useMemo(() => auditTheme(makeColorOf(both.dark.theme)), [both]);

  const violations = auditLight.violations.length + auditDark.violations.length;
  const nudged = both.light.notices.length + both.dark.notices.length;

  // Harmonized categorical palette — same colors in both modes; shown on each mode's background.
  const paletteSwatches = React.useMemo(
    () => PALETTE.map((p) => ({ name: p.name, color: harmonize(p, paletteHarmonize ? accentChroma : 0.16) })),
    [accentChroma, paletteHarmonize],
  );

  const seedCode = `import { defineThemes } from 'move';

// One brand seed → both light and dark. WCAG 2.2 AA is guaranteed.
const { light, dark, radius } = defineThemes({
  neutral: { hue: ${neutralHue}, chroma: ${neutralChroma.toFixed(3)} },
  accent: { hue: ${accentHue}${accentChroma !== 0.16 ? `, chroma: ${accentChroma.toFixed(3)}` : ''} },
  radius: ${radius},${paletteHarmonize ? '' : `\n  palette: 'vivid',`}
});`;

  // Fonts are a separate concern — CSS custom properties, not part of the TS seed.
  const fontCss =
    headingFont !== 'System' || bodyFont !== 'System'
      ? `/* Self-host via Fontsource (@fontsource/*), then set the tokens: */\n:root {\n  --move-font: ${fontStack(bodyFont)};${headingFont !== bodyFont ? `\n  --move-font-heading: ${fontStack(headingFont)};` : ''}\n}`
      : '';

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setNeutralHue(p.hue);
    setNeutralChroma(p.chroma);
    setAccentHue(p.accentHue);
    setAccentChroma(p.accentChroma ?? 0.16);
    setRadius(p.radius);
    setHeadingFont(p.heading);
    setBodyFont(p.body);
  };

  // A preset is "active" when every knob still matches it (so it stays lit until you change something).
  const activePreset = PRESETS.find(
    (p) =>
      p.hue === neutralHue &&
      p.chroma === neutralChroma &&
      p.accentHue === accentHue &&
      (p.accentChroma ?? 0.16) === accentChroma &&
      p.radius === radius &&
      p.heading === headingFont &&
      p.body === bodyFont,
  );

  const chromaTrackStyle = {
    '--move-range-track-bg': `linear-gradient(90deg, ${oklchHex(0.7, 0, neutralHue)}, ${oklchHex(0.7, 0.14, neutralHue)})`,
    '--move-range-range-bg': 'transparent',
  } as React.CSSProperties;

  return (
    <Stack direction="row" gap="xl" align="stretch" id="theme">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/customize">Make it your own</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Theme</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Theme</Heading>
          <Text color="muted" size="lg">
            Pick an accent and a background tint — Move builds a complete theme for light and dark
            from them. Every color is kept legible for you.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <Section id="import" title="Import your theme">
          <Text color="muted">
            Already have a design system — from Tailwind, Figma, or Material? Bringing it in is a short
            list: its accent and gray, its corner radius, and its fonts. Read those off the source,
            enter them here, and Move reproduces the rest — every surface, border, and state — with the
            contrast kept honest. Or hand the whole job to an assistant: the{' '}
            <Link asChild>
              <RouterLink to="/ai/skills#app">app-theme skill</RouterLink>
            </Link>{' '}
            does the distilling for you.
          </Text>
        </Section>

        <Section id="build" title="Build your theme" lede="Two colors in — a full, accessible theme out. The preview is the proof: it's the real theme, shown in both modes.">
          <Grid cols={2} gap="lg">
            {/* Controls */}
            <Stack gap="lg" style={{ padding: 20, background: 'var(--move-bg-subtle)', borderRadius: 14 }}>
              <Stack gap="sm">
                <Text weight="medium">Accent color</Text>
                <Stack direction="row" gap="sm" align="center">
                  <div style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', background: oklchHex(0.57, accentChroma, accentHue), border: '1px solid var(--move-border-base)' }} />
                  <div style={{ flex: 1 }}>
                    <InputRange aria-label="Accent hue" min={0} max={360} step={1} value={accentHue} onValueChange={(v) => setAccentHue(v[0])} style={hueTrackStyle} />
                  </div>
                </Stack>
                <Text size="sm" color="subtle">Buttons, links, highlights, and focus outlines.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Accent saturation — {accentChroma === 0 ? 'greyscale' : `${Math.round((accentChroma / 0.26) * 100)}%`}</Text>
                <InputRange
                  aria-label="Accent saturation"
                  min={0}
                  max={0.26}
                  step={0.005}
                  value={accentChroma}
                  onValueChange={(v) => setAccentChroma(v[0])}
                  style={{ '--move-range-track-bg': `linear-gradient(90deg, ${oklchHex(0.57, 0, accentHue)}, ${oklchHex(0.57, 0.26, accentHue)})`, '--move-range-range-bg': 'transparent' } as React.CSSProperties}
                />
                <Text size="sm" color="subtle">From a fully greyscale accent up to a vivid one. Legibility holds at every setting.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Background tint</Text>
                <Stack direction="row" gap="sm" align="center">
                  <div style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', background: oklchHex(0.6, Math.max(neutralChroma * 1.4, 0.004), neutralHue), border: '1px solid var(--move-border-base)' }} />
                  <div style={{ flex: 1 }}>
                    <InputRange aria-label="Background tint hue" min={0} max={360} step={1} value={neutralHue} onValueChange={(v) => setNeutralHue(v[0])} style={hueTrackStyle} />
                  </div>
                </Stack>
                <Text size="sm" color="subtle">Lean your grays warm or cool. Backgrounds are never pure white or black, so the mood carries through.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Tint strength — {Math.round((neutralChroma / 0.045) * 100)}%</Text>
                <InputRange aria-label="Tint strength" min={0} max={0.045} step={0.001} value={neutralChroma} onValueChange={(v) => setNeutralChroma(v[0])} style={chromaTrackStyle} />
                <Text size="sm" color="subtle">How strongly that tint shows — from plain gray to clearly colored.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Corner radius — {radius === 0 ? 'sharp' : `${radius.toFixed(1)}×`}</Text>
                <InputRange aria-label="Corner radius" min={0} max={2} step={0.1} value={radius} onValueChange={(v) => setRadius(v[0])} />
                <Text size="sm" color="subtle">Sharp to rounded — scales every corner at once; pills stay pills.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Fonts</Text>
                <Grid cols={2} gap="sm">
                  <Stack gap="xs">
                    <Text size="sm" color="subtle">Heading</Text>
                    <FontSelect value={headingFont} onChange={setHeadingFont} label="Heading font" />
                  </Stack>
                  <Stack gap="xs">
                    <Text size="sm" color="subtle">Body</Text>
                    <FontSelect value={bodyFont} onChange={setBodyFont} label="Body font" />
                  </Stack>
                </Grid>
                <Text size="sm" color="subtle">Previewed from Google Fonts; ship self-hosted via Fontsource in production.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Presets</Text>
                <Stack direction="row" gap="sm" wrap>
                  {PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      variant={activePreset === p ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => applyPreset(p)}
                      aria-pressed={activePreset === p}
                    >
                      {p.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* Preview — the real theme in both modes. Radius is theme-level, so it's
                applied once here (same for both) rather than per color theme. */}
            <div style={{ ...both.radius, '--move-font': fontStack(bodyFont), '--move-font-body': fontStack(bodyFont), '--move-font-heading': fontStack(headingFont) } as React.CSSProperties}>
              <Grid cols={2} gap="md">
                <ThemeProvider theme={both.light.theme}>
                  <HolisticSample label="Light" />
                </ThemeProvider>
                <ThemeProvider theme={both.dark.theme}>
                  <HolisticSample label="Dark" />
                </ThemeProvider>
              </Grid>

              {/* Categorical palette (Badge, Avatar, …), shown on each mode's own background.
                  Chroma follows the accent saturation, so it mutes with the theme. */}
              <Stack gap="lg" style={{ marginTop: 24 }}>
                <Stack direction="row" gap="md" align="center" justify="between" wrap>
                  <Text size="sm" color="muted" style={{ flex: 1, minWidth: 220 }}>
                    {paletteHarmonize
                      ? 'The categorical palette mutes with your accent — Badge, Avatar, and friends follow the theme.'
                      : 'The categorical palette stays vivid (full Open Color), independent of the accent.'}
                  </Text>
                  <Switch.Root
                    label="Harmonize palette with accent"
                    checked={paletteHarmonize}
                    onCheckedChange={setPaletteHarmonize}
                  >
                    <Switch.Thumb />
                  </Switch.Root>
                </Stack>
                <Grid cols={2} gap="md">
                  <ThemeProvider theme={both.light.theme}>
                    <PaletteBar label="Light" swatches={paletteSwatches} />
                  </ThemeProvider>
                  <ThemeProvider theme={both.dark.theme}>
                    <PaletteBar label="Dark" swatches={paletteSwatches} />
                  </ThemeProvider>
                </Grid>
              </Stack>
            </div>
          </Grid>

          {/* Verdict + auto-correct note, below the preview */}
          <div style={{ marginTop: 16 }}>
            {violations === 0 ? (
              <Alert variant="success" title="Meets WCAG 2.2 AA">
                Every text style, link, button label, and focus ring is legible in both light and dark
                {nudged > 0 ? ` — ${nudged} color${nudged > 1 ? 's were' : ' was'} adjusted automatically to keep it that way` : ''}.
              </Alert>
            ) : (
              <Alert variant="danger" title="Contrast issue">
                {violations} pairing{violations > 1 ? 's fall' : ' falls'} below WCAG 2.2 AA. Ease the tint or shift a hue.
              </Alert>
            )}
          </div>

          {/* Optional per-pair numbers */}
          <div style={{ marginTop: 12 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails((s) => !s)}
              aria-expanded={showDetails}
            >
              <span style={{ display: 'inline-flex', transform: showDetails ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }}>
                <Icon name="chevron-right" />
              </span>
              {showDetails ? 'Hide contrast details' : 'Show contrast details'}
            </Button>
            {showDetails && (
              <Stack gap="none" style={{ marginTop: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px,1.4fr) 1fr 1fr', gap: 16, paddingBottom: 6 }}>
                  <Text size="sm" color="subtle" weight="medium">Contrast</Text>
                  <Text size="sm" color="subtle" weight="medium">Light</Text>
                  <Text size="sm" color="subtle" weight="medium">Dark</Text>
                </div>
                {auditLight.rows.map((r: AuditRow, i: number) => {
                  const dl = auditLight.rows[i];
                  const dd = auditDark.rows[i];
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(160px,1.4fr) 1fr 1fr', gap: 16, alignItems: 'center', paddingBlock: 6, borderTop: '1px solid var(--move-border-base)' }}>
                      <Text size="sm">{humanPair(r)}</Text>
                      <Text size="sm" style={{ fontVariantNumeric: 'tabular-nums', color: LEVEL[dl.status].color }}>
                        {dl.ratio != null ? dl.ratio.toFixed(2) : '—'} · {LEVEL[dl.status].label}
                      </Text>
                      <Text size="sm" style={{ fontVariantNumeric: 'tabular-nums', color: LEVEL[dd.status].color }}>
                        {dd.ratio != null ? dd.ratio.toFixed(2) : '—'} · {LEVEL[dd.status].label}
                      </Text>
                    </div>
                  );
                })}
              </Stack>
            )}
          </div>
        </Section>

        <Section id="config" title="Use it in your app" lede="One call sets the whole theme. An AI assistant can write it for you too.">
          <Stack gap="md">
            <CodeBlock code={seedCode} language="tsx" />
            {fontCss && (
              <Stack gap="xs">
                <Text size="sm" color="muted">
                  Fonts are CSS, not part of the seed — set the tokens once.{' '}
                  <Link asChild>
                    <RouterLink to="/customize/typography">Loading, scoping, sizes &amp; weights →</RouterLink>
                  </Link>
                </Text>
                <CodeBlock code={fontCss} language="css" />
              </Stack>
            )}
          </Stack>
        </Section>

        <Section
          id="override"
          title="Override anything"
          lede="The seed gives you sensible defaults, but nothing’s locked down. Every token is just a CSS variable — nudge a single color, or rework the whole set."
        >
          <Stack gap="md">
            <CodeBlock code={OVERRIDE_CSS} language="css" />
            <Text size="sm" color="muted">
              Rather keep it all in one place? Pass a <Code>tokens</Code> object to{' '}
              <Code>defineThemes</Code> and it overrides any value the seed generated.
            </Text>
            <Stack gap="xs">
              <Text weight="medium">Where the tokens live</Text>
              <Text size="sm" color="muted">
                Every component page has a <strong>Design tokens</strong> section listing its own{' '}
                <Code>--move-*</Code> variables. Color tokens are right here on this page — the
                palette and contrast table above — and the font tokens are over on{' '}
                <Link asChild>
                  <RouterLink to="/customize/typography">Typography</RouterLink>
                </Link>
                .
              </Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
