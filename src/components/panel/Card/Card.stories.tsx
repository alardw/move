import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta = {
  title: 'Panel/Card',
  component: Card.Root,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'ghost'],
      description: 'Visual style of the card.',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Padding density of the card.',
      table: { defaultValue: { summary: 'md' } },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Card.Root
      variant={args.variant as 'default' | 'elevated' | 'ghost' | undefined}
      size={args.size as 'sm' | 'md' | 'lg' | undefined}
      style={{ maxWidth: 400 }}
    >
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>A short description of the card content.</Card.Description>
      </Card.Header>
      <Card.Body>
        <p style={{ margin: 0, color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          Cards group related content and actions together. Use header, body, and footer to structure the layout.
        </p>
      </Card.Body>
      <Card.Footer>
        <Card.FooterEnd>
          <button style={{ all: 'unset', cursor: 'pointer', padding: '0 8px', lineHeight: '32px', borderRadius: 4, border: '1px solid var(--move-border)', color: 'var(--move-fg-muted)' }}>Cancel</button>
          <button style={{ all: 'unset', cursor: 'pointer', padding: '0 8px', lineHeight: '32px', borderRadius: 4, background: 'var(--move-accent-9)', color: 'var(--move-accent-fg)' }}>Save</button>
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  ),
};
