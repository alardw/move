// Generated from Textarea.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Textarea } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:Textarea',
  name: 'Textarea',
  category: 'form',
  description: 'Multi-line text input with outlined/filled variants, auto-resize support, and configurable size',
  controls: [
    {
      name: 'consumer.variant',
      kind: 'select',
      options: ['outlined', 'filled'],
      defaultValue: 'outlined',
    },
    {
      name: 'consumer.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.variant',
      kind: 'select',
      options: ['outlined', 'filled'],
      defaultValue: 'outlined',
    },
    {
      name: 'playground.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.placeholder',
      kind: 'text',
      defaultValue: 'Type something…',
    },
    {
      name: 'playground.autoSize',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.invalid',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'consumer.variant': 'outlined',
    'consumer.size': 'md',
    'playground.variant': 'outlined',
    'playground.size': 'md',
    'playground.placeholder': 'Type something…',
    'playground.autoSize': false,
    'playground.disabled': false,
    'playground.invalid': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// outlined (default)
<Textarea placeholder="Enter a description" />

// filled variant
<Textarea variant="filled" placeholder="Add a note…" />

// auto-size
<Textarea autoSize placeholder="Auto-growing textarea…" />`,
      render: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
          <Textarea
            variant={props['consumer.variant'] as string}
            size={props['consumer.size'] as string}
            placeholder="Enter a description"
          />
          <Textarea
            variant="filled"
            size={props['consumer.size'] as string}
            placeholder="Add a note…"
          />
          <Textarea
            variant={props['consumer.variant'] as string}
            size={props['consumer.size'] as string}
            autoSize
            placeholder="Auto-growing textarea…"
          />
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const variant = String(props['playground.variant'] ?? 'outlined');
        const size = String(props['playground.size'] ?? 'md');
        const placeholder = String(props['playground.placeholder'] ?? 'Type something…');
        const autoSize = Boolean(props['playground.autoSize']);
        const disabled = Boolean(props['playground.disabled']);
        const invalid = Boolean(props['playground.invalid']);

        const extraProps = [
          autoSize && '  autoSize',
          disabled && '  disabled',
          invalid && '  invalid',
        ].filter(Boolean).join('\n');

        return `<Textarea
  variant="${variant}"
  size="${size}"
  placeholder="${placeholder}"${extraProps ? '\n' + extraProps : ''}
/>`;
      },
      render: (props) => (
        <div style={{ maxWidth: 360 }}>
          <Textarea
            variant={props['playground.variant'] as string}
            size={props['playground.size'] as string}
            placeholder={props['playground.placeholder'] as string}
            autoSize={props['playground.autoSize'] as boolean}
            disabled={props['playground.disabled'] as boolean}
            invalid={props['playground.invalid'] as boolean}
          />
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ maxWidth: 360 }}>
      <Textarea
        variant={props['playground.variant'] as string}
        size={props['playground.size'] as string}
        placeholder={props['playground.placeholder'] as string}
        autoSize={props['playground.autoSize'] as boolean}
        disabled={props['playground.disabled'] as boolean}
        invalid={props['playground.invalid'] as boolean}
      />
    </div>
  ),
};
