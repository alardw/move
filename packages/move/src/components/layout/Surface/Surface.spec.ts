// Surface.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Surface',
  componentClass: 'presentational' as const,
  category: 'layout',
  description:
    'Owns a ground: takes the alternate tone of whatever it lands on, paints it, and hands the new tone to its children',

  compound: false,
  rootElement: 'div',

  slots: [
    {
      name: 'root',
      element: 'div',
      kind: 'surface',
      typography: 'none',
      description: 'The painted ground. Sets data-surface and provides the tone to descendants.',
    },
  ],

  capabilities: ['owns-surface'],

  props: [
    {
      name: 'tone',
      typeRef: 'SurfaceTone',
      moveSpecific: true,
      description:
        'Pin the ground instead of alternating. Left unset it takes the opposite of whatever it landed on, which is what makes nesting work without anyone setting a colour.',
    },
    {
      name: 'fill',
      type: "'parent' | 'remaining'",
      moveSpecific: true,
      description:
        "Where this box's height comes from. 'parent' = all of the parent's height (the parent must be sized, and you must be its only child); 'remaining' = the space left after siblings, waiving the automatic minimum size so a scroll region inside can scroll. A ground that stops short of the edges is not a ground, so this is how it reaches them. See /systems/layout.",
    },
    {
      name: 'flex',
      type: "1 | 'auto' | 'none'",
      moveSpecific: true,
      description:
        "Flex sizing along the parent's main axis. 1 = grow to fill remaining space; 'auto' = size to content but allow grow/shrink; 'none' = fixed at content size.",
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description:
        'Paint an element that already exists rather than adding one. This is how Card, Dialog, Drawer, Popover, Sidebar, Select and Accordion take the ground onto their own root without a wrapper node in between.',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Content standing on this ground',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-surface', 'data-fill', 'data-flex'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: true,

  animations: [],

  /*
   * No component tokens, deliberately.
   *
   * The convention would name them `--move-surface-bg` / `--move-surface-border`
   * — which are the GLOBAL semantic tokens this component exists to render, so
   * a component-token layer here would collide with the thing it is painting
   * from. Surface reads the globals directly. It is the one component whose
   * name and token namespace are the same, because it IS the surface system's
   * rendering half.
   */
  tokens: [],

  variants: {},
  sizes: [],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  // SurfaceProvider is infrastructure, not a component, but the source builds
  // from it and spec-drift reads what the source imports.
  componentDeps: ['SurfaceProvider'],

  childrenKind: 'composition',

  testing: {
    behaviors: [
      'Takes the alternate of the tone it lands on',
      'Alternates again one level deeper, so nesting keeps a step between grounds',
      'Sets data-surface to the tone it resolved',
      'Provides the resolved tone to descendants via SurfaceProvider',
      'Paints background from --move-surface-bg',
      'tone pins the ground instead of alternating',
      'fill=parent takes the full parent height',
      'fill=remaining takes the space left after siblings',
      'Applies flex sizing via data-flex attribute',
      'asChild paints the child element and adds no wrapper node',
      'asChild still provides the tone to that element’s descendants',
      'Forwards className and style',
      'Forwards ref to root element',
    ],
  },
} satisfies ComponentSpec;
