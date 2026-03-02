// Avatar.demo.spec.ts — Demo specification
// sourceOfTruth: demo generation contract for Avatar

export const demoSpec = {
  id: 'core:Avatar',
  name: 'Avatar',
  category: 'core',
  description: 'User avatar with image, fallback, size options, and spring entrance animation',
  fixtures: {
    avatarSrc: 'https://i.pravatar.cc/120?img=10',
    avatarAlt: 'Avatar',
    fallbackText: 'AW',
  },
  controls: [
    {
      name: 'sample',
      kind: 'select',
      options: ['single', 'fallbackOnly', 'group'],
      defaultValue: 'single',
    },
  ],
  initialProps: {
    sample: 'single',
  },
  samples: [
    { id: 'single', label: 'Single Avatar' },
    { id: 'fallbackOnly', label: 'Fallback Only' },
    { id: 'group', label: 'Avatar Group' },
  ],
  subComponents: [
    {
      name: 'Root',
      controls: [
        {
          name: 'size',
          kind: 'select',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          defaultValue: 'md',
        },
      ],
      initialProps: {
        size: 'md',
      },
      children: [
        {
          name: 'Image',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'src', kind: 'text', defaultValue: 'https://i.pravatar.cc/120?img=10' },
            { name: 'alt', kind: 'text', defaultValue: 'Avatar' },
          ],
          initialProps: {
            src: 'https://i.pravatar.cc/120?img=10',
            alt: 'Avatar',
          },
        },
        {
          name: 'Fallback',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'text', kind: 'text', defaultValue: 'AW' },
            { name: 'delayMs', kind: 'number', defaultValue: 0 },
          ],
          initialProps: {
            text: 'AW',
            delayMs: 0,
          },
        },
      ],
    },
  ],
} as const;
