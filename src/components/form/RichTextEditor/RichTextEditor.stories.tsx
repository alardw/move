import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RichTextEditor } from './RichTextEditor';

const meta: Meta<typeof RichTextEditor.Root> = {
  title: 'Form/RichTextEditor',
  component: RichTextEditor.Root,
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'subtle'],
      table: { defaultValue: { summary: 'outline' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  render: (args) => (
    <RichTextEditor.Root {...args}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control
            aria-label="Bold"
            title="Bold"
            onActiveChange={fn()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
          </RichTextEditor.Control>
          <RichTextEditor.Control
            aria-label="Italic"
            title="Italic"
            onActiveChange={fn()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="4" x2="10" y2="4" />
              <line x1="14" y1="20" x2="5" y2="20" />
              <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </RichTextEditor.Control>
          <RichTextEditor.Control
            aria-label="Underline"
            title="Underline"
            onActiveChange={fn()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4v6a6 6 0 0 0 12 0V4" />
              <line x1="4" y1="20" x2="20" y2="20" />
            </svg>
          </RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
        <RichTextEditor.Separator />
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control
            aria-label="Heading 1"
            title="Heading 1"
            onActiveChange={fn()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="m17 12 3-2v8" />
            </svg>
          </RichTextEditor.Control>
          <RichTextEditor.Control
            aria-label="Bullet list"
            title="Bullet list"
            onActiveChange={fn()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content minHeight={120}>
        <div contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
          Start typing your content here…
        </div>
      </RichTextEditor.Content>
    </RichTextEditor.Root>
  ),
};

export default meta;

type Story = StoryObj<typeof RichTextEditor.Root>;

export const Default: Story = {};
