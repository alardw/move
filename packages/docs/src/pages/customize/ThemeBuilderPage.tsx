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
  Icon,
  Link,
  Breadcrumb,
  InputRange,
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
  { href: '#build', label: 'Build your theme' },
  { href: '#config', label: 'Use it in your app' },
];

const PRESETS: { label: string; hue: number; chroma: number; accentHue: number }[] = [
  { label: 'Cool default', hue: 250, chroma: 0.008, accentHue: 262 },
  { label: 'Blue-tinted', hue: 255, chroma: 0.02, accentHue: 262 },
  { label: 'Warm', hue: 70, chroma: 0.012, accentHue: 40 },
  { label: 'Pure gray', hue: 250, chroma: 0, accentHue: 262 },
  { label: 'Forest', hue: 155, chroma: 0.018, accentHue: 150 },
];

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
    <Stack gap="sm" style={{ background: 'var(--move-bg-base)', padding: 16, borderRadius: 12, border: '1px solid var(--move-border-base)' }}>
      <Text size="xs" style={{ color: 'var(--move-link)', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 650 }}>
        {label}
      </Text>
      <Heading level={4}>Weekly report</Heading>
      <Text size="sm">The numbers are in, and engagement is trending up across every channel.</Text>
      <Text size="sm" color="muted">A supporting detail line in the secondary text tier.</Text>

      <Stack gap="sm" style={{ background: 'var(--move-bg-subtle)', padding: 12, borderRadius: 10, border: '1px solid var(--move-border-base)' }}>
        <Alert variant="success" title="Saved">
          Your changes are live.
        </Alert>
        <div style={{ background: 'var(--move-bg-muted)', padding: '8px 10px', borderRadius: 8 }}>
          <Text size="xs" color="muted">Updated 2 min ago · v1.4 · draft</Text>
        </div>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button variant="primary" size="sm">Publish</Button>
          <Button variant="secondary" size="sm">Preview</Button>
          <Badge color="green" variant="soft">Live</Badge>
        </Stack>
        <div style={{ background: 'var(--move-bg-base)', border: '1px solid var(--move-border-base)', borderRadius: 8, padding: '7px 10px' }}>
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

export function ThemeBuilderPage() {
  const [neutralHue, setNeutralHue] = React.useState(250);
  const [neutralChroma, setNeutralChroma] = React.useState(0.012);
  const [accentHue, setAccentHue] = React.useState(262);
  const [showDetails, setShowDetails] = React.useState(false);

  // One seed → BOTH themes. Light/dark is a view, so we show both.
  const both = React.useMemo(
    () => describeThemes({ name: 'brand', neutral: { hue: neutralHue, chroma: neutralChroma }, accent: { hue: accentHue } }),
    [neutralHue, neutralChroma, accentHue],
  );
  const auditLight = React.useMemo(() => auditTheme(makeColorOf(both.light.theme)), [both]);
  const auditDark = React.useMemo(() => auditTheme(makeColorOf(both.dark.theme)), [both]);

  const violations = auditLight.violations.length + auditDark.violations.length;
  const nudged = both.light.notices.length + both.dark.notices.length;

  const seedCode = `import { defineThemes } from 'move';

// One brand seed → both light and dark. WCAG 2.2 AA is guaranteed.
const { light, dark } = defineThemes({
  neutral: { hue: ${neutralHue}, chroma: ${neutralChroma.toFixed(3)} },
  accent: { hue: ${accentHue} },
});`;

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setNeutralHue(p.hue);
    setNeutralChroma(p.chroma);
    setAccentHue(p.accentHue);
  };

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

        <Section id="build" title="Build your theme" lede="Two colors in — a full, accessible theme out. The preview is the proof: it's the real theme, shown in both modes.">
          <Grid cols={2} gap="lg">
            {/* Controls */}
            <Stack gap="lg" style={{ padding: 20, background: 'var(--move-bg-subtle)', borderRadius: 14 }}>
              <Stack gap="sm">
                <Text weight="medium">Accent color</Text>
                <Stack direction="row" gap="sm" align="center">
                  <div style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', background: oklchHex(0.57, 0.16, accentHue), border: '1px solid var(--move-border-base)' }} />
                  <div style={{ flex: 1 }}>
                    <InputRange min={0} max={360} step={1} value={accentHue} onValueChange={(v) => setAccentHue(v[0])} style={hueTrackStyle} />
                  </div>
                </Stack>
                <Text size="sm" color="subtle">Buttons, links, highlights, and focus outlines.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Background tint</Text>
                <Stack direction="row" gap="sm" align="center">
                  <div style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', background: oklchHex(0.6, Math.max(neutralChroma * 1.4, 0.004), neutralHue), border: '1px solid var(--move-border-base)' }} />
                  <div style={{ flex: 1 }}>
                    <InputRange min={0} max={360} step={1} value={neutralHue} onValueChange={(v) => setNeutralHue(v[0])} style={hueTrackStyle} />
                  </div>
                </Stack>
                <Text size="sm" color="subtle">Lean your grays warm or cool. Backgrounds are never pure white or black, so the mood carries through.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Tint strength — {Math.round((neutralChroma / 0.045) * 100)}%</Text>
                <InputRange min={0} max={0.045} step={0.001} value={neutralChroma} onValueChange={(v) => setNeutralChroma(v[0])} style={chromaTrackStyle} />
                <Text size="sm" color="subtle">How strongly that tint shows — from plain gray to clearly colored.</Text>
              </Stack>

              <Stack gap="sm">
                <Text weight="medium">Presets</Text>
                <Stack direction="row" gap="sm" wrap>
                  {PRESETS.map((p) => (
                    <Button key={p.label} variant="ghost" size="sm" onClick={() => applyPreset(p)}>
                      {p.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* Preview — the real theme in both modes */}
            <Grid cols={2} gap="md">
              <ThemeProvider theme={both.light.theme}>
                <HolisticSample label="Light" />
              </ThemeProvider>
              <ThemeProvider theme={both.dark.theme}>
                <HolisticSample label="Dark" />
              </ThemeProvider>
            </Grid>
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
            <Button variant="ghost" size="sm" onClick={() => setShowDetails((s) => !s)}>
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
          <CodeBlock code={seedCode} language="tsx" />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
