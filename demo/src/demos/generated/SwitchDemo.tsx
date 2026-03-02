// Generated from Switch.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Switch } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:Switch',
  name: 'Switch',
  category: 'form',
  description: 'Toggle switch built on Radix Switch with animated thumb, size variants, and optional inline label',
  controls: [
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
      name: 'playground.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.label',
      kind: 'text',
      defaultValue: 'Enable notifications',
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
    'consumer.size': 'md',
    'consumer.disabled': false,
    'playground.size': 'md',
    'playground.label': 'Enable notifications',
    'playground.disabled': false,
    'playground.invalid': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// basic switch
<Switch.Root>
  <Switch.Thumb />
</Switch.Root>

// with label
<Switch.Root label="Dark mode">
  <Switch.Thumb />
</Switch.Root>`,
      render: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Switch.Root
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
          >
            <Switch.Thumb />
          </Switch.Root>
          <Switch.Root
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
            label="Dark mode"
          >
            <Switch.Thumb />
          </Switch.Root>
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const size = String(props['playground.size'] ?? 'md');
        const label = String(props['playground.label'] ?? '');
        const disabled = Boolean(props['playground.disabled']);
        const invalid = Boolean(props['playground.invalid']);

        const extraProps = [
          label && `  label="${label}"`,
          disabled && '  disabled',
          invalid && '  invalid',
        ].filter(Boolean).join('\n');

        return `<Switch.Root size="${size}"${extraProps ? '\n' + extraProps : ''}>
  <Switch.Thumb />
</Switch.Root>`;
      },
      render: (props) => (
        <Switch.Root
          size={props['playground.size'] as string}
          label={props['playground.label'] as string || undefined}
          disabled={props['playground.disabled'] as boolean}
          invalid={props['playground.invalid'] as boolean}
        >
          <Switch.Thumb />
        </Switch.Root>
      ),
    },
  ],
  render: (props) => (
    <Switch.Root
      size={props['playground.size'] as string}
      label={props['playground.label'] as string || undefined}
      disabled={props['playground.disabled'] as boolean}
      invalid={props['playground.invalid'] as boolean}
    >
      <Switch.Thumb />
    </Switch.Root>
  ),
};
