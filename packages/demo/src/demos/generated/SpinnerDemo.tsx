// Generated from Spinner.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Spinner } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'loading:Spinner',
  name: 'Spinner',
  category: 'loading',
  description: 'SVG-based spinning loading indicator with CSS keyframe animations for rotation and stroke dash',
  controls: [
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'secondary', 'current'],
      defaultValue: 'default',
    },
    {
      name: 'strokeWidth',
      kind: 'select',
      options: ['2', '3', '4', '5'],
      defaultValue: '3',
    },
  ],
  initialProps: {
    size: 'md',
    variant: 'default',
    strokeWidth: '3',
  },
  render: (props) => (
    <Spinner
      size={props.size as string}
      variant={props.variant as string}
      strokeWidth={Number(props.strokeWidth)}
    />
  ),
};
