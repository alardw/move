// Generated from InputText.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { InputText } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:InputText',
  name: 'InputText',
  category: 'form',
  description: 'Single-line text input with outlined/filled variants, icon slots, and configurable size',
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
      name: 'consumer.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'consumer.invalid',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'consumer.readOnly',
      kind: 'boolean',
      defaultValue: false,
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
      name: 'playground.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.invalid',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.readOnly',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'consumer.variant': 'outlined',
    'consumer.size': 'md',
    'consumer.disabled': false,
    'consumer.invalid': false,
    'consumer.readOnly': false,
    'playground.variant': 'outlined',
    'playground.size': 'md',
    'playground.placeholder': 'Type something…',
    'playground.disabled': false,
    'playground.invalid': false,
    'playground.readOnly': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// outlined (default)
<InputText placeholder="Enter your name" />

// filled variant
<InputText variant="filled" placeholder="Search…" />

// with icons
<InputText iconLeft={<span>🔍</span>} placeholder="Search…" />

// invalid state
<InputText invalid placeholder="Required field" />`,
      render: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
          <InputText
            variant={props['consumer.variant'] as string}
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
            invalid={props['consumer.invalid'] as boolean}
            readOnly={props['consumer.readOnly'] as boolean}
            placeholder="Enter your name"
          />
          <InputText
            variant="filled"
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
            invalid={props['consumer.invalid'] as boolean}
            readOnly={props['consumer.readOnly'] as boolean}
            placeholder="Search…"
          />
          <InputText
            variant={props['consumer.variant'] as string}
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
            iconLeft={<span>🔍</span>}
            placeholder="Search…"
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
        const disabled = Boolean(props['playground.disabled']);
        const invalid = Boolean(props['playground.invalid']);
        const readOnly = Boolean(props['playground.readOnly']);

        const extraProps = [
          disabled && '  disabled',
          invalid && '  invalid',
          readOnly && '  readOnly',
        ].filter(Boolean).join('\n');

        return `<InputText
  variant="${variant}"
  size="${size}"
  placeholder="${placeholder}"${extraProps ? '\n' + extraProps : ''}
/>`;
      },
      render: (props) => (
        <div style={{ maxWidth: 320 }}>
          <InputText
            variant={props['playground.variant'] as string}
            size={props['playground.size'] as string}
            placeholder={props['playground.placeholder'] as string}
            disabled={props['playground.disabled'] as boolean}
            invalid={props['playground.invalid'] as boolean}
            readOnly={props['playground.readOnly'] as boolean}
          />
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ maxWidth: 320 }}>
      <InputText
        variant={props['playground.variant'] as string}
        size={props['playground.size'] as string}
        placeholder={props['playground.placeholder'] as string}
        disabled={props['playground.disabled'] as boolean}
        invalid={props['playground.invalid'] as boolean}
        readOnly={props['playground.readOnly'] as boolean}
      />
    </div>
  ),
};
