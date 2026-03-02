// Generated from InputRange.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { InputRange } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:InputRange',
  name: 'InputRange',
  category: 'form',
  description: 'Slider/range input built on Radix Slider with single or dual thumb, optional value display, and thumb interaction animation',
  controls: [
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
      name: 'playground.invalid',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.showValue',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'playground.size': 'md',
    'playground.disabled': false,
    'playground.invalid': false,
    'playground.showValue': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<InputRange defaultValue={40} />

<InputRange defaultValue={[20, 80]} showValue />

<InputRange defaultValue={50} size="lg" showValue formatValue={(v) => \`\${v}%\`} />`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 }}>
          <InputRange defaultValue={40} />
          <InputRange defaultValue={[20, 80]} showValue />
          <InputRange defaultValue={50} size="lg" showValue formatValue={(v: number) => `${v}%`} />
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const size = String(props['playground.size'] ?? 'md');
        const showValue = Boolean(props['playground.showValue']);
        return `<InputRange defaultValue={50} size="${size}"${showValue ? ' showValue' : ''} />`;
      },
      render: (props) => (
        <div style={{ maxWidth: 320 }}>
          <InputRange
            defaultValue={50}
            size={props['playground.size'] as string}
            disabled={props['playground.disabled'] as boolean}
            invalid={props['playground.invalid'] as boolean}
            showValue={props['playground.showValue'] as boolean}
          />
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ maxWidth: 320 }}>
      <InputRange
        defaultValue={50}
        size={props['playground.size'] as string}
        disabled={props['playground.disabled'] as boolean}
        invalid={props['playground.invalid'] as boolean}
        showValue={props['playground.showValue'] as boolean}
      />
    </div>
  ),
};
