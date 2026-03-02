// Generated from Stack.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Stack } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Stack',
  name: 'Stack',
  category: 'core',
  description: 'Flex layout container for vertical or horizontal stacking with configurable gap, alignment, and responsive collapse',
  controls: [
    {
      name: 'direction',
      kind: 'select',
      options: ['row', 'column'],
      defaultValue: 'column',
    },
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
      defaultValue: 'stretch',
    },
    {
      name: 'justify',
      kind: 'select',
      options: ['start', 'center', 'end', 'between', 'evenly'],
      defaultValue: 'start',
    },
    {
      name: 'wrap',
      kind: 'toggle',
      defaultValue: false,
    },
  ],
  initialProps: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  render: (props) => (
    <Stack
      direction={props.direction as string}
      gap={props.gap as string}
      align={props.align as string}
      justify={props.justify as string}
      wrap={props.wrap as boolean}
    >
      <div style={{ padding: '12px', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)' }}>Item 1</div>
      <div style={{ padding: '12px', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)' }}>Item 2</div>
      <div style={{ padding: '12px', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)' }}>Item 3</div>
    </Stack>
  ),
};
