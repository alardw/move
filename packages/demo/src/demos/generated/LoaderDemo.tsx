// Generated from Loader.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Loader } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'loading:Loader',
  name: 'Loader',
  category: 'loading',
  description: 'Animated loading indicator with spinner and dots variants',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['spinner', 'dots'],
      defaultValue: 'spinner',
    },
    {
      name: 'color',
      kind: 'select',
      options: ['primary', 'secondary', 'current'],
      defaultValue: 'primary',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'strokeWidth',
      kind: 'number',
      defaultValue: 3,
    },
  ],
  initialProps: {
    variant: 'spinner',
    color: 'primary',
    size: 'md',
    strokeWidth: 3,
  },
  render: (props) => (
    <Loader
      variant={props.variant as string}
      color={props.color as string}
      size={props.size as string}
      strokeWidth={props.strokeWidth as number}
    />
  ),
};
