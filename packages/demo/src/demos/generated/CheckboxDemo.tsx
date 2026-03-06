// Generated from Checkbox.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Checkbox } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:Checkbox',
  name: 'Checkbox',
  category: 'form',
  description: 'Toggle checkbox with checked/indeterminate states, animated indicator, optional icon, and form submission via hidden input',
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
      defaultValue: 'Accept terms and conditions',
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
      name: 'playground.indeterminate',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'consumer.size': 'md',
    'consumer.disabled': false,
    'playground.size': 'md',
    'playground.label': 'Accept terms and conditions',
    'playground.disabled': false,
    'playground.invalid': false,
    'playground.indeterminate': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// basic checkbox
<Checkbox>Remember me</Checkbox>

// checkbox group
<Checkbox.Group>
  <Checkbox>Option A</Checkbox>
  <Checkbox>Option B</Checkbox>
  <Checkbox>Option C</Checkbox>
</Checkbox.Group>`,
      render: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkbox
            size={props['consumer.size'] as string}
            disabled={props['consumer.disabled'] as boolean}
          >
            Remember me
          </Checkbox>
          <Checkbox.Group>
            <Checkbox
              size={props['consumer.size'] as string}
              disabled={props['consumer.disabled'] as boolean}
            >
              Option A
            </Checkbox>
            <Checkbox
              size={props['consumer.size'] as string}
              disabled={props['consumer.disabled'] as boolean}
            >
              Option B
            </Checkbox>
            <Checkbox
              size={props['consumer.size'] as string}
              disabled={props['consumer.disabled'] as boolean}
            >
              Option C
            </Checkbox>
          </Checkbox.Group>
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
        const indeterminate = Boolean(props['playground.indeterminate']);

        const extraProps = [
          disabled && '  disabled',
          invalid && '  invalid',
          indeterminate && '  indeterminate',
        ].filter(Boolean).join('\n');

        return `<Checkbox size="${size}"${extraProps ? '\n' + extraProps : ''}>\n  ${label}\n</Checkbox>`;
      },
      render: (props) => (
        <Checkbox
          size={props['playground.size'] as string}
          disabled={props['playground.disabled'] as boolean}
          invalid={props['playground.invalid'] as boolean}
          indeterminate={props['playground.indeterminate'] as boolean}
        >
          {props['playground.label'] as string || undefined}
        </Checkbox>
      ),
    },
  ],
  render: (props) => (
    <Checkbox
      size={props['playground.size'] as string}
      disabled={props['playground.disabled'] as boolean}
      invalid={props['playground.invalid'] as boolean}
      indeterminate={props['playground.indeterminate'] as boolean}
    >
      {props['playground.label'] as string || undefined}
    </Checkbox>
  ),
};
