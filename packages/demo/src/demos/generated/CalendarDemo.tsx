// Generated from Calendar.spec.ts (schemaVersion: 6, specHash: 7dc1c820)
import React, { useState } from 'react';
import { Calendar } from 'move';
import type { DemoDefinition } from '../types';

// ============================================================================
// Module-scope wrapper components (hooks are legal here, not in render fns)
// ============================================================================

/** Controlled single-selection demo — shows selected date feedback. */
function SingleSelectionSample() {
  const [value, setValue] = useState<Date | undefined>(undefined);
  return (
    <div>
      <h3 style={{ margin: '0 0 8px' }}>Single Selection</h3>
      <Calendar.Root
        mode="single"
        value={value}
        onValueChange={(d) => setValue(d as Date)}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      {value && (
        <p style={{ marginTop: 8, fontSize: 14 }}>
          Selected: {value.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

/** Controlled range-selection demo — shows selected range feedback. */
function RangeSelectionSample() {
  const [value, setValue] = useState<{ from: Date; to: Date } | undefined>(
    undefined,
  );
  return (
    <div>
      <h3 style={{ margin: '0 0 8px' }}>Range Selection</h3>
      <Calendar.Root
        mode="range"
        value={value}
        onValueChange={(d) => setValue(d as { from: Date; to: Date })}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      {value?.from && value?.to && (
        <p style={{ marginTop: 8, fontSize: 14 }}>
          Range: {value.from.toLocaleDateString()} &ndash;{' '}
          {value.to.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

/** Controlled multi-selection demo — shows count of selected dates. */
function MultipleSelectionSample() {
  const [value, setValue] = useState<Date[]>([]);
  return (
    <div>
      <h3 style={{ margin: '0 0 8px' }}>Multiple Selection</h3>
      <Calendar.Root
        mode="multiple"
        value={value}
        onValueChange={(d) => setValue(d as Date[])}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      {value.length > 0 && (
        <p style={{ marginTop: 8, fontSize: 14 }}>
          {value.length} date{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Demo definition
// ============================================================================

export const demo: DemoDefinition = {
  id: 'calendar:Calendar',
  name: 'Calendar',
  category: 'calendar',
  description:
    'Date selection grid supporting single, range, and multiple selection modes with event display, keyboard navigation, and locale-aware formatting.',
  controls: [
    {
      name: 'consumer.mode',
      kind: 'select',
      options: ['single', 'range', 'multiple'],
      defaultValue: 'single',
    },
    {
      name: 'consumer.numberOfMonths',
      kind: 'select',
      options: ['1', '2', '3'],
      defaultValue: '1',
    },
    { name: 'consumer.showWeekNumbers', kind: 'boolean', defaultValue: false },
    {
      name: 'playground.mode',
      kind: 'select',
      options: ['single', 'range', 'multiple'],
      defaultValue: 'single',
    },
    {
      name: 'playground.numberOfMonths',
      kind: 'select',
      options: ['1', '2', '3'],
      defaultValue: '1',
    },
    {
      name: 'playground.showWeekNumbers',
      kind: 'boolean',
      defaultValue: false,
    },
    { name: 'playground.fixedWeeks', kind: 'boolean', defaultValue: false },
  ],
  initialProps: {
    'consumer.mode': 'single',
    'consumer.numberOfMonths': '1',
    'consumer.showWeekNumbers': false,
    'playground.mode': 'single',
    'playground.numberOfMonths': '1',
    'playground.showWeekNumbers': false,
    'playground.fixedWeeks': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      // NO hooks here — all stateful logic lives in the wrapper components above
      render: () => (
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <SingleSelectionSample />
          <RangeSelectionSample />
          <MultipleSelectionSample />
        </div>
      ),
      code: `// Single date selection (controlled)
<Calendar.Root mode="single" value={value} onValueChange={setValue}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>

// Range selection
<Calendar.Root mode="range" value={range} onValueChange={setRange}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>

// Multiple selection
<Calendar.Root mode="multiple" value={dates} onValueChange={setDates}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
    },
    {
      id: 'playground',
      label: 'Props Playground',
      // NO hooks — playground uses uncontrolled mode (defaultValue omitted = component internal state)
      render: (props) => (
        <Calendar.Root
          mode={props['playground.mode'] as 'single' | 'range' | 'multiple'}
          numberOfMonths={Number(props['playground.numberOfMonths']) || 1}
          showWeekNumbers={props['playground.showWeekNumbers'] as boolean}
        >
          <Calendar.Nav />
          <Calendar.Grid />
        </Calendar.Root>
      ),
      code: (props) => {
        const mode = String(props['playground.mode'] ?? 'single');
        const numberOfMonths = Number(props['playground.numberOfMonths']) || 1;
        const showWeekNumbers = Boolean(props['playground.showWeekNumbers']);

        return `<Calendar.Root
  mode="${mode}"
  numberOfMonths={${numberOfMonths}}${showWeekNumbers ? '\n  showWeekNumbers' : ''}
>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`;
      },
    },
  ],
  render: (props) => (
    <Calendar.Root
      mode={
        (props['playground.mode'] as 'single' | 'range' | 'multiple') ??
        'single'
      }
      numberOfMonths={Number(props['playground.numberOfMonths']) || 1}
      showWeekNumbers={props['playground.showWeekNumbers'] as boolean}
    >
      <Calendar.Nav />
      <Calendar.Grid />
    </Calendar.Root>
  ),
};
