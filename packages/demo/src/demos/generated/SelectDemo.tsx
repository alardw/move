// Generated from Select.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Select } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:Select',
  name: 'Select',
  category: 'form',
  description: 'Dropdown select input built on DropdownMenu primitives with value semantics, animated popup, and item stagger',
  controls: [
    {
      name: 'playground.variant',
      kind: 'select',
      options: ['outlined', 'filled'],
      defaultValue: 'outlined',
    },
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
  ],
  initialProps: {
    'playground.variant': 'outlined',
    'playground.size': 'md',
    'playground.disabled': false,
    'playground.invalid': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
      <Select.Item value="cherry">Cherry</Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select.Root>`,
      render: () => (
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick a fruit" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="banana">Banana</Select.Item>
              <Select.Item value="cherry">Cherry</Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const variant = String(props['playground.variant'] ?? 'outlined');
        const size = String(props['playground.size'] ?? 'md');
        return `<Select.Root>\n  <Select.Trigger variant="${variant}" size="${size}">\n    <Select.Value placeholder="Select..." />\n    <Select.Icon />\n  </Select.Trigger>\n  ...\n</Select.Root>`;
      },
      render: (props) => (
        <Select.Root>
          <Select.Trigger
            variant={props['playground.variant'] as string}
            size={props['playground.size'] as string}
            disabled={props['playground.disabled'] as boolean}
            invalid={props['playground.invalid'] as boolean}
          >
            <Select.Value placeholder="Select..." />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="opt1">Option 1</Select.Item>
              <Select.Item value="opt2">Option 2</Select.Item>
              <Select.Item value="opt3">Option 3</Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      ),
    },
  ],
  render: (props) => (
    <Select.Root>
      <Select.Trigger
        variant={props['playground.variant'] as string}
        size={props['playground.size'] as string}
        disabled={props['playground.disabled'] as boolean}
        invalid={props['playground.invalid'] as boolean}
      >
        <Select.Value placeholder="Select..." />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          <Select.Item value="opt1">Option 1</Select.Item>
          <Select.Item value="opt2">Option 2</Select.Item>
          <Select.Item value="opt3">Option 3</Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  ),
};
