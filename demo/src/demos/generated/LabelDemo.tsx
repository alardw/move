// Generated from Label.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Label } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:Label',
  name: 'Label',
  category: 'form',
  description: 'Text label for form fields with required asterisk indicator and size variants',
  controls: [
    {
      name: 'consumer.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'consumer.required',
      kind: 'boolean',
      defaultValue: false,
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
      name: 'playground.text',
      kind: 'text',
      defaultValue: 'Label',
    },
    {
      name: 'playground.required',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'consumer.size': 'md',
    'consumer.required': false,
    'consumer.disabled': false,
    'playground.size': 'md',
    'playground.text': 'Label',
    'playground.required': false,
    'playground.disabled': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// basic label
<Label htmlFor="name">Full name</Label>

// required label
<Label htmlFor="email" required>Email address</Label>

// disabled label
<Label disabled>Disabled field</Label>`,
      render: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Label
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
            required={props['consumer.required'] as boolean}
          >
            Full name
          </Label>
          <Label
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
            required
          >
            Email address
          </Label>
          <Label
            size={props['consumer.size'] as string}
            disabled
          >
            Disabled field
          </Label>
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const size = String(props['playground.size'] ?? 'md');
        const text = String(props['playground.text'] ?? 'Label');
        const required = Boolean(props['playground.required']);
        const disabled = Boolean(props['playground.disabled']);

        const extraProps = [
          required && '  required',
          disabled && '  disabled',
        ].filter(Boolean).join('\n');

        return `<Label size="${size}"${extraProps ? '\n' + extraProps : ''}>
  ${text}
</Label>`;
      },
      render: (props) => (
        <Label
          size={props['playground.size'] as string}
          required={props['playground.required'] as boolean}
          disabled={props['playground.disabled'] as boolean}
        >
          {String(props['playground.text'] ?? 'Label')}
        </Label>
      ),
    },
  ],
  render: (props) => (
    <Label
      size={props['playground.size'] as string}
      required={props['playground.required'] as boolean}
      disabled={props['playground.disabled'] as boolean}
    >
      {String(props['playground.text'] ?? 'Label')}
    </Label>
  ),
};
