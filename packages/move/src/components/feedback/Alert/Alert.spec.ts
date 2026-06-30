// Alert.spec.ts — Component specification
// specHash: b9fbaaa9

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Alert',
  componentClass: 'display' as const,
  category: 'feedback',
  description:
    'Dismissible alert banner with variant colors, icon, title, and enter/exit animation',
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Alert container with role=alert' },
    { name: 'icon', element: 'span', description: 'Icon wrapper' },
    { name: 'content', element: 'div', description: 'Content wrapper for title and description' },
    { name: 'title', element: 'div', description: 'Alert title text' },
    { name: 'description', element: 'div', description: 'Alert description text (children)' },
    { name: 'close', element: 'button', description: 'Close button' },
  ],

  props: [
    {
      name: 'variant',
      type: "'info' | 'success' | 'warning' | 'danger'",
      default: "'info'",
      moveSpecific: true,
      description: 'Color variant',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Alert size',
    },
    {
      name: 'icon',
      type: 'string | boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Icon name, true for default variant icon, false to hide',
    },
    { name: 'title', type: 'React.ReactNode', moveSpecific: true, description: 'Alert title' },
    {
      name: 'closable',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Show close button',
    },
    {
      name: 'onClose',
      type: '() => void',
      moveSpecific: true,
      description: 'Called when close button is clicked',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Animation config or false to disable',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Alert description content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size'],
    ariaAttributes: ['role="alert"'],
    children: [
      { slot: 'icon', ariaAttributes: ['aria-hidden="true"'] },
      {
        slot: 'content',
        children: [{ slot: 'title' }, { slot: 'description' }],
      },
      { slot: 'close', ariaAttributes: ['aria-label'] },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,
  surface: { slot: 'root', level: 'subtle' },
  dismissBehavior: 'unmountAfterExit' as const,

  animations: [
    {
      trigger: 'Root.enter',
      sequence: [{ animation: { opacity: { from: 0, to: 1 }, y: { from: -8, to: 0 } } }],
    },
    { trigger: 'Root.exit', sequence: [{ animation: { opacity: { to: 0 }, y: { to: -8 } } }] },
  ],

  tokens: [
    { name: '--move-alert-bg', value: 'var(--move-bg-subtle)', description: 'Alert background' },
    { name: '--move-alert-fg', value: 'var(--move-fg-base)', description: 'Alert text color' },
    {
      name: '--move-alert-border',
      value: 'var(--move-border-base)',
      description: 'Alert border color',
    },
    {
      name: '--move-alert-accent',
      value: 'var(--move-info)',
      description: 'Accent color (changes per variant)',
    },
    { name: '--move-alert-radius', value: 'var(--move-rounded-lg)', description: 'Border radius' },
    {
      name: '--move-alert-padding-x',
      value: 'var(--move-spacing-md)',
      description: 'Horizontal padding',
    },
    {
      name: '--move-alert-padding-y',
      value: 'var(--move-spacing-sm)',
      description: 'Vertical padding',
    },
    {
      name: '--move-alert-close-size',
      value: 'var(--move-space-5)',
      description: 'Close button size',
    },
    {
      name: '--move-alert-close-radius',
      value: 'var(--move-rounded-sm)',
      description: 'Close button radius',
    },
    {
      name: '--move-alert-close-fg',
      value: 'var(--move-fg-muted)',
      description: 'Close button color',
    },
    {
      name: '--move-alert-close-fg-hover',
      value: 'var(--move-fg-base)',
      description: 'Close button hover color',
    },
    {
      name: '--move-alert-close-bg-hover',
      value: 'var(--move-bg-muted)',
      description: 'Close button hover background',
    },
  ],

  variants: {
    variant: ['info', 'success', 'warning', 'danger'],
  },
  sizes: ['sm', 'md', 'lg'],

  labels: [{ key: 'close', default: 'Close alert', description: 'Close button aria-label' }],
  renderContracts: [
    {
      id: 'close-unmounts-after-exit',
      description:
        'Close action unmounts alert after exit lifecycle animation and then calls onClose',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'],
  componentDeps: [],

  testing: {
    behaviors: [
      'Renders with role=alert',
      'Applies variant styling via data-variant',
      'Shows default icon per variant',
      'Shows custom icon when icon prop is a string',
      'Hides icon when icon=false',
      'Renders title when provided',
      'Renders children as description',
      'Shows close button when closable=true',
      'Calls onClose when close button clicked',
      'Hides after close animation completes',
    ],
    aria: ['Has role=alert on root', 'Icon has aria-hidden=true', 'Close button has aria-label'],
    animation: [
      'Entrance animation plays on mount',
      'Exit animation plays on close',
      'animations={false} disables all animation',
    ],
  },

  iconsUsed: ['circle-check', 'circle-x', 'info', 'triangle-alert', 'x'],
} satisfies ComponentSpec;
