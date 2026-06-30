// Image.spec.ts — Component specification
// specHash: 56031b51

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Image',
  componentClass: 'presentational' as const,
  category: 'media',
  description:
    'Responsive image wrapper with object-fit, radius, aspect ratio, fallback state, and action overlay support',

  synonyms: ['picture', 'photo', 'media', 'img'],
  families: {
    behavior: ['media', 'data-row'],
    state: ['stateless'],
    a11y: ['none'],
  },
  // Shared click-affordance contract for the data-row family.
  // See `src/shared/families.ts` → DataRowBehavior.
  behavior: {
    dataRow: {
      interactiveProp: true,
      keyboardActivate: true,
      hoverAffordance: true,
      rootHoverModifier: null,
    },
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Outer container with overflow hidden, radius, and sizing',
    },
    {
      name: 'backdrop',
      element: 'img',
      description:
        'Decorative blurred, scaled-up copy of the image painted behind it to fill letterbox bands (only when `backdrop` is set). aria-hidden.',
    },
    {
      name: 'img',
      element: 'img',
      description: 'The actual <img> element with object-fit and object-position',
    },
    {
      name: 'fallback',
      element: 'div',
      description:
        'Fallback placeholder shown when the image fails to load and no fallbackSrc is provided',
    },
    {
      name: 'action',
      element: 'div',
      description: 'Overlay container for action content, visible on hover/focus',
    },
  ],

  props: [
    { name: 'src', type: 'string', moveSpecific: true, description: 'Image source URL' },
    {
      name: 'sources',
      type: 'ImageSource[]',
      moveSpecific: true,
      description:
        'Array of responsive image variants with intrinsic pixel widths for container-based resolution',
    },
    { name: 'alt', type: 'string', moveSpecific: true, description: 'Alt text for the image' },
    {
      name: 'fallbackSrc',
      type: 'string',
      moveSpecific: true,
      description: 'Fallback image URL displayed when the primary src fails',
    },
    {
      name: 'fit',
      type: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'",
      default: "'cover'",
      moveSpecific: true,
      description: 'CSS object-fit value for the img element',
    },
    {
      name: 'backdrop',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description:
        'Fill letterbox bands with a blurred, scaled-up copy of the image behind it (the Apple Music / Spotify pattern). Most useful with `fit="contain"` on mixed aspect ratios; off by default.',
    },
    {
      name: 'radius',
      typeRef: 'Radius',
      default: "'none'",
      moveSpecific: true,
      description: 'Border radius applied to the root container',
    },
    {
      name: 'position',
      type: "'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'",
      default: "'center'",
      moveSpecific: true,
      description: 'CSS object-position value for the img element',
    },
    {
      name: 'aspectRatio',
      type: 'string',
      moveSpecific: true,
      description: 'CSS aspect-ratio value applied to the root container',
    },
    {
      name: 'width',
      type: 'string | number',
      moveSpecific: true,
      description: 'Width of the root container (number treated as px)',
    },
    {
      name: 'height',
      type: 'string | number',
      moveSpecific: true,
      description: 'Height of the root container (number treated as px)',
    },
    {
      name: 'loading',
      type: "'lazy' | 'eager'",
      moveSpecific: true,
      description: 'Native loading attribute passed to the img element',
    },
    {
      name: 'action',
      type: 'React.ReactNode',
      moveSpecific: true,
      description: 'Content rendered in the action overlay, revealed on hover or focus.',
    },
    {
      name: 'interactive',
      type: 'boolean',
      moveSpecific: true,
      description:
        'Make the image a click target. Adds cursor, hover tint, focus ring, and Enter/Space activation. Defaults to true when `onClick` is set.',
    },
    {
      name: 'onClick',
      type: '(event: React.MouseEvent<HTMLDivElement>) => void',
      moveSpecific: false,
      description: 'Click handler on the wrapper.',
    },
    {
      name: 'onLoad',
      type: 'React.ReactEventHandler<HTMLImageElement>',
      moveSpecific: true,
      description: 'Called when the image loads successfully',
    },
    {
      name: 'onError',
      type: 'React.ReactEventHandler<HTMLImageElement>',
      moveSpecific: true,
      description: 'Called when the image fails to load',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description:
        'Custom fallback content rendered inside the fallback slot when image errors and no fallbackSrc is set',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-fit', 'data-radius', 'data-position', 'data-backdrop'],
    children: [{ slot: 'backdrop' }, { slot: 'img' }, { slot: 'fallback' }, { slot: 'action' }],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-image-bg',
      value: 'var(--move-bg-muted)',
      description: 'Root background color visible while image loads',
    },
    {
      name: '--move-image-fallback-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Fallback placeholder background color',
    },
    {
      name: '--move-image-fallback-fg',
      value: 'var(--move-fg-subtle)',
      description: 'Fallback placeholder text/icon color',
    },
    {
      name: '--move-image-fallback-min-height',
      value: 'var(--move-space-20)',
      description: 'Minimum height of the fallback placeholder',
    },
    {
      name: '--move-image-action-bg',
      value: 'var(--move-overlay)',
      description: 'Action overlay background color',
    },
    {
      name: '--move-image-action-fg',
      value: 'var(--move-white)',
      description: 'Action overlay foreground color',
    },
    {
      name: '--move-image-backdrop-blur',
      value: '20px',
      description: 'Blur radius for the letterbox backdrop layer',
    },
  ],

  variants: {
    fit: ['cover', 'contain', 'fill', 'none', 'scale-down'] as string[],
    radius: ['none', 'sm', 'md', 'lg', 'full'] as string[],
    position: [
      'center',
      'top',
      'bottom',
      'left',
      'right',
      'top left',
      'top right',
      'bottom left',
      'bottom right',
    ] as string[],
  },
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    {
      id: 'responsive-sources',
      description:
        'When sources array is provided, uses ResizeObserver on root to select the best src based on container width * devicePixelRatio',
    },
    {
      id: 'fallback-on-error',
      description:
        'Shows fallback slot when img fails and no fallbackSrc is set; switches to fallbackSrc when available',
    },
    {
      id: 'error-reset-on-src',
      description: 'Resets error state when src or resolved source changes',
    },
    {
      id: 'action-conditional',
      description:
        'Action overlay only renders when action prop is provided and image is not in fallback state',
    },
    {
      id: 'action-hover-reveal',
      description:
        'Action overlay is hidden by default (opacity: 0) and revealed on root hover or focus-within',
    },
    {
      id: 'sizing-style',
      description:
        'Width, height, and aspectRatio are applied as inline styles on the root element; number values are converted to px strings',
    },
    {
      id: 'fallback-icon',
      description:
        'Default fallback content is an Icon with name "image-off" when no children are provided',
    },
    {
      id: 'backdrop-fill',
      description:
        'When `backdrop` is set (and the image is not in fallback state), an aria-hidden duplicate <img> of the same src renders behind the main img with object-fit:cover + blur + scale to fill letterbox bands; sets data-backdrop on root. The main img sits above it.',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: ['Icon'] as string[],

  testing: {
    behaviors: [
      'Renders img element with provided src',
      'Renders img element with alt text',
      'Applies data-fit attribute on root (defaults to cover)',
      'Applies data-radius attribute on root (defaults to none)',
      'Applies data-position attribute on root (defaults to center)',
      'Renders an aria-hidden backdrop img and sets data-backdrop when backdrop is set',
      'Omits the backdrop layer by default',
      'Sets width, height, and aspectRatio as inline styles on root',
      'Converts numeric width/height to px strings',
      'Shows fallback slot when image errors and no fallbackSrc is set',
      'Shows fallbackSrc image when image errors and fallbackSrc is provided',
      'Renders children as custom fallback content when image errors',
      'Renders default Icon fallback when no children and image errors',
      'Resets error state when src changes',
      'Shows action overlay when action prop is provided',
      'Hides action overlay when image is in fallback state',
      'Passes loading attribute to img element',
      'Calls onLoad when image loads',
      'Calls onError when image fails',
      'Selects responsive source based on container width when sources is provided',
      'Forwards className and style to root',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    aria: ['img element has alt attribute for accessibility'],
  },

  iconsUsed: ['image-off'],

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
