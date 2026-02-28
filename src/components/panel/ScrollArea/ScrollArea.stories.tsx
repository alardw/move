import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea';

const meta: Meta = {
  title: 'Panel/ScrollArea',
  component: ScrollArea.Root,
  argTypes: {
    // ScrollArea.Header props
    headerPadded: {
      name: 'Header: padded',
      control: 'boolean',
      description: 'Whether to apply padding to the header.',
      table: { defaultValue: { summary: 'true' } },
    },
    // ScrollArea.Content props
    contentPadded: {
      name: 'Content: padded',
      control: 'boolean',
      description: 'Whether to apply padding to the content.',
      table: { defaultValue: { summary: 'false' } },
    },
    // ScrollArea.Footer props
    footerPadded: {
      name: 'Footer: padded',
      control: 'boolean',
      description: 'Whether to apply padding to the footer.',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  render: (args) => (
    <ScrollArea.Root
      style={{
        height: 300,
        width: 320,
        border: '1px solid var(--move-border-base)',
        borderRadius: 'var(--move-rounded-lg)',
      }}
    >
      <ScrollArea.Header padded={args.headerPadded}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'var(--move-weight-semibold)', fontSize: 'var(--move-size-base)' }}>
            Tasks
          </span>
          <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            12 items
          </span>
        </div>
      </ScrollArea.Header>
      <ScrollArea.Content padded={args.contentPadded}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--move-spacing-sm) var(--move-spacing-md)',
                background: 'var(--move-bg-subtle)',
                borderRadius: 'var(--move-rounded-md)',
                fontSize: 'var(--move-size-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--move-spacing-sm)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i < 3 ? 'var(--move-success)' : 'var(--move-fg-muted)',
                  flexShrink: 0,
                }}
              />
              Task {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea.Content>
      <ScrollArea.Footer padded={args.footerPadded}>
        <div style={{ display: 'flex', gap: 'var(--move-spacing-sm)' }}>
          <button style={{ flex: 1, cursor: 'pointer' }}>Clear All</button>
          <button style={{ flex: 1, cursor: 'pointer' }}>Add Task</button>
        </div>
      </ScrollArea.Footer>
    </ScrollArea.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
