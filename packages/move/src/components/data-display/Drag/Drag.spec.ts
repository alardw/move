// Drag.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

/**
 * The generic half of dragging: a context and a drop target.
 *
 * The hooks (`useDraggable`, `useDropTarget`) already attach dragging to any
 * element, and stay public for exactly that. This exists because the hooks
 * cannot RENDER, and everything a person actually sees during a drag is a
 * rendered thing: the highlight on a target that will accept, the gap that opens
 * where it lands, the live region that speaks it. A consumer cannot supply any
 * of them — `purity-2` refuses an inline `style=` in app code and the app rule
 * refuses custom CSS — so a hooks-only library makes the affordances literally
 * unbuildable outside it. The docs demo was the proof: showing a drag took three
 * hand-assembled wrappers.
 *
 * `Sortable` is the ordered-list preset on top. It is a separate component
 * because reordering and catching are different jobs — a Zone that holds nothing
 * sorts nothing.
 */
export const spec = {
  schemaVersion: 1 as const,
  name: 'Drag',
  componentClass: 'interactive' as const,
  category: 'data-display',
  description:
    'Shared context and drop targets for dragging — the generic layer beneath Sortable, for moving a thing somewhere that is not a reorder.',

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'announcer',
      element: 'div',
      kind: 'none',
      typography: 'none',
      description:
        'The single visually-hidden ARIA live region every drag in the tree announces through.',
    },
    {
      name: 'zone',
      element: 'div',
      kind: 'none',
      typography: 'none',
      description: 'A drop target, which highlights while a payload it accepts is over it.',
    },
  ],

  props: [],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'announcer',
          element: 'div',
          kind: 'none',
          typography: 'none',
          description: 'Visually-hidden live region, always in the DOM so a reader can watch it.',
        },
      ],
      props: [
        {
          name: 'onDrop',
          type: '(event: DropEvent) => void',
          moveSpecific: true,
          description:
            'Fires for every drop in the tree, after the target’s own handler. For a consumer that keeps one reducer rather than a handler per zone.',
        },
        {
          name: 'labels',
          type: 'Partial<DragLabels>',
          moveSpecific: true,
          description: 'Strings the live region speaks.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Anything that drags or catches.',
        },
      ],
      usesFactory: true,
      description:
        'Holds the three things that cannot live on one item: the drag in flight, the registry every zone hit-tests against, and one live region. Optional above a single Sortable — that mounts its own.',
    },
    {
      name: 'Zone',
      slots: [
        {
          name: 'zone',
          element: 'div',
          kind: 'none',
          typography: 'none',
          description: 'The catching element.',
        },
      ],
      props: [
        {
          name: 'id',
          type: 'string',
          moveSpecific: false,
          description:
            'Identifies the target in the drop event, and is a real DOM id — one zone, one name, in both places.',
        },
        {
          name: 'group',
          type: 'string',
          moveSpecific: true,
          description: 'Names a group of targets, carried into the drop event.',
        },
        {
          name: 'accepts',
          type: '(payload: DragPayload) => boolean',
          moveSpecific: true,
          description:
            'Refuse a payload. The zone shows its refusal before the release rather than swallowing the drop.',
        },
        {
          name: 'onDrop',
          type: '(event: DropEvent) => void',
          moveSpecific: true,
          description: 'Called when a payload this zone accepts is released over it.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Catches nothing, and does not highlight.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'What the zone shows — its own content, or nothing when empty.',
        },
      ],
      usesFactory: true,
      description:
        'A drop target. This is the thing reordering cannot express: a slot that stays visible while empty holds no item to reorder, and a second list is somewhere the item leaves the first entirely.',
    },
  ],

  anatomy: {
    slot: 'zone',
    dataAttributes: ['data-drag-active', 'data-over', 'data-can-drop'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,
  childrenKind: 'composition' as const,

  // The highlight is a CSS transition on a data attribute, not an animation
  // trigger: it has to be able to start and reverse mid-drag, at whatever moment
  // the pointer crosses the edge, which is what a transition is for.
  animations: [],

  tokens: [
    {
      name: '--move-drag-zone-bg-active',
      value: 'var(--move-drop-target-bg-active)',
      description: 'Background while a payload this zone accepts is over it',
    },
    {
      name: '--move-drag-zone-border-active',
      value: 'var(--move-drop-target-border-active)',
      description: 'Border while accepting',
    },
    {
      name: '--move-drag-zone-border-refused',
      value: 'var(--move-drop-target-border-refused)',
      description:
        'Border while over a zone that will not take what is being carried. Neutral rather than alarming, and distinguished from resting by shape (solid where resting is dashed) so it does not rely on telling two greys apart',
    },
    {
      name: '--move-drag-zone-bg-refused',
      value: 'var(--move-drop-target-bg-refused)',
      description: 'Fill while refusing',
    },
    {
      name: '--move-drag-zone-transition',
      value: '350ms',
      description:
        'How long the accept highlight takes to arrive. Long enough to read as a response rather than a flicker while the pointer crosses back and forth.',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [
    {
      key: 'lifted',
      default: 'Lifted. Position {position} of {count}.',
      description: 'Announced on pick up — positions, because that is what a person hears',
    },
    {
      key: 'dropped',
      default: 'Dropped at position {position} of {count}.',
      description: 'Announced on a completed move',
    },
    {
      key: 'cancelled',
      default: 'Cancelled. Returned to the original position.',
      description: 'Announced when a drag is abandoned',
    },
    {
      key: 'droppedOn',
      default: 'Dropped on {target}.',
      description: 'Announced when a payload lands on a named zone rather than a position',
    },
  ],

  // No COLOCATED hook. The hooks this is built on — useDraggable, useDropTarget,
  // useDragRegistry — are cross-cutting and live in src/hooks/, because they
  // attach dragging to anything rather than to this component. That is the whole
  // reason both layers exist.
  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  renderContracts: [
    {
      id: 'root-renders-announcer',
      description:
        'Root always renders the live region, whether or not a drag is running. An aria-live element added at the moment the text arrives is not watched yet, so the first announcement of every session would be silent.',
    },
    {
      id: 'zone-requires-root',
      description:
        'Zone registers into Root’s target registry. Without a Root above it, it reports isOver false rather than throwing — a target with nothing to catch is inert, not broken.',
    },
  ],

  testing: {
    behaviors: [
      'Root renders the live region on mount, before any drag',
      'Root provides context to nested Zones',
      'Zone registers with Root and highlights while a payload is over it',
      'Zone with accepts=false shows refusal while over, and swallows no drop',
      'Zone outside a Root is inert rather than throwing',
      'Zone unregisters on unmount and catches nothing after',
      'onDrop on Root fires after the Zone’s own handler',
      'A cancelled drag fires no Zone onDrop',
      'Announcements use positions, not indices',
      'Forwards className and style',
      'Forwards ref to root element',
    ],
  },
} satisfies ComponentSpec;
