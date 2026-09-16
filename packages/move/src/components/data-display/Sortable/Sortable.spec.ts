// Sortable.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

/**
 * Reordering a list by dragging, and the keyboard path that goes with it.
 *
 * The preset over `Drag`: an Item is both a draggable and a drop position, which
 * is the ordinary case and the one worth making declarative. `Drag.Zone` stays
 * separate for everything that is not a reorder — a slot that holds nothing, a
 * second list the item leaves for.
 *
 * ITEM OWNS ITS HANDLE. There is no `Sortable.Handle` to place, because placing
 * it is the job every consumer would otherwise redo: the docs demo for the
 * hooks-only version needed three hand-assembled wrappers before it could show
 * anything, each wiring an icon button, a cursor, a menu and its keyboard
 * behaviour slightly differently. `handle` is a prop with three values instead,
 * so every sortable list in every app puts the affordance in the same place.
 *
 * THE MENU IS THE KEYBOARD PATH AND ONLY THAT. A pointer user drags; the menu
 * never opens for them. A keyboard user focuses the handle and gets named moves.
 * Arrow-key dragging is deliberately absent — Atlassian, who wrote and maintained
 * the reference implementation of it, now advise against it, because the movement
 * does not generalise across layouts, costs too many keystrokes on a long list,
 * and competes with the screen reader for the same keys.
 */
export const spec = {
  schemaVersion: 1 as const,
  name: 'Sortable',
  componentClass: 'interactive' as const,
  category: 'data-display',
  description:
    'A list whose rows can be reordered by dragging, with a named-move menu as the keyboard equivalent. The order stays the consumer’s data.',

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      kind: 'group',
      typography: 'none',
      description: 'The list container. Owns the reorder context and draws the drop indicator.',
    },
    {
      name: 'item',
      element: 'div',
      kind: 'item',
      typography: 'none',
      description: 'One row: a draggable and a drop position at once.',
    },
    {
      name: 'handle',
      element: 'Button',
      kind: 'control',
      typography: 'none',
      description:
        'What a pointer grabs and a keyboard focuses. Rendered by Item, never placed by the call site.',
    },
    {
      name: 'indicator',
      element: 'div',
      kind: 'indicator',
      typography: 'none',
      description:
        'The line in the gap showing where the row will land. Absent when there is no relative placement to show.',
    },
  ],

  props: [],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'root',
          element: 'div',
          kind: 'group',
          typography: 'none',
          description: 'List container and reorder context.',
        },
        {
          name: 'indicator',
          element: 'div',
          kind: 'indicator',
          typography: 'none',
          description: 'Drop position line, drawn between items rather than on one.',
        },
      ],
      props: [
        {
          name: 'onReorder',
          type: '(change: SortableChange) => void',
          moveSpecific: true,
          description:
            'The only call-site obligation. Reports source and destination; applying the move is the consumer’s, so the order lives with the rest of their data. A cancelled drag arrives with destination null — a move that did not happen, not a move to nowhere.',
        },
        {
          name: 'list',
          type: 'string',
          moveSpecific: true,
          description:
            'Names this list. Two lists with different ids under one Drag.Root is what lets a row move between them.',
        },
        {
          name: 'axis',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          moveSpecific: true,
          description: 'Which way the list runs, which decides the indicator and the drag axis.',
        },
        {
          name: 'animate',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description:
            'Rows slide to their new places after a move. Off renders the new order immediately.',
        },
        {
          name: 'labels',
          type: 'Partial<SortableLabels>',
          moveSpecific: true,
          description: 'The move names and the announcements.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Sortable.Item rows, in the consumer’s current order.',
        },
      ],
      usesFactory: true,
      description:
        'Holds the order context and draws the indicator. Mounts its own drag context when there is no Drag.Root above, so the single-list case needs no wrapper.',
    },
    {
      name: 'Item',
      slots: [
        {
          name: 'item',
          element: 'div',
          kind: 'item',
          typography: 'none',
          description: 'The row.',
        },
        {
          name: 'handle',
          element: 'Button',
          kind: 'control',
          typography: 'none',
          description: 'The grab point, rendered by Item according to `handle`.',
        },
      ],
      props: [
        {
          name: 'id',
          type: 'string',
          moveSpecific: false,
          description:
            'Identifies the row across a move, and is a real DOM id — one row, one name, in both places.',
        },
        {
          name: 'index',
          type: 'number',
          moveSpecific: true,
          description:
            'This row’s position. Passed rather than inferred, because the order is the consumer’s array and only they know it.',
        },
        {
          name: 'handle',
          type: "'start' | 'end' | 'none'",
          default: "'start'",
          moveSpecific: true,
          description:
            'Where the grab point sits, or `none` to make the whole row draggable — right for a card, which already reads as liftable, and wrong for a row with other controls in it.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description:
            'A row that cannot move — a closed item, a pinned one. It keeps its place while others reorder around it, and offers no handle and no moves.',
        },
        {
          name: 'label',
          type: 'string',
          moveSpecific: true,
          description:
            'Names this row for the handle and the announcements. Without it a screen reader hears a position and no subject.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'The row’s content.',
        },
      ],
      usesFactory: true,
      description:
        'A draggable and a drop position at once. Renders its own handle, wires the keyboard menu, and marks itself so the container can measure it.',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-axis', 'data-dragging', 'data-drop-before', 'data-drop-after'],
  },

  capabilities: ['takes-focus', 'takes-disabled'],

  controlled: null,
  // `toggle`: Enter or Space on a focused handle opens its move menu. Each
  // handle is its own tab stop rather than a roving one — the rows are separate
  // controls, not a single widget with an inner cursor. Arrow keys inside the
  // open menu are Dropdown's, and Escape abandons a pointer drag.
  keyboard: 'toggle' as const,
  focus: 'self' as const,
  formType: null,
  asChild: false,
  childrenKind: 'composition' as const,

  animationCapabilities: ['layoutFlip'],
  // Rows sliding to their new places is a FLIP on the container, which
  // `useAutoLayout` already does — declared as the capability rather than
  // rebuilt as triggers. The drag transform is not an animation at all: it is a
  // per-frame follow, written straight onto the element.
  animations: [],

  tokens: [
    {
      name: '--move-sortable-gap',
      value: 'var(--move-space-2)',
      description: 'Space between rows, which is also the gap the indicator is centred in',
    },
    {
      name: '--move-sortable-indicator-size',
      value: 'var(--move-space-1)',
      description: 'Thickness of the drop line',
    },
    {
      name: '--move-sortable-indicator-color',
      value: 'var(--move-accent-border)',
      description: 'Colour of the drop line and its terminal',
    },
    {
      name: '--move-sortable-indicator-terminal',
      value: 'var(--move-space-2)',
      description:
        'Diameter of the dot at the line’s leading edge, which is what makes a 2px line findable',
    },
    {
      name: '--move-sortable-handle-size',
      value: 'var(--move-control-height-sm)',
      description: 'Touch target for the handle, which has to stay grabbable on a phone',
    },
    {
      name: '--move-sortable-item-shadow-dragging',
      value: 'var(--move-shadow-elevated)',
      description: 'The lift on the row under the pointer',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [
    { key: 'moveUp', default: 'Move up', description: 'Menu action, one position earlier' },
    { key: 'moveDown', default: 'Move down', description: 'Menu action, one position later' },
    { key: 'moveToTop', default: 'Move to top', description: 'Menu action, first position' },
    { key: 'moveToBottom', default: 'Move to bottom', description: 'Menu action, last position' },
    {
      key: 'dragHandle',
      default: 'Reorder {label}',
      description: 'Accessible name for the handle, which is otherwise an unlabelled icon button',
    },
    {
      key: 'lifted',
      default: 'Lifted {label}. Position {position} of {count}.',
      description: 'Announced on pick up, by position rather than index',
    },
    {
      key: 'dropped',
      default: 'Dropped {label} at position {position} of {count}.',
      description: 'Announced on a completed move',
    },
    {
      key: 'cancelled',
      default: 'Cancelled. {label} returned to its original position.',
      description: 'Announced when a drag is abandoned',
    },
  ],

  // No COLOCATED hook. useSortable is cross-cutting and lives in src/hooks/,
  // because it attaches reordering to anything rather than to this component.
  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: ['Drag', 'Dropdown', 'Button', 'Icon', 'LayoutGroup'],
  iconsUsed: ['grip-vertical'],

  renderContracts: [
    {
      id: 'item-renders-its-own-handle',
      description:
        'Item renders the handle from the `handle` prop. There is no Handle sub-component to place — that is the assembly this component exists to remove, and exposing one would put it back.',
    },
    {
      id: 'menu-opens-on-keyboard-only',
      description:
        'The move menu opens from Enter or Space on a focused handle, never from a pointer press. A pointer user drags; opening a menu under their finger would both compete with the drag and leave a menu standing after the drop.',
    },
    {
      id: 'menu-closes-after-a-move',
      description:
        'Performing a move closes the menu. The row has moved, so the menu’s own actions no longer describe where it is.',
    },
    {
      id: 'root-mounts-a-drag-context-when-alone',
      description:
        'Root provides a drag context when none is above it, so a single list needs no Drag.Root. Nested under one, it uses that instead, which is what makes two lists share a drag.',
    },
    {
      id: 'indicator-only-for-relative-placement',
      description:
        'The indicator draws between two positions. Where there is no relative placement to show — an empty list, a drop onto a zone — it is absent rather than drawn at an arbitrary edge.',
    },
  ],

  testing: {
    behaviors: [
      'Root renders children in the given order',
      'Item renders a handle at the start by default',
      'handle="end" moves the grab point, handle="none" makes the whole row draggable',
      'A disabled Item renders no handle and offers no moves',
      'Dragging a row past a neighbour reports onReorder with source and destination',
      'Escape during a drag reports destination null and restores the row',
      'The handle does not open the menu on pointer press',
      'Enter on a focused handle opens the menu',
      'Choosing a move calls onReorder and closes the menu',
      'Move actions are disabled at the ends of the list',
      'The handle carries an accessible name built from the item label',
      'Announcements name the row and use positions, not indices',
      'The indicator is absent until a drag is in progress',
      'Two Roots under one Drag.Root can exchange a row',
      'Forwards className and style',
      'Forwards ref to root element',
    ],
  },
} satisfies ComponentSpec;
