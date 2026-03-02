// Generated from Tabs.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { Tabs } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'panel:Tabs',
  name: 'Tabs',
  category: 'panel',
  description: 'Tabbed interface with underline/pills/outline variants, sliding indicator animation, and Radix Tabs primitive.',
  controls: [
    { name: 'variant', kind: 'select', options: ['underline', 'pills', 'outline'], defaultValue: 'underline' },
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  ],
  initialProps: {
    variant: 'underline',
    size: 'md',
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <Tabs.Root defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <p>Manage your account settings and preferences.</p>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <p>Configure your application settings.</p>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <p>Control your notification preferences.</p>
          </Tabs.Content>
        </Tabs.Root>
      ),
      code: `<Tabs.Root defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Account content</Tabs.Content>
  <Tabs.Content value="tab2">Settings content</Tabs.Content>
</Tabs.Root>`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <Tabs.Root defaultValue="first">
          <Tabs.List
            variant={props.variant as 'underline' | 'pills' | 'outline'}
            size={props.size as 'sm' | 'md' | 'lg'}
          >
            <Tabs.Trigger value="first">First</Tabs.Trigger>
            <Tabs.Trigger value="second">Second</Tabs.Trigger>
            <Tabs.Trigger value="third">Third</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="first">
            <p>First tab content.</p>
          </Tabs.Content>
          <Tabs.Content value="second">
            <p>Second tab content.</p>
          </Tabs.Content>
          <Tabs.Content value="third">
            <p>Third tab content.</p>
          </Tabs.Content>
        </Tabs.Root>
      ),
      code: (props) => `<Tabs.Root defaultValue="first">
  <Tabs.List variant="${props.variant}" size="${props.size}">
    <Tabs.Trigger value="first">First</Tabs.Trigger>
    <Tabs.Trigger value="second">Second</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="first">First content</Tabs.Content>
  <Tabs.Content value="second">Second content</Tabs.Content>
</Tabs.Root>`,
    },
  ],
  render: (props) => (
    <Tabs.Root defaultValue="first">
      <Tabs.List
        variant={props.variant as 'underline' | 'pills' | 'outline'}
        size={props.size as 'sm' | 'md' | 'lg'}
      >
        <Tabs.Trigger value="first">First</Tabs.Trigger>
        <Tabs.Trigger value="second">Second</Tabs.Trigger>
        <Tabs.Trigger value="third">Third</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="first">
        <p>First tab content.</p>
      </Tabs.Content>
      <Tabs.Content value="second">
        <p>Second tab content.</p>
      </Tabs.Content>
      <Tabs.Content value="third">
        <p>Third tab content.</p>
      </Tabs.Content>
    </Tabs.Root>
  ),
};
