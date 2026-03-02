// Badge.spec.ts — Component specification
// specHash: ddc033c4

export const spec = {
  schemaVersion: 6 as const,
  name: 'Badge',
  componentClass: 'presentational' as const,
  category: 'core',
  description: 'Inline status label with variant and size options',

  compound: false,
  rootElement: 'span',
  slots: [
    { name: 'root', element: 'span', description: 'Badge container' },
  ],

  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'", default: "'primary'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Badge size' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Badge content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-badge-radius', value: 'var(--move-rounded-full)', description: 'Border radius' },
    { name: '--move-badge-font-weight', value: 'var(--move-weight-medium)', description: 'Font weight' },
    { name: '--move-badge-font-size-sm', value: 'var(--move-text-xs)', description: 'Font size for sm' },
    { name: '--move-badge-font-size-md', value: 'var(--move-text-xs)', description: 'Font size for md' },
    { name: '--move-badge-font-size-lg', value: 'var(--move-text-sm)', description: 'Font size for lg' },
    { name: '--move-badge-height-sm', value: 'var(--move-space-5)', description: 'Height for sm' },
    { name: '--move-badge-height-md', value: 'var(--move-space-6)', description: 'Height for md' },
    { name: '--move-badge-height-lg', value: 'var(--move-space-8)', description: 'Height for lg (snapped from 1.75rem)' },
    { name: '--move-badge-padding-x-sm', value: 'var(--move-space-1)', description: 'Horizontal padding for sm (snapped from 0.375rem)' },
    { name: '--move-badge-padding-x-md', value: 'var(--move-space-2)', description: 'Horizontal padding for md' },
    { name: '--move-badge-padding-x-lg', value: 'var(--move-space-3)', description: 'Horizontal padding for lg (snapped from 0.625rem)' },
  ],

  variants: {
    variant: ['primary', 'secondary', 'outline', 'success', 'warning', 'danger'],
  },
  sizes: ['sm', 'md', 'lg'],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'],
  animationImports: [],
  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as span element',
      'Renders children content',
      'Applies variant via data-variant attribute',
      'Applies size via data-size attribute',
      'Defaults to variant=primary',
      'Defaults to size=md',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
