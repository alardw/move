// Generated from Accordion.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { Accordion } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'panel:Accordion',
  name: 'Accordion',
  category: 'panel',
  description: 'Vertically stacked disclosure panels with single or multiple expand mode, keyboard navigation, and animated content reveal.',
  controls: [
    { name: 'variant', kind: 'select', options: ['default', 'contained', 'ghost'], defaultValue: 'default' },
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { name: 'type', kind: 'select', options: ['single', 'multiple'], defaultValue: 'single' },
    { name: 'collapsible', kind: 'boolean', defaultValue: true },
  ],
  initialProps: {
    variant: 'default',
    size: 'md',
    type: 'single',
    collapsible: true,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>What is Move?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p>Move is an animated UI component library for React.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>How does theming work?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p>Move uses CSS custom properties and a ThemeProvider for theming.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Header>
              <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p>Yes, all components follow WAI-ARIA patterns with full keyboard support.</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ),
      code: `<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>What is Move?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <p>Move is an animated UI component library for React.</p>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>How does theming work?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <p>Move uses CSS custom properties and a ThemeProvider for theming.</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <Accordion.Root
          variant={props.variant as 'default' | 'contained' | 'ghost'}
          size={props.size as 'sm' | 'md' | 'lg'}
          type={props.type as 'single' | 'multiple'}
          collapsible={props.collapsible as boolean}
        >
          <Accordion.Item value="a">
            <Accordion.Header>
              <Accordion.Trigger>First item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p>Content for the first item.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="b">
            <Accordion.Header>
              <Accordion.Trigger>Second item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p>Content for the second item.</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="c">
            <Accordion.Header>
              <Accordion.Trigger>Third item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <p>Content for the third item.</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ),
      code: (props) => `<Accordion.Root variant="${props.variant}" size="${props.size}" type="${props.type}" collapsible={${props.collapsible}}>
  <Accordion.Item value="a">
    <Accordion.Header>
      <Accordion.Trigger>First item</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <p>Content for the first item.</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
    },
  ],
  render: (props) => (
    <Accordion.Root
      variant={props.variant as 'default' | 'contained' | 'ghost'}
      size={props.size as 'sm' | 'md' | 'lg'}
      type={props.type as 'single' | 'multiple'}
      collapsible={props.collapsible as boolean}
    >
      <Accordion.Item value="a">
        <Accordion.Header>
          <Accordion.Trigger>First item</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <p>Content for the first item.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Header>
          <Accordion.Trigger>Second item</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <p>Content for the second item.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
