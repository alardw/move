// Generated from RadioGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { RadioGroup } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:RadioGroup',
  name: 'RadioGroup',
  category: 'form',
  description: 'Radio button group built on Radix RadioGroup with toggle animation for checked/unchecked indicator state',
  controls: [
    {
      name: 'consumer.orientation',
      kind: 'select',
      options: ['vertical', 'horizontal'],
      defaultValue: 'vertical',
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
      name: 'playground.orientation',
      kind: 'select',
      options: ['vertical', 'horizontal'],
      defaultValue: 'vertical',
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
    'consumer.orientation': 'vertical',
    'consumer.disabled': false,
    'playground.size': 'md',
    'playground.orientation': 'vertical',
    'playground.disabled': false,
    'playground.invalid': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<RadioGroup.Root defaultValue="option-1">
  <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
  <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
</RadioGroup.Root>`,
      render: (props) => (
        <RadioGroup.Root
          defaultValue="option-1"
          orientation={props['consumer.orientation'] as string}
          disabled={props['consumer.disabled'] as boolean}
        >
          <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
          <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
          <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
        </RadioGroup.Root>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const size = String(props['playground.size'] ?? 'md');
        const orientation = String(props['playground.orientation'] ?? 'vertical');
        const disabled = Boolean(props['playground.disabled']);
        const invalid = Boolean(props['playground.invalid']);

        const extraProps = [
          disabled && '  disabled',
          invalid && '  invalid',
        ].filter(Boolean).join('\n');

        return `<RadioGroup.Root size="${size}" orientation="${orientation}"${extraProps ? '\n' + extraProps : ''} defaultValue="a">
  <RadioGroup.Item value="a">Alpha</RadioGroup.Item>
  <RadioGroup.Item value="b">Beta</RadioGroup.Item>
  <RadioGroup.Item value="c">Gamma</RadioGroup.Item>
</RadioGroup.Root>`;
      },
      render: (props) => (
        <RadioGroup.Root
          size={props['playground.size'] as string}
          orientation={props['playground.orientation'] as string}
          disabled={props['playground.disabled'] as boolean}
          invalid={props['playground.invalid'] as boolean}
          defaultValue="a"
        >
          <RadioGroup.Item value="a">Alpha</RadioGroup.Item>
          <RadioGroup.Item value="b">Beta</RadioGroup.Item>
          <RadioGroup.Item value="c">Gamma</RadioGroup.Item>
        </RadioGroup.Root>
      ),
    },
  ],
  render: (props) => (
    <RadioGroup.Root
      size={props['playground.size'] as string}
      orientation={props['playground.orientation'] as string}
      disabled={props['playground.disabled'] as boolean}
      invalid={props['playground.invalid'] as boolean}
      defaultValue="a"
    >
      <RadioGroup.Item value="a">Alpha</RadioGroup.Item>
      <RadioGroup.Item value="b">Beta</RadioGroup.Item>
      <RadioGroup.Item value="c">Gamma</RadioGroup.Item>
    </RadioGroup.Root>
  ),
};
