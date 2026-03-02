// Generated from RichTextEditor.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { RichTextEditor } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:RichTextEditor',
  name: 'RichTextEditor',
  category: 'form',
  description: 'Editor-agnostic rich text editor chrome with toolbar, control groups, formatting controls, and content area.',
  controls: [
    { name: 'variant', kind: 'select', options: ['outline', 'subtle'], defaultValue: 'outline' },
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  ],
  initialProps: {
    variant: 'outline',
    size: 'md',
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control>B</RichTextEditor.Control>
              <RichTextEditor.Control>I</RichTextEditor.Control>
              <RichTextEditor.Control>U</RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
            <RichTextEditor.Separator />
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control>H1</RichTextEditor.Control>
              <RichTextEditor.Control>H2</RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content>
            <p>Start typing your rich text content here...</p>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      ),
      code: `<RichTextEditor.Root>
  <RichTextEditor.Toolbar>
    <RichTextEditor.ControlGroup>
      <RichTextEditor.Control>B</RichTextEditor.Control>
      <RichTextEditor.Control>I</RichTextEditor.Control>
      <RichTextEditor.Control>U</RichTextEditor.Control>
    </RichTextEditor.ControlGroup>
    <RichTextEditor.Separator />
    <RichTextEditor.ControlGroup>
      <RichTextEditor.Control>H1</RichTextEditor.Control>
      <RichTextEditor.Control>H2</RichTextEditor.Control>
    </RichTextEditor.ControlGroup>
  </RichTextEditor.Toolbar>
  <RichTextEditor.Content>
    <p>Start typing your rich text content here...</p>
  </RichTextEditor.Content>
</RichTextEditor.Root>`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <RichTextEditor.Root
          variant={props.variant as 'outline' | 'subtle'}
          size={props.size as 'sm' | 'md' | 'lg'}
        >
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control>B</RichTextEditor.Control>
              <RichTextEditor.Control>I</RichTextEditor.Control>
              <RichTextEditor.Control>U</RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
            <RichTextEditor.Separator />
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control>H1</RichTextEditor.Control>
              <RichTextEditor.Control>H2</RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content>
            <p>Edit this content...</p>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      ),
      code: (props) => `<RichTextEditor.Root variant="${props.variant}" size="${props.size}">
  <RichTextEditor.Toolbar>
    <RichTextEditor.ControlGroup>
      <RichTextEditor.Control>B</RichTextEditor.Control>
      <RichTextEditor.Control>I</RichTextEditor.Control>
    </RichTextEditor.ControlGroup>
    <RichTextEditor.Separator />
    <RichTextEditor.ControlGroup>
      <RichTextEditor.Control>H1</RichTextEditor.Control>
    </RichTextEditor.ControlGroup>
  </RichTextEditor.Toolbar>
  <RichTextEditor.Content>
    <p>Edit this content...</p>
  </RichTextEditor.Content>
</RichTextEditor.Root>`,
    },
  ],
  render: (props) => (
    <RichTextEditor.Root
      variant={props.variant as 'outline' | 'subtle'}
      size={props.size as 'sm' | 'md' | 'lg'}
    >
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control>B</RichTextEditor.Control>
          <RichTextEditor.Control>I</RichTextEditor.Control>
          <RichTextEditor.Control>U</RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
        <RichTextEditor.Separator />
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control>H1</RichTextEditor.Control>
          <RichTextEditor.Control>H2</RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content>
        <p>Rich text editor preview</p>
      </RichTextEditor.Content>
    </RichTextEditor.Root>
  ),
};
