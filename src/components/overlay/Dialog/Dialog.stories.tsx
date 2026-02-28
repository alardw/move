import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dialog } from './Dialog';
import { Button } from '../../core/Button/Button';

const meta: Meta = {
  title: 'Overlay/Dialog',
  component: Dialog.Root,
  args: {
    onOpenChange: fn(),
    onOpenAutoFocus: fn(),
    onPointerDownOutside: fn(),
    onEscapeKeyDown: fn(),
    onInteractOutside: fn(),
  },
  argTypes: {
    // Dialog.Root props
    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open by default.',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Called when the open state changes.',
    },
    modal: {
      control: 'boolean',
      description: 'Whether the dialog blocks interaction with the rest of the page.',
    },
    // Dialog.Content props
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Width preset for the dialog.',
      table: { defaultValue: { summary: 'md' } },
    },
    onOpenAutoFocus: {
      action: 'onOpenAutoFocus',
      description: 'Called when focus moves into the content after opening.',
    },
    onPointerDownOutside: {
      action: 'onPointerDownOutside',
      description: 'Called when a pointer event occurs outside the content.',
    },
    onEscapeKeyDown: {
      action: 'onEscapeKeyDown',
      description: 'Called when the Escape key is pressed.',
    },
    onInteractOutside: {
      action: 'onInteractOutside',
      description: 'Called when an interaction occurs outside the content.',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Dialog.Root
      open={args.open}
      defaultOpen={args.defaultOpen}
      onOpenChange={args.onOpenChange}
      modal={args.modal}
    >
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          size={args.size}
          onOpenAutoFocus={args.onOpenAutoFocus}
          onPointerDownOutside={args.onPointerDownOutside}
          onEscapeKeyDown={args.onEscapeKeyDown}
          onInteractOutside={args.onInteractOutside}
        >
          <Dialog.Header>
            <Dialog.Title>Edit Profile</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" style={{ padding: 0, width: 'var(--move-control-height-sm)' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </Dialog.Close>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              Make changes to your profile here. Click save when you&apos;re done.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="primary">Save</Button>
              </Dialog.Close>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
