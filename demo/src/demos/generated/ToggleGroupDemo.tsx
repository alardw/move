// Generated from ToggleGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { useState } from 'react';
import { ToggleGroup } from 'move';
import type { DemoDefinition } from '../types';

// ---------------------------------------------------------------------------
// Module-scope wrapper components (Rule 12: hooks must NOT live in render fns)
// ---------------------------------------------------------------------------

/** Controlled consumer sample — alignment toggle */
function AlignmentToggle() {
  const [value, setValue] = useState('center');
  return (
    <ToggleGroup.Root value={value} onValueChange={setValue} size="md">
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

/** Controlled consumer sample — view mode toggle */
function ViewModeToggle() {
  const [value, setValue] = useState('grid');
  return (
    <ToggleGroup.Root value={value} onValueChange={setValue} size="sm" variant="ghost">
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

// ---------------------------------------------------------------------------
// Demo definition
// ---------------------------------------------------------------------------

export const demo: DemoDefinition = {
  id: 'toolbar:ToggleGroup',
  name: 'ToggleGroup',
  category: 'toolbar',
  description:
    'Segmented control with sliding indicator that allows single selection among a set of toggle items',
  controls: [
    {
      name: 'playground.size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'playground.variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      defaultValue: 'secondary',
    },
    {
      name: 'playground.orientation',
      kind: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      name: 'playground.disabled',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'playground.size': 'md',
    'playground.variant': 'secondary',
    'playground.orientation': 'horizontal',
    'playground.disabled': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// Alignment toggle
<ToggleGroup.Root defaultValue="center" size="md">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>

// View mode toggle (ghost variant, small)
<ToggleGroup.Root defaultValue="grid" size="sm" variant="ghost">
  <ToggleGroup.Item value="list">List</ToggleGroup.Item>
  <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
  <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
</ToggleGroup.Root>`,
      render: () => (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <AlignmentToggle />
          <ViewModeToggle />
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const size = String(props['playground.size'] ?? 'md');
        const variant = String(props['playground.variant'] ?? 'secondary');
        const orientation = String(props['playground.orientation'] ?? 'horizontal');
        const disabled = Boolean(props['playground.disabled']);
        return `<ToggleGroup.Root defaultValue="option1" size="${size}" variant="${variant}" orientation="${orientation}"${disabled ? ' disabled' : ''}>
  <ToggleGroup.Item value="option1">Option 1</ToggleGroup.Item>
  <ToggleGroup.Item value="option2">Option 2</ToggleGroup.Item>
  <ToggleGroup.Item value="option3">Option 3</ToggleGroup.Item>
</ToggleGroup.Root>`;
      },
      render: (props) => (
        <ToggleGroup.Root
          defaultValue="option1"
          size={props['playground.size'] as string}
          variant={props['playground.variant'] as string}
          orientation={props['playground.orientation'] as 'horizontal' | 'vertical'}
          disabled={props['playground.disabled'] as boolean}
        >
          <ToggleGroup.Item value="option1">Option 1</ToggleGroup.Item>
          <ToggleGroup.Item value="option2">Option 2</ToggleGroup.Item>
          <ToggleGroup.Item value="option3">Option 3</ToggleGroup.Item>
        </ToggleGroup.Root>
      ),
    },
  ],
  render: (props) => (
    <ToggleGroup.Root
      defaultValue="option1"
      size={props['playground.size'] as string}
      variant={props['playground.variant'] as string}
      orientation={props['playground.orientation'] as 'horizontal' | 'vertical'}
      disabled={props['playground.disabled'] as boolean}
    >
      <ToggleGroup.Item value="option1">Option 1</ToggleGroup.Item>
      <ToggleGroup.Item value="option2">Option 2</ToggleGroup.Item>
      <ToggleGroup.Item value="option3">Option 3</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
