// Generated from Password.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Password } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:Password',
  name: 'Password',
  category: 'form',
  description: 'Password input with visibility toggle button, outlined/filled variants, and optional left icon',
  controls: [
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
      defaultValue: 'Enter password',
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
    'playground.variant': 'outlined',
    'playground.size': 'md',
    'playground.placeholder': 'Enter password',
    'playground.disabled': false,
    'playground.invalid': false,
    'playground.readOnly': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<Password placeholder="Enter password" />

<Password variant="filled" placeholder="Filled variant" />`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
          <Password placeholder="Enter password" />
          <Password variant="filled" placeholder="Filled variant" />
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const variant = String(props['playground.variant'] ?? 'outlined');
        const size = String(props['playground.size'] ?? 'md');
        const placeholder = String(props['playground.placeholder'] ?? '');

        return `<Password variant="${variant}" size="${size}" placeholder="${placeholder}" />`;
      },
      render: (props) => (
        <div style={{ maxWidth: 320 }}>
          <Password
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
      <Password
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
