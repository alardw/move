// Generated from Collapsible.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { Collapsible } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'panel:Collapsible',
  name: 'Collapsible',
  category: 'panel',
  description: 'Single disclosure panel with open/close toggle, animated content reveal, optional asChild trigger, and auto-rotating icon.',
  controls: [
    { name: 'disabled', kind: 'boolean', defaultValue: false },
  ],
  initialProps: {
    disabled: false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <Collapsible.Root>
          <Collapsible.Trigger>
            Toggle content
            <Collapsible.Icon />
          </Collapsible.Trigger>
          <Collapsible.Content>
            <p>This content can be shown or hidden by clicking the trigger above.</p>
          </Collapsible.Content>
        </Collapsible.Root>
      ),
      code: `<Collapsible.Root>
  <Collapsible.Trigger>
    Toggle content
    <Collapsible.Icon />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <p>This content can be shown or hidden.</p>
  </Collapsible.Content>
</Collapsible.Root>`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <Collapsible.Root disabled={props.disabled as boolean}>
          <Collapsible.Trigger>
            Click to expand
            <Collapsible.Icon />
          </Collapsible.Trigger>
          <Collapsible.Content>
            <p>Expandable content with animated height and opacity transitions.</p>
          </Collapsible.Content>
        </Collapsible.Root>
      ),
      code: (props) => `<Collapsible.Root disabled={${props.disabled}}>
  <Collapsible.Trigger>
    Click to expand
    <Collapsible.Icon />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <p>Expandable content.</p>
  </Collapsible.Content>
</Collapsible.Root>`,
    },
  ],
  render: (props) => (
    <Collapsible.Root disabled={props.disabled as boolean}>
      <Collapsible.Trigger>
        Click to expand
        <Collapsible.Icon />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p>Expandable content with animated height and opacity transitions.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  ),
};
