// Generated from List.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)
import { List, Avatar, Badge } from 'move';
import type { DemoDefinition } from '../types';

const people = [
  { name: 'Leslie Alexander', email: 'leslie.alexander@example.com', initials: 'LA', color: 'violet' },
  { name: 'Michael Foster', email: 'michael.foster@example.com', initials: 'MF', color: 'indigo' },
  { name: 'Dries Vincent', email: 'dries.vincent@example.com', initials: 'DV', color: 'teal' },
  { name: 'Lindsay Walton', email: 'lindsay.walton@example.com', initials: 'LW', color: 'orange' },
  { name: 'Tom Cook', email: 'tom.cook@example.com', initials: 'TC', color: 'blue' },
];

export const demo: DemoDefinition = {
  id: 'data:List',
  name: 'List',
  category: 'data',
  description: 'Stacked list with three-zone item layout, responsive collapse, line clamping, and explicit sub-components',
  controls: [
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'density',
      kind: 'select',
      options: ['compact', 'default', 'comfortable'],
      defaultValue: 'default',
    },
    {
      name: 'dividers',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'hover',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'separator',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'interactive',
      kind: 'boolean',
      defaultValue: true,
    },
  ],
  initialProps: {
    size: 'md',
    density: 'default',
    dividers: true,
    hover: true,
    separator: true,
    interactive: true,
  },
  render: (props) => (
    <List
      size={props.size as string}
      density={props.density as string}
      dividers={props.dividers as boolean}
      hover={props.hover as boolean}
      separator={props.separator as boolean}
    >
      {people.map((person, i) => (
        <List.Item
          key={person.email}
          href={props.interactive ? '#' : undefined}
          active={i === 2}
        >
          <List.Leading>
            <Avatar.Root size="sm" color={person.color as string}><Avatar.Fallback>{person.initials}</Avatar.Fallback></Avatar.Root>
          </List.Leading>
          <List.Content>
            <List.Title>{person.name}</List.Title>
            <List.Description>{person.email}</List.Description>
          </List.Content>
          <List.Trailing>
            <Badge
              variant="soft"
              color={i === 2 ? 'indigo' : 'green'}
              size="sm"
            >
              {i === 2 ? 'Selected' : 'Active'}
            </Badge>
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  ),
};
