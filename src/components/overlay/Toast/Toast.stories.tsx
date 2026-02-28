'use client';

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, toast } from './index';
import type { ToastViewportProps } from './Toast';

const meta: Meta<ToastViewportProps> = {
  title: 'Overlay/Toast',
  component: Toast.Viewport,
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-right',
        'top-left',
        'top-center',
        'bottom-right',
        'bottom-left',
        'bottom-center',
      ],
      table: { defaultValue: { summary: 'bottom-right' } },
    },
    closeLabel: {
      control: 'text',
      table: { defaultValue: { summary: 'Close notification' } },
    },
  },
  render: (args) => {
    const { position, closeLabel } = args;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <button onClick={() => toast('Default notification', { position })}>
          Default
        </button>
        <button onClick={() => toast.info('Deployment started', { description: 'Your app is being built and deployed.', position })}>
          Info
        </button>
        <button onClick={() => toast.success('Changes saved', { description: 'All changes have been saved.', position })}>
          Success
        </button>
        <button onClick={() => toast.warning('API rate limit', { description: 'You are approaching the rate limit.', position })}>
          Warning
        </button>
        <button onClick={() => toast.error('Connection lost', { description: 'Unable to reach the server.', position })}>
          Error
        </button>
        <Toast.Viewport closeLabel={closeLabel} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<ToastViewportProps>;

export const Default: Story = {};
