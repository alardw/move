// Generated from Link.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Link } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Link',
  name: 'Link',
  category: 'core',
  description: 'Inline anchor element with variant colors, underline modes, optional size, and external link support',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'muted', 'subtle'],
      defaultValue: 'default',
    },
    {
      name: 'underline',
      kind: 'select',
      options: ['always', 'hover', 'none'],
      defaultValue: 'hover',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
    {
      name: 'external',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: 'Link',
    },
  ],
  initialProps: {
    variant: 'default',
    underline: 'hover',
    external: false,
    children: 'Link',
  },
  render: (props) => (
    <Link
      href="#"
      variant={props.variant as string}
      underline={props.underline as string}
      size={props.size as string | undefined}
      external={props.external as boolean}
    >
      {props.children as string}
    </Link>
  ),
};
