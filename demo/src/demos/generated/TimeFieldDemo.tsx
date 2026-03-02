// Generated from TimeField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { TimeField } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:TimeField',
  name: 'TimeField',
  category: 'form',
  description: 'Time input with individual hour/minute/second segments, optional 12h/24h cycle, and dropdown column picker.',
  controls: [
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { name: 'granularity', kind: 'select', options: ['hour', 'minute', 'second'], defaultValue: 'minute' },
    { name: 'hourCycle', kind: 'select', options: ['12', '24'], defaultValue: '24' },
    { name: 'withDropdown', kind: 'boolean', defaultValue: false },
    { name: 'disabled', kind: 'boolean', defaultValue: false },
    { name: 'invalid', kind: 'boolean', defaultValue: false },
  ],
  initialProps: {
    size: 'md',
    granularity: 'minute',
    hourCycle: '24',
    withDropdown: false,
    disabled: false,
    invalid: false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <TimeField.Root granularity="minute" />
          <TimeField.Root granularity="minute" hourCycle={12} />
          <TimeField.Root granularity="second" />
        </div>
      ),
      code: `<TimeField.Root granularity="minute" />
<TimeField.Root granularity="minute" hourCycle={12} />
<TimeField.Root granularity="second" />`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <TimeField.Root
          size={props.size as 'sm' | 'md' | 'lg'}
          granularity={props.granularity as 'hour' | 'minute' | 'second'}
          hourCycle={Number(props.hourCycle) as 12 | 24}
          withDropdown={props.withDropdown as boolean}
          disabled={props.disabled as boolean}
          invalid={props.invalid as boolean}
        />
      ),
      code: (props) => `<TimeField.Root
  size="${props.size}"
  granularity="${props.granularity}"
  hourCycle={${props.hourCycle}}
  withDropdown={${props.withDropdown}}
  disabled={${props.disabled}}
  invalid={${props.invalid}}
/>`,
    },
  ],
  render: (props) => (
    <TimeField.Root
      size={props.size as 'sm' | 'md' | 'lg'}
      granularity={props.granularity as 'hour' | 'minute' | 'second'}
      hourCycle={Number(props.hourCycle) as 12 | 24}
      withDropdown={props.withDropdown as boolean}
      disabled={props.disabled as boolean}
      invalid={props.invalid as boolean}
    />
  ),
};
