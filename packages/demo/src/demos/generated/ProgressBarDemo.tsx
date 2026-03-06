// Generated from ProgressBar.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { ProgressBar } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'loading:ProgressBar',
  name: 'ProgressBar',
  category: 'loading',
  description: 'Determinate or indeterminate progress indicator built on Radix Progress',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'success', 'warning', 'error'],
      defaultValue: 'default',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'value',
      kind: 'number',
      defaultValue: 60,
    },
    {
      name: 'max',
      kind: 'number',
      defaultValue: 100,
    },
  ],
  initialProps: {
    variant: 'default',
    size: 'md',
    value: 60,
    max: 100,
  },
  render: (props) => (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <ProgressBar
        variant={props.variant as string}
        size={props.size as string}
        value={props.value as number}
        max={props.max as number}
      />
    </div>
  ),
};
