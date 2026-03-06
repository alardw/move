// Button.demo.spec.ts — Demo specification
// sourceOfTruth: demo generation contract for Button

export const demoSpec = {
  id: 'core:Button',
  name: 'Button',
  category: 'core',
  description: 'Clickable interactive element with variant, size, and animation support',
  controls: [
    {
      name: 'consumer.textOnly.variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      defaultValue: 'primary',
    },
    {
      name: 'consumer.withIcon.variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      defaultValue: 'secondary',
    },
    {
      name: 'consumer.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'consumer.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      defaultValue: 'primary',
    },
    {
      name: 'playground.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.text',
      kind: 'text',
      defaultValue: 'Button',
    },
    {
      name: 'playground.withIcon',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'playground.icon',
      kind: 'text',
      defaultValue: 'sparkles',
    },
    {
      name: 'playground.iconPosition',
      kind: 'select',
      options: ['left', 'right'],
      defaultValue: 'left',
    },
  ],
  initialProps: {
    'consumer.textOnly.variant': 'primary',
    'consumer.withIcon.variant': 'secondary',
    'consumer.size': 'md',
    'consumer.disabled': false,
    'playground.variant': 'primary',
    'playground.size': 'md',
    'playground.disabled': false,
    'playground.text': 'Button',
    'playground.withIcon': true,
    'playground.icon': 'sparkles',
    'playground.iconPosition': 'left',
  },
  samples: [
    { id: 'textOnly', label: 'Text Only' },
    { id: 'withIcon', label: 'Icon + Text' },
  ],
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// text-only
<Button variant="primary" size="md">
  Button
</Button>

// icon + text
<Button variant="secondary" size="md">
  <Icon name="sparkles" />
  <span>Generate</span>
</Button>`,
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: `<Button
  variant={playground.variant}
  size={playground.size}
  disabled={playground.disabled}
>
  {withIcon ? (
    iconPosition === 'right' ? (
      <>
        <span>{text}</span>
        <Icon name={icon} />
      </>
    ) : (
      <>
        <Icon name={icon} />
        <span>{text}</span>
      </>
    )
  ) : (
    <span>{text}</span>
  )}
</Button>`,
    },
  ],
} as const;
