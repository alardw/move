// Generated from ToggleButton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { useState } from 'react';
import { ToggleButton } from 'move';
import type { DemoDefinition } from '../types';

// Module-scope component for controlled toggle demo (Rule 12: hooks not allowed in render fns)
function ControlledToggleDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <ToggleButton
      pressed={pressed}
      onPressedChange={setPressed}
      variant="secondary"
      size="md"
    >
      {pressed ? 'On' : 'Off'}
    </ToggleButton>
  );
}

export const demo: DemoDefinition = {
  id: 'toolbar:ToggleButton',
  name: 'ToggleButton',
  category: 'toolbar',
  description:
    'Toggle button that switches between pressed and unpressed states, composing Button base styles with Radix Toggle primitive',
  controls: [
    {
      name: 'consumer.variant',
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
      defaultValue: 'secondary',
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
      defaultValue: 'Bold',
    },
    {
      name: 'playground.defaultPressed',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'consumer.variant': 'secondary',
    'consumer.size': 'md',
    'consumer.disabled': false,
    'playground.variant': 'secondary',
    'playground.size': 'md',
    'playground.disabled': false,
    'playground.text': 'Bold',
    'playground.defaultPressed': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// Uncontrolled toggle (uses defaultPressed)
<ToggleButton variant="secondary" size="md">
  Bold
</ToggleButton>

// Controlled toggle
const [pressed, setPressed] = useState(false);
<ToggleButton pressed={pressed} onPressedChange={setPressed}>
  {pressed ? 'On' : 'Off'}
</ToggleButton>

// Variants
<ToggleButton variant="primary">Primary</ToggleButton>
<ToggleButton variant="ghost">Ghost</ToggleButton>
<ToggleButton variant="danger">Danger</ToggleButton>`,
      render: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <ToggleButton
              variant={props['consumer.variant'] as string}
              size={props['consumer.size'] as string}
              disabled={props['consumer.disabled'] as boolean}
            >
              Bold
            </ToggleButton>
            <ToggleButton
              variant={props['consumer.variant'] as string}
              size={props['consumer.size'] as string}
              disabled={props['consumer.disabled'] as boolean}
            >
              Italic
            </ToggleButton>
            <ToggleButton
              variant={props['consumer.variant'] as string}
              size={props['consumer.size'] as string}
              disabled={props['consumer.disabled'] as boolean}
            >
              Underline
            </ToggleButton>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <ControlledToggleDemo />
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <ToggleButton variant="primary" size={props['consumer.size'] as string}>
              Primary
            </ToggleButton>
            <ToggleButton variant="secondary" size={props['consumer.size'] as string}>
              Secondary
            </ToggleButton>
            <ToggleButton variant="ghost" size={props['consumer.size'] as string}>
              Ghost
            </ToggleButton>
            <ToggleButton variant="danger" size={props['consumer.size'] as string}>
              Danger
            </ToggleButton>
          </div>
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const variant = String(props['playground.variant'] ?? 'secondary');
        const size = String(props['playground.size'] ?? 'md');
        const disabled = Boolean(props['playground.disabled']);
        const text = String(props['playground.text'] ?? 'Bold');
        const defaultPressed = Boolean(props['playground.defaultPressed']);
        const parts: string[] = [];
        parts.push(`variant="${variant}"`);
        parts.push(`size="${size}"`);
        if (disabled) parts.push('disabled');
        if (defaultPressed) parts.push('defaultPressed');
        return `<ToggleButton ${parts.join(' ')}>
  ${text}
</ToggleButton>`;
      },
      render: (props) => (
        <ToggleButton
          variant={props['playground.variant'] as string}
          size={props['playground.size'] as string}
          disabled={props['playground.disabled'] as boolean}
          defaultPressed={props['playground.defaultPressed'] as boolean}
        >
          {String(props['playground.text'] ?? 'Bold')}
        </ToggleButton>
      ),
    },
  ],
  render: (props) => (
    <ToggleButton
      variant={props['playground.variant'] as string}
      size={props['playground.size'] as string}
      disabled={props['playground.disabled'] as boolean}
      defaultPressed={props['playground.defaultPressed'] as boolean}
    >
      {String(props['playground.text'] ?? 'Bold')}
    </ToggleButton>
  ),
};
