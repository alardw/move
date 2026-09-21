// Illustration.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Illustration',
  componentClass: 'presentational' as const,
  category: 'media',
  description:
    'A drawing that responds to the theme — one SVG, named for assistive tech, painted from tokens, sized from its own viewBox',

  // `img` is what the component IS: a single graphic with an accessible name.
  ariaPattern: ['img'],

  // No family. `media-player` is the transport; nothing else here bundles
  // promises this keeps.

  compound: false,
  rootElement: 'figure',

  slots: [
    {
      name: 'root',
      element: 'figure',
      kind: 'none',
      typography: 'none',
      description:
        "The frame. Carries the accessible name, the width preference and the token palette; the consumer's <svg> is its child.",
    },
    {
      name: 'graphic',
      element: 'div',
      kind: 'none',
      typography: 'none',
      description:
        'Wraps the drawing and carries role="img" + the accessible name. Scoped to the drawing rather than the figure, because the role makes its subtree presentational and on the figure it would silence the caption.',
    },
    {
      name: 'desc',
      element: 'p',
      kind: 'none',
      typography: 'none',
      description:
        'The long description, clipped rather than hidden so aria-describedby still resolves to it',
    },
    {
      name: 'caption',
      element: 'figcaption',
      kind: 'none',
      // A caption is text ABOUT the drawing, never the drawing's content.
      typography: 'meta',
      description: 'Visible caption below the drawing',
    },
  ],

  props: [
    {
      name: 'title',
      type: 'string',
      moveSpecific: true,
      description:
        'Accessible name, carried by the frame as role="img" + aria-label, or by the <figcaption> when a caption is given. Required: an illustration carries information by definition, so there is no opting out. A drawing that carries none is ornament and belongs in a CSS background-image.',
    },
    {
      name: 'desc',
      type: 'string',
      moveSpecific: true,
      description:
        'Longer description, referenced by aria-describedby. A description, never part of the name.',
    },
    {
      name: 'caption',
      type: 'React.ReactNode',
      moveSpecific: true,
      description:
        'Visible caption. When present it NAMES the illustration natively through <figcaption>, and role="img" is dropped — the two cannot both apply, since role="img" makes its own subtree presentational and would hide the caption text.',
    },
    {
      name: 'size',
      type: "'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
      default: "'auto'",
      moveSpecific: true,
      description:
        "Width PREFERENCE on the library's standard scale. `auto` is the default and the most responsive: the drawing renders at its own size when there is room and scales down when there is not, capped at the parent. The named steps are applied as min(token, 100%), so the container can always overrule them and the drawing can never be forced wider than the space it was given. `full` means the container, not the viewport: this is inline content, not an overlay.",
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description:
        'Animation config. Empty by default — a drawing that moves every time it appears is noise, so the consumer opts in and the children mark themselves with data-move-stagger.',
    },
    { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
    {
      name: 'style',
      type: 'React.CSSProperties',
      moveSpecific: false,
      description: 'Inline styles',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description:
        'One <svg>, written or pasted whole, with its shapes classed from the illustration-* palette. The element stays visible in the source: an export arrives as a complete <svg> and an SVGR import renders its own, so taking it away would mean unwrapping every drawing by hand.',
    },
  ],

  // The SVG shapes are structure, not text.
  childrenKind: 'composition' as const,

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size'],
    children: [{ slot: 'graphic' }, { slot: 'desc' }, { slot: 'caption' }],
  },

  controlled: null,
  keyboard: 'none' as const,
  focus: 'none' as const,
  formType: null,
  asChild: false,

  // No default motion. The prop exists so a consumer never reaches for anime.js
  // directly; the library's own default is stillness.
  animations: [],

  // Deliberately NOT a surface. `owns-surface` requires painting a ground and
  // providing SurfaceProvider as one act, and these children are markup rather
  // than components, so the provider would have nothing to talk to. The
  // illustration inherits instead, which is what lets it drop into a page, a
  // Card or a Dialog without being told which.

  renderContracts: [
    {
      id: 'the-svg-belongs-to-the-caller',
      description:
        'Illustration is the FRAME, not the drawing. The consumer writes the <svg> and it is rendered untouched, because an export arrives as a complete <svg> and an SVGR import renders its own — a component that owned the element could accept neither without unwrapping by hand. The browser derives the aspect ratio from the viewBox natively, so nothing here parses it.',
    },
    {
      id: 'size-is-a-preference',
      description:
        'Every step is applied as max-inline-size: min(token, 100%), so the container always wins and the drawing can never be forced wider than the space it was given. `auto` sets no inline-size at all, letting the svg render at its own width/height; it keeps max-inline-size: 100% so it still cannot overflow.',
    },
    {
      id: 'the-role-belongs-to-the-drawing',
      description:
        'role="img" + aria-label sit on the `graphic` wrapper, never on the figure. The role makes its whole subtree presentational, so on the figure it would silence the caption — text written to be read would stop being announced. Scoped to the drawing it does the one job it is for: collapsing a hundred paths into a single named node.',
    },
    {
      id: 'children-keep-their-attributes',
      description:
        'The svg and everything in it are rendered untouched, so data-move-stagger and data-surface survive, and the parent animation can target them. data-surface SETS a level rather than flipping one — a Card flips because it calls useSurfaceFlip in JS — so artwork that names a ground is only right on the ground it named. The panel roles are relative by construction and are what a drawing should use.',
    },
  ],

  tokens: [
    // --- Grounds. Surface-RELATIVE: these re-resolve under any [data-surface],
    // which is what makes the drawing correct on a page, in a Card or in a
    // Dialog without being told which — and what keeps a box on a box a step
    // apart wherever it lands, without the artwork naming a ground.
    {
      name: '--move-illustration-ground',
      value: 'var(--move-surface-bg)',
      description: 'The ground the drawing sits on',
    },
    {
      name: '--move-illustration-panel',
      value: 'var(--move-surface-alt)',
      description: 'A box drawn on that ground',
    },
    {
      name: '--move-illustration-panel-raised',
      value: 'var(--move-surface-alt-hover)',
      description: 'A box on a box',
    },

    // --- Lines. The border RAMP, deliberately not --move-surface-border, which
    // is transparent on a subtle surface — right for a container edge, fatal for
    // a connector.
    {
      name: '--move-illustration-line',
      value: 'var(--move-border-base)',
      description: 'Ordinary lines and connectors',
    },
    {
      name: '--move-illustration-line-strong',
      value: 'var(--move-border-emphasis)',
      description: 'An emphasised line',
    },

    // --- Text
    {
      name: '--move-illustration-text',
      value: 'var(--move-fg-base)',
      description: 'Labels inside the drawing',
    },
    {
      name: '--move-illustration-text-muted',
      value: 'var(--move-fg-muted)',
      description: 'Secondary labels',
    },

    // --- Accent: the one thing the drawing is pointing at
    {
      name: '--move-illustration-accent',
      value: 'var(--move-primary)',
      description: 'Accent fill',
    },
    {
      name: '--move-illustration-accent-subtle',
      value: 'var(--move-primary-subtle)',
      description: 'Accent region behind a mark',
    },
    {
      name: '--move-illustration-accent-fg',
      value: 'var(--move-primary-fg)',
      description: 'Marks on an accent fill',
    },

    // --- Status. Solid paints a mark or a line; subtle fills a region behind
    // one. Colour alone cannot carry the meaning (WCAG 1.4.1) — a diagram needs
    // a label or a shape difference too.
    {
      name: '--move-illustration-success',
      value: 'var(--move-success)',
      description: 'Success mark or line',
    },
    {
      name: '--move-illustration-success-subtle',
      value: 'var(--move-success-subtle)',
      description: 'Success region',
    },
    {
      name: '--move-illustration-warning',
      value: 'var(--move-warning)',
      description: 'Warning mark or line',
    },
    {
      name: '--move-illustration-warning-subtle',
      value: 'var(--move-warning-subtle)',
      description: 'Warning region',
    },
    {
      name: '--move-illustration-error',
      value: 'var(--move-error)',
      description: 'Error mark or line',
    },
    {
      name: '--move-illustration-error-subtle',
      value: 'var(--move-error-subtle)',
      description: 'Error region',
    },
    {
      name: '--move-illustration-info',
      value: 'var(--move-info)',
      description: 'Info mark or line',
    },
    {
      name: '--move-illustration-info-subtle',
      value: 'var(--move-info-subtle)',
      description: 'Info region',
    },

    // --- Width. A PREFERENCE, never a size: each is applied as
    // min(token, 100%), so the container can always overrule it. Sized in rem
    // against the page, not in ch — ch is the reading measure, which is what a
    // text field wants and a drawing does not.
    {
      name: '--move-illustration-width-sm',
      value: '24rem',
      description: 'A spot drawing beside the text',
    },
    {
      name: '--move-illustration-width-md',
      value: '36rem',
      description: 'A diagram in a column',
    },
    {
      name: '--move-illustration-width-lg',
      value: '48rem',
      description: 'Wider than the prose',
    },
    { name: '--move-illustration-width-xl', value: '64rem', description: 'A large diagram' },
    {
      name: '--move-illustration-width-full',
      value: '100%',
      description: 'Whatever the container gives it',
    },

    // --- Geometry: what makes a drawing look like it belongs to the library.
    {
      name: '--move-illustration-line-width',
      value: '1.5px',
      description:
        'Stroke width. Paired with vector-effect: non-scaling-stroke on every line class, so a hairline stays a hairline when the drawing scales down.',
    },
    {
      name: '--move-illustration-radius',
      value: 'var(--move-rounded-md)',
      description: 'Corner radius for drawn boxes — the same corner a real card has',
    },
    {
      name: '--move-illustration-dash',
      value: '4 4',
      description: 'One dash pattern for implied or pending connectors',
    },
  ],

  variants: {},
  sizes: ['auto', 'sm', 'md', 'lg', 'xl', 'full'] as string[],

  // `title`, `desc` and `caption` are consumer content, not component strings.
  labels: [],

  radixPrimitive: null,
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'],

  testing: {
    behaviors: [
      "Renders the consumer's <svg> untouched",
      'Root carries data-size matching the size prop',
      'Defaults to size auto',
      'size auto renders the svg at its own width and scales it down below a narrow parent',
      'A named size caps width as min(token, 100%), so the container can overrule it',
      'Renders <figcaption> only when caption is given',
      'Renders the description clipped, not hidden, so aria-describedby resolves',
      'Spreads children untouched, so data-move-stagger and data-surface survive',
      'Forwards className and style',
    ],
    keyboard: [],
    aria: [
      'The graphic wrapper carries role="img" and aria-label from title',
      'The figure itself carries no role, so a caption is still announced',
      'desc is referenced by aria-describedby, never by aria-labelledby',
      'title is required, so an illustration always has an accessible name',
    ],
    animation: [
      'No animation by default',
      'An animations config staggers children marked data-move-stagger',
    ],
  },
} satisfies ComponentSpec;
