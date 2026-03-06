// Generated from PinInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { PinInput } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:PinInput',
  name: 'PinInput',
  category: 'form',
  description: 'Multi-slot PIN/OTP code input with single hidden input, visual slot rendering, grouping, mask support, and caret animation',
  controls: [
    {
      name: 'playground.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.length',
      kind: 'number',
      defaultValue: 4,
    },
    {
      name: 'playground.mask',
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
    'playground.size': 'md',
    'playground.length': 4,
    'playground.mask': false,
    'playground.disabled': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<PinInput length={4} />

<PinInput length={6} grouping={[3, 3]} />

<PinInput length={4} mask />`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PinInput length={4} />
          <PinInput length={6} grouping={[3, 3]} />
          <PinInput length={4} mask />
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const size = String(props['playground.size'] ?? 'md');
        const length = Number(props['playground.length'] ?? 4);
        return `<PinInput length={${length}} size="${size}" />`;
      },
      render: (props) => (
        <PinInput
          length={Number(props['playground.length'] ?? 4)}
          size={props['playground.size'] as string}
          mask={props['playground.mask'] as boolean}
          disabled={props['playground.disabled'] as boolean}
        />
      ),
    },
  ],
  render: (props) => (
    <PinInput
      length={Number(props['playground.length'] ?? 4)}
      size={props['playground.size'] as string}
      mask={props['playground.mask'] as boolean}
      disabled={props['playground.disabled'] as boolean}
    />
  ),
};
