// Generated from Align.spec.ts (schemaVersion: 6, specHash: 6cbf8097)
import { Align } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Align',
  name: 'Align',
  category: 'core',
  description: 'Horizontal bar with start/center/end distribution using CSS grid',
  controls: [
    {
      name: 'gap',
      kind: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      defaultValue: 'center',
    },
  ],
  initialProps: {
    gap: 'md',
    align: 'center',
  },
  render: (props) => (
    <Align gap={props.gap as string} align={props.align as string}>
      <Align.Start>Start</Align.Start>
      <Align.Center>Center</Align.Center>
      <Align.End>End</Align.End>
    </Align>
  ),
};
