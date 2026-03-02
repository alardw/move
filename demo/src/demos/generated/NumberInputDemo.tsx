// Generated from NumberInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { NumberInput } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:NumberInput',
  name: 'NumberInput',
  category: 'form',
  description: 'Numeric input with increment/decrement stepper buttons, controlled/uncontrolled value, format/parse support, and hold-to-repeat',
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
      defaultValue: 'Enter number',
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
      name: 'playground.hideControls',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'playground.variant': 'outlined',
    'playground.size': 'md',
    'playground.placeholder': 'Enter number',
    'playground.disabled': false,
    'playground.invalid': false,
    'playground.hideControls': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<NumberInput placeholder="Quantity" min={0} max={100} />

<NumberInput defaultValue={50} min={0} max={100} step={5} />`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 200 }}>
          <NumberInput placeholder="Quantity" min={0} max={100} />
          <NumberInput defaultValue={50} min={0} max={100} step={5} />
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const variant = String(props['playground.variant'] ?? 'outlined');
        const size = String(props['playground.size'] ?? 'md');
        return `<NumberInput variant="${variant}" size="${size}" placeholder="Enter number" />`;
      },
      render: (props) => (
        <div style={{ maxWidth: 200 }}>
          <NumberInput
            variant={props['playground.variant'] as string}
            size={props['playground.size'] as string}
            placeholder={props['playground.placeholder'] as string}
            disabled={props['playground.disabled'] as boolean}
            invalid={props['playground.invalid'] as boolean}
            hideControls={props['playground.hideControls'] as boolean}
          />
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ maxWidth: 200 }}>
      <NumberInput
        variant={props['playground.variant'] as string}
        size={props['playground.size'] as string}
        placeholder={props['playground.placeholder'] as string}
        disabled={props['playground.disabled'] as boolean}
        invalid={props['playground.invalid'] as boolean}
        hideControls={props['playground.hideControls'] as boolean}
      />
    </div>
  ),
};
