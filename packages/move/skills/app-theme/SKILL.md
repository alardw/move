---
name: app-theme
description: "Theme a Move app — generate a full light+dark theme from a brand's colors with defineThemes (WCAG AA guaranteed), import an existing token set (Tailwind, Radix, Material 3, DTCG/Figma) by distilling it to a seed, set radius and fonts, and override any specific token. Never hand-pick colors for contrast — the engine clamps."
user-invocable: true
argument-hint: "[brand colors, a token file, or a described vibe]"
---

# App Theme — brand a Move app

Give Move a couple of colors and it generates a complete, accessible theme for
light **and** dark. This skill covers three jobs that all land on the same
`defineThemes` seed:

1. **From scratch** — a described brand or vibe → pick a neutral + accent → generate.
2. **Import a token set** — Tailwind / Radix / Material 3 / a DTCG (Figma) export → *distill it to a seed*, then override the few tokens that genuinely differ.
3. **Adjust an existing theme** — nudge the accent, change radius, give headings their own font, fix a contrast complaint.

---

## The one rule that matters

**Never hand-pick colors to "make them accessible."** The engine clamps every
generated color to WCAG 2.2 AA by construction — text, links, button labels, and
focus rings are legible in both modes, guaranteed. Your job is to choose the
*brand* (hue + how vivid); contrast is not your problem. If you find yourself
darkening a blue by eye so text passes, stop — you're doing the engine's job.

---

## The model

One seed expands into both themes:

```ts
import { defineThemes } from 'move';

const { light, dark, radius } = defineThemes({
  neutral: { hue: 250, chroma: 0.008 }, // the gray — a barely-there tint carries the mood
  accent:  { hue: 262 },                // the brand color; drives fills, links, focus
  radius:  1,                           // corner-roundness factor (0 = sharp, 2 = pillowy)
  palette: 'harmonize',                 // categorical colors mute with the accent (default)
});
```

Then apply it — light and dark come from the same seed, so switching is passing
a different `Theme`:

```tsx
<MoveRoot theme={prefersDark ? dark : light}>…</MoveRoot>
```

The seed fields, in full:

| field | what it is | notes |
|-------|-----------|-------|
| `neutral` | `{ hue, chroma }` of the gray | `chroma` is the tint strength: `0` = pure gray, `~0.008` = subtle, `0.02+` = clearly colored ground |
| `accent` | `{ hue, chroma? }` of the brand | omit `chroma` for a full accent (0.16); set `0` for a fully greyscale theme |
| `radius` | corner factor (number or `'none'\|'sm'\|'md'\|'lg'\|'xl'`) | scales `--move-rounded-*`; pills stay pills |
| `palette` | `'harmonize'` (default) or `'vivid'` | `harmonize` mutes the 13 categorical colors with the accent; `vivid` keeps full Open Color |
| `status` | override success/warning/danger/info palette | rarely needed; status stays meaningful regardless of accent |
| `tokens` | raw `--move-*` overrides | the escape hatch — wins over any generated value |

Fonts are **CSS, not part of the seed** — set the tokens once:

```css
:root {
  --move-font: 'Inter', system-ui, sans-serif;      /* all text + UI */
  --move-font-heading: 'Fraunces', Georgia, serif;  /* optional — headings only */
  --move-font-mono: 'JetBrains Mono', monospace;     /* code */
}
```

---

## Importing a token set — distill, don't mirror

A design system's token export is mostly **color + structure**. Move regenerates
color from a seed and already ships the standard structural scales, so importing
is *distillation*, not a 1:1 copy:

**Color → seed.** Find two colors in the source and read their OKLCH:
- the **accent** — the brand/primary/action color → `accent: { hue, chroma }`
- the **neutral** — the mid gray (a `500`-ish step) → `neutral: { hue, chroma }`

Then generate. Measured against a full 1:1 port of four real systems, a distilled
seed reproduces surfaces, text, and the primary to within an imperceptible-to-subtle
color difference. The one place it diverges is the **link** — because the source
usually reuses the raw primary hex (which often fails AA as body text) and Move
regenerates an AA-safe accent-text. That divergence is a fix, not a loss.

**Structure → mostly already matches.** Move's spacing (`4, 8, 12, 16, 24, 32…px`)
and type scale (`12/14/16/18/20/24/30/36`) are the same rem-based scale Tailwind
uses (Material's 4dp grid lands on it too). So for most sources there's nothing to
port. Radius distills to the `radius` factor; fonts to the CSS tokens above.

**The genuinely-bespoke leftovers → `tokens` override.** A source value that Move's
ramp doesn't reproduce (e.g. Material 3 repurposes a mid-gray `outline` as its
strongest border) is a targeted override, not a reason to abandon generation:

```ts
defineThemes({
  neutral: { hue: 300, chroma: 0.016 },
  accent:  { hue: 294 },
  tokens:  { '--move-border-emphasis': '#79747e' }, // match M3's outline exactly
});
```

### Where each system keeps the seed values

| source | accent | neutral (mid gray) | radius | notes |
|--------|--------|--------------------|--------|-------|
| **Tailwind** | `blue-600` (or your `primary`) | `slate/gray-500` | `borderRadius` | scales are already Move's; only color distills |
| **Radix** | the accent scale's step **9** | the gray scale's step **9** | — | distills the closest of all; near-neutral grays |
| **Material 3** | `primary` (the source/seed color) | `neutral` / `outline` | `shape` corner | M3 *is* seed-generated — its source color maps straight onto `accent` |
| **DTCG / Figma** | `color.*.primary` / `accent` (`$value`) | `color.*.neutral.500` | `borderRadius.*` (`$type: dimension`) | Tokens Studio & Style Dictionary exports are this shape |

---

## Checking a theme

For a theme you generated, AA is guaranteed — no check needed. For a **hand-authored**
theme, or one with heavy `tokens` overrides, verify it:

```ts
import { auditTheme, themeColorOf, parsePrimitives } from 'move';
// resolve the theme's tokens to colors, then auditTheme(colorOf) → rows + violations
```

Report any violation with the token pair and its ratio; fix by easing the override
or letting the engine generate that value instead of pinning it.

---

## Recipe

1. **Identify the input** — described vibe, brand hex(es), or a token file.
2. **Get to a seed** — from scratch: pick neutral + accent. From a file: read the OKLCH of the source's accent and mid-gray (and its radius, fonts).
3. **Generate** — `defineThemes({ neutral, accent, radius, palette })`.
4. **Reconcile bespoke tokens** — only the handful the source needs exactly → `tokens` overrides.
5. **Fonts** — set `--move-font` / `--move-font-heading` / `--move-font-mono` if the brand has type.
6. **Apply** — `<MoveRoot theme={dark|light}>`; wire the light/dark toggle to the pair.
7. **Verify** — generated themes are AA by construction; `auditTheme` any hand-authored or heavily-overridden one.

## Rules

- Choose the brand (hue + vividness); let the engine own contrast. Never eyeball colors for AA.
- Distill imports to a seed; reach for `tokens` overrides only for genuinely-bespoke values, not wholesale.
- Light and dark come from **one** seed — never author them separately.
- Status colors (success/warning/danger/info) carry meaning; leave them unless the brand truly redefines them.
- No custom CSS for layout or component styling — theming is tokens only.

See the interactive builder at `/customize/theme` in the docs, and `references/app/bootstrap.md` for MoveRoot setup.
