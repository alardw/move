// Avatar.spec.ts — Component specification
// specHash: c909e0e0

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Avatar',
  componentClass: 'display' as const,
  category: 'data-display',
  description: 'User avatar with image, fallback, and size options',

  synonyms: ['profile picture', 'user image', 'portrait', 'user icon', 'gravatar', 'initials'],
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'span',
  slots: [
    { name: 'root', element: 'RadixAvatar.Root', description: 'Avatar root (Radix Avatar.Root)' },
  ],

  subComponents: [
    {
      name: 'Group',
      slots: [
        { name: 'group', element: 'div', description: 'Inline-flex container for stacked avatars' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Avatar.Root children',
        },
      ],
      usesFactory: true,
      description: 'Container for an overlapping avatar group',
    },
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'RadixAvatar.Root', description: 'Avatar root element' }],
      props: [
        {
          name: 'size',
          typeRef: 'SizeWithXL',
          default: "'md'",
          moveSpecific: true,
          description: 'Avatar size',
        },
        {
          name: 'color',
          typeRef: 'Color',
          moveSpecific: true,
          description: 'Tints the fallback bg/fg using the named Open Color palette.',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description:
            'Optional declarative animation config — none by default (the mount fade is CSS)',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Avatar.Image and Avatar.Fallback',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Avatar.Root',
      description: 'Individual avatar container',
    },
    {
      name: 'Image',
      slots: [{ name: 'image', element: 'RadixAvatar.Image', description: 'Avatar image element' }],
      props: [
        { name: 'src', type: 'string', moveSpecific: false, description: 'Image source URL' },
        { name: 'alt', type: 'string', moveSpecific: false, description: 'Image alt text' },
        {
          name: 'onLoadingStatusChange',
          type: "(status: 'idle' | 'loading' | 'loaded' | 'error') => void",
          moveSpecific: true,
          description: 'Loading status callback',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Avatar.Image',
      description: 'Avatar image with loading state management',
    },
    {
      name: 'Fallback',
      slots: [
        {
          name: 'fallback',
          element: 'RadixAvatar.Fallback',
          description: 'Fallback content when image fails or loads',
        },
      ],
      props: [
        {
          name: 'delayMs',
          type: 'number',
          moveSpecific: true,
          description: 'Delay before showing fallback',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Fallback content (initials, icon)',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Avatar.Fallback',
      description: 'Fallback content shown when image is unavailable',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size'],
    children: [{ slot: 'image' }, { slot: 'fallback' }],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animationCapabilities: ['cssAnimation'],
  animations: [],

  tokens: [
    {
      name: '--move-avatar-size',
      value: 'var(--move-space-10)',
      description: 'Avatar size (width and height)',
    },
    {
      name: '--move-avatar-radius',
      value: 'var(--move-rounded-full)',
      description: 'Border radius',
    },
    {
      name: '--move-avatar-bg',
      value: 'var(--move-primary)',
      description: 'Fallback background color',
    },
    {
      name: '--move-avatar-fg',
      value: 'var(--move-primary-fg)',
      description: 'Fallback text color',
    },
    {
      name: '--move-avatar-border',
      value: 'var(--move-border-base)',
      description: 'Border color in group',
    },
  ],

  variants: {},
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'],

  labels: [],

  radixPrimitive: 'Avatar',
  hasHook: false,
  engineImports: ['withMoveComponent'],
  componentDeps: [],

  testing: {
    behaviors: [
      'Avatar.Root renders Radix Avatar.Root',
      'Avatar.Image renders img element',
      'Avatar.Fallback renders when image is unavailable',
      'Applies size via data-size attribute',
      'Defaults to size=md',
      'Avatar.Group renders inline-flex container',
      'Group avatars overlap with negative margin',
      'Forwards ref to root element',
    ],
    animation: ['Fades in on mount via CSS @keyframes (cssAnimation capability)'],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
