// Generated from DatePicker.spec.ts (schemaVersion: 6, specHash: 891de3de)
import { DatePicker } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:DatePicker',
  name: 'DatePicker',
  category: 'form',
  description: 'Date selection input with calendar popup, supporting single, range, and multiple modes with optional time picker',
  controls: [
    {
      name: 'consumer.mode',
      kind: 'select',
      options: ['single', 'range', 'multiple'],
      defaultValue: 'single',
    },
    {
      name: 'consumer.closeOnSelect',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'consumer.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.mode',
      kind: 'select',
      options: ['single', 'range', 'multiple'],
      defaultValue: 'single',
    },
    {
      name: 'playground.closeOnSelect',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'playground.showTime',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'playground.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
  ],
  initialProps: {
    'consumer.mode': 'single',
    'consumer.closeOnSelect': true,
    'consumer.size': 'md',
    'playground.mode': 'single',
    'playground.closeOnSelect': true,
    'playground.showTime': false,
    'playground.size': 'md',
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// Single date
<DatePicker.Root mode="single">
  <DatePicker.Trigger>
    <DatePicker.Input />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      {/* Calendar goes here */}
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>

// Date range
<DatePicker.Root mode="range">
  <DatePicker.Trigger>
    <DatePicker.Input />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      {/* Calendar goes here */}
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>`,
      render: (props) => (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <DatePicker.Root
            mode={props['consumer.mode'] as string}
            closeOnSelect={props['consumer.closeOnSelect'] as boolean}
          >
            <DatePicker.Trigger>
              <DatePicker.Input size={props['consumer.size'] as string} />
            </DatePicker.Trigger>
            <DatePicker.Portal>
              <DatePicker.Content />
            </DatePicker.Portal>
          </DatePicker.Root>
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const mode = String(props['playground.mode'] ?? 'single');
        const closeOnSelect = Boolean(props['playground.closeOnSelect'] ?? true);
        const showTime = Boolean(props['playground.showTime']);
        const size = String(props['playground.size'] ?? 'md');

        return `<DatePicker.Root mode="${mode}" closeOnSelect={${closeOnSelect}}${showTime ? ' showTime' : ''}>
  <DatePicker.Trigger>
    <DatePicker.Input size="${size}" />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content />
  </DatePicker.Portal>
</DatePicker.Root>`;
      },
      render: (props) => (
        <DatePicker.Root
          mode={props['playground.mode'] as string}
          closeOnSelect={props['playground.closeOnSelect'] as boolean}
          showTime={props['playground.showTime'] as boolean || undefined}
        >
          <DatePicker.Trigger>
            <DatePicker.Input size={props['playground.size'] as string} />
          </DatePicker.Trigger>
          <DatePicker.Portal>
            <DatePicker.Content />
          </DatePicker.Portal>
        </DatePicker.Root>
      ),
    },
  ],
  render: (props) => (
    <DatePicker.Root
      mode={props['playground.mode'] as string}
      closeOnSelect={props['playground.closeOnSelect'] as boolean}
    >
      <DatePicker.Trigger>
        <DatePicker.Input size={props['playground.size'] as string} />
      </DatePicker.Trigger>
      <DatePicker.Portal>
        <DatePicker.Content />
      </DatePicker.Portal>
    </DatePicker.Root>
  ),
};
