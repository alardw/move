// ChatBubble.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'ChatBubble',
  animationPatterns: ['listReveal'],
  componentClass: 'display' as const,
  category: 'data-display',
  description: 'Conversation bubble for chat UIs with avatar, placement, tail, and variant support',
  choreographies: ['listReveal'],
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Flex row container with placement direction' },
    {
      name: 'avatar',
      element: 'span',
      description: 'Avatar wrapper (renders Move Avatar internally)',
    },
    {
      name: 'container',
      element: 'div',
      description: 'Bubble shape with variant coloring and optional tail',
    },
    { name: 'header', element: 'div', description: 'Sender name / metadata' },
    { name: 'content', element: 'div', description: 'Message body text' },
    { name: 'footer', element: 'div', description: 'Status text / timestamp' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Flex row container' }],
      props: [
        {
          name: 'placement',
          type: "'start' | 'end'",
          default: "'start'",
          moveSpecific: true,
          description: 'Bubble alignment (start=left, end=right)',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Enter animation config',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'ChatBubble children',
        },
      ],
      usesFactory: true,
      description: 'Root container providing placement context',
    },
    {
      name: 'Avatar',
      slots: [{ name: 'avatar', element: 'span', description: 'Avatar wrapper' }],
      props: [
        { name: 'src', type: 'string', moveSpecific: true, description: 'Avatar image source' },
        {
          name: 'fallback',
          type: 'React.ReactNode',
          moveSpecific: true,
          description: 'Fallback content when image unavailable',
        },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Avatar size',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Custom avatar content (overrides src/fallback)',
        },
      ],
      usesFactory: true,
      description: 'Avatar slot using Move Avatar component internally',
    },
    {
      name: 'Container',
      slots: [{ name: 'container', element: 'div', description: 'Bubble shape' }],
      props: [
        {
          name: 'variant',
          type: "'neutral' | 'primary' | 'success' | 'warning' | 'error'",
          default: "'neutral'",
          moveSpecific: true,
          description: 'Bubble color variant',
        },
        {
          name: 'color',
          typeRef: 'Color',
          moveSpecific: true,
          description:
            'Override bubble bg/fg via the named Open Color palette. Takes precedence over `variant` when set.',
        },
        {
          name: 'tail',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Show tail pointing toward avatar',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Bubble content',
        },
      ],
      usesFactory: true,
      description: 'Bubble shape with variant coloring, tail, and placement-aware corners',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Header area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Header content',
        },
      ],
      usesFactory: true,
      description: 'Sender name or metadata',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'div', description: 'Content area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Message content',
        },
      ],
      usesFactory: true,
      description: 'Message body text',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'div', description: 'Footer area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Footer content',
        },
      ],
      usesFactory: true,
      description: 'Status text or timestamp',
    },
  ],

  props: [
    {
      name: 'placement',
      type: "'start' | 'end'",
      default: "'start'",
      moveSpecific: true,
      description: 'Bubble alignment direction',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Enter animation config',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'ChatBubble sub-components',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-placement'],
    children: [
      { slot: 'avatar' },
      {
        slot: 'container',
        dataAttributes: ['data-variant', 'data-placement', 'data-tail'],
        children: [{ slot: 'header' }, { slot: 'content' }, { slot: 'footer' }],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animationCapabilities: ['measureThenAnimate'],
  animations: [
    {
      trigger: 'Root.enter',
      sequence: [
        { animation: { opacity: { from: 0, to: 1 }, y: { from: 8, to: 0, ease: 'poppy' } } },
      ],
    },
  ],

  renderContracts: [
    {
      id: 'placement-context',
      description:
        'Root provides placement via React context; Container reads it for data-placement and tail direction',
    },
    {
      id: 'avatar-internal',
      description: 'Avatar sub-component renders Move Avatar internally with animate={false}',
    },
    {
      id: 'stagger-siblings',
      description: 'Root enter animation uses sibling index * 60ms delay for stagger effect',
    },
  ],

  tokens: [
    {
      name: '--move-chatbubble-gap',
      value: 'var(--move-spacing-sm)',
      description: 'Gap between avatar and bubble',
    },
    { name: '--move-chatbubble-max-width', value: '80%', description: 'Maximum bubble width' },
    {
      name: '--move-chatbubble-bg',
      value: 'var(--move-bg-muted)',
      description: 'Default bubble background',
    },
    {
      name: '--move-chatbubble-fg',
      value: 'var(--move-fg-base)',
      description: 'Default bubble foreground',
    },
    {
      name: '--move-chatbubble-radius',
      value: 'var(--move-rounded-xl)',
      description: 'Bubble border radius',
    },
    {
      name: '--move-chatbubble-padding-x',
      value: 'var(--move-spacing-md)',
      description: 'Bubble horizontal padding',
    },
    {
      name: '--move-chatbubble-padding-y',
      value: 'var(--move-spacing-sm)',
      description: 'Bubble vertical padding',
    },
  ],

  variants: {
    variant: ['neutral', 'primary', 'success', 'warning', 'error'],
  },
  sizes: ['sm', 'md', 'lg'],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'],
  componentDeps: ['Avatar'],

  testing: {
    behaviors: [
      'Renders Root with data-placement attribute',
      'Defaults to placement=start',
      'Container renders data-variant attribute',
      'Container defaults to variant=neutral',
      'Container shows tail via data-tail attribute',
      'Container inherits placement from Root context',
      'Avatar renders children or Move Avatar fallback',
      'Header renders children',
      'Content renders children',
      'Footer renders children',
      'Forwards className and style on Root',
      'Forwards ref on Root',
    ],
    animation: [
      'Root animates on mount with scale+opacity enter',
      'Root respects animations={false} to disable animation',
    ],
  },
} satisfies ComponentSpec;
