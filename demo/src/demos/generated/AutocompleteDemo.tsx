// Generated from Autocomplete.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Autocomplete } from 'move';
import type { DemoDefinition } from '../types';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
  { value: 'strawberry', label: 'Strawberry' },
];

export const demo: DemoDefinition = {
  id: 'form:Autocomplete',
  name: 'Autocomplete',
  category: 'form',
  description: 'Searchable dropdown with single/multi-value support, tag management, keyboard navigation, and filtered option list',
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
    {
      name: 'playground.multiple',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'playground.variant': 'outlined',
    'playground.size': 'md',
    'playground.disabled': false,
    'playground.invalid': false,
    'playground.multiple': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<Autocomplete.Root>
  <Autocomplete.Trigger>
    <Autocomplete.TagList />
    <Autocomplete.Input placeholder="Search fruits..." />
    <Autocomplete.ClearTrigger />
    <Autocomplete.Icon />
  </Autocomplete.Trigger>
  <Autocomplete.Portal>
    <Autocomplete.Content>
      <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
      <Autocomplete.Item value="banana">Banana</Autocomplete.Item>
      <Autocomplete.Item value="cherry">Cherry</Autocomplete.Item>
    </Autocomplete.Content>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
      render: () => (
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.TagList />
            <Autocomplete.Input placeholder="Search fruits..." />
            <Autocomplete.ClearTrigger />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              {fruits.map((f) => (
                <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
              ))}
              <Autocomplete.Empty>No results found</Autocomplete.Empty>
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      ),
    },
    {
      id: 'multi',
      label: 'Multi-Select',
      code: `<Autocomplete.Root multiple>
  <Autocomplete.Trigger>
    <Autocomplete.TagList />
    <Autocomplete.Input placeholder="Select fruits..." />
    <Autocomplete.ClearTrigger />
    <Autocomplete.Icon />
  </Autocomplete.Trigger>
  <Autocomplete.Portal>
    <Autocomplete.Content>
      <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
      <Autocomplete.Item value="banana">Banana</Autocomplete.Item>
    </Autocomplete.Content>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
      render: () => (
        <Autocomplete.Root multiple>
          <Autocomplete.Trigger>
            <Autocomplete.TagList />
            <Autocomplete.Input placeholder="Select fruits..." />
            <Autocomplete.ClearTrigger />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              {fruits.map((f) => (
                <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
              ))}
              <Autocomplete.Empty>No results found</Autocomplete.Empty>
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const variant = String(props['playground.variant'] ?? 'outlined');
        const size = String(props['playground.size'] ?? 'md');
        const multiple = props['playground.multiple'] ? ' multiple' : '';
        return `<Autocomplete.Root${multiple}>\n  <Autocomplete.Trigger variant="${variant}" size="${size}">\n    <Autocomplete.TagList />\n    <Autocomplete.Input placeholder="Search..." />\n    <Autocomplete.ClearTrigger />\n    <Autocomplete.Icon />\n  </Autocomplete.Trigger>\n  ...\n</Autocomplete.Root>`;
      },
      render: (props) => (
        <Autocomplete.Root multiple={props['playground.multiple'] as boolean}>
          <Autocomplete.Trigger
            variant={props['playground.variant'] as string}
            size={props['playground.size'] as string}
            disabled={props['playground.disabled'] as boolean}
            invalid={props['playground.invalid'] as boolean}
          >
            <Autocomplete.TagList />
            <Autocomplete.Input placeholder="Search..." />
            <Autocomplete.ClearTrigger />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              {fruits.map((f) => (
                <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
              ))}
              <Autocomplete.Empty>No results found</Autocomplete.Empty>
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      ),
    },
  ],
  render: (props) => (
    <Autocomplete.Root multiple={props['playground.multiple'] as boolean}>
      <Autocomplete.Trigger
        variant={props['playground.variant'] as string}
        size={props['playground.size'] as string}
        disabled={props['playground.disabled'] as boolean}
        invalid={props['playground.invalid'] as boolean}
      >
        <Autocomplete.TagList />
        <Autocomplete.Input placeholder="Search..." />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Portal>
        <Autocomplete.Content>
          {fruits.map((f) => (
            <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
          ))}
          <Autocomplete.Empty>No results found</Autocomplete.Empty>
        </Autocomplete.Content>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
};
