// Generated from Heading.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Heading } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Heading',
  name: 'Heading',
  category: 'core',
  description: 'Semantic heading element (h1-h6) with size, weight, color, tracking, alignment, and truncation control',
  controls: [
    {
      name: 'level',
      kind: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
      defaultValue: '2',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    {
      name: 'weight',
      kind: 'select',
      options: ['medium', 'semibold', 'bold'],
      defaultValue: 'bold',
    },
    {
      name: 'color',
      kind: 'select',
      options: ['base', 'muted', 'subtle'],
      defaultValue: 'base',
    },
    {
      name: 'tracking',
      kind: 'select',
      options: ['tight', 'normal'],
      defaultValue: 'tight',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['left', 'center', 'right'],
    },
    {
      name: 'truncate',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: 'Heading',
    },
  ],
  initialProps: {
    level: '2',
    weight: 'bold',
    color: 'base',
    tracking: 'tight',
    truncate: false,
    children: 'Heading',
  },
  render: (props) => (
    <Heading
      level={props.level ? Number(props.level) as 1 | 2 | 3 | 4 | 5 | 6 : undefined}
      size={props.size as string | undefined}
      weight={props.weight as string}
      color={props.color as string}
      tracking={props.tracking as string}
      align={props.align as string | undefined}
      truncate={props.truncate as boolean}
    >
      {props.children as string}
    </Heading>
  ),
};
