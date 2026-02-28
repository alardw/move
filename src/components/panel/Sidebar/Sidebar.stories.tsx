import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  BarChart3,
  Bell,
  Home,
  HelpCircle,
  LogOut,
  Mail,
  PanelLeftClose,
  Settings,
  Users,
} from 'lucide-react';
import { Sidebar } from './Sidebar';

const meta: Meta = {
  title: 'Panel/Sidebar',
  component: Sidebar.Provider,
  args: {
    onCollapsedChange: fn(),
    onMobileOpenChange: fn(),
  },
  argTypes: {
    // Sidebar.Provider props
    collapsed: {
      control: 'boolean',
      description: 'Controlled collapsed state.',
    },
    defaultCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar starts collapsed.',
      table: { defaultValue: { summary: 'false' } },
    },
    onCollapsedChange: {
      description: 'Called when the collapsed state changes.',
    },
    mobileOpen: {
      control: 'boolean',
      description: 'Controlled mobile sheet open state.',
    },
    defaultMobileOpen: {
      control: 'boolean',
      description: 'Whether the mobile sheet is open by default.',
      table: { defaultValue: { summary: 'false' } },
    },
    onMobileOpenChange: {
      description: 'Called when the mobile sheet open state changes.',
    },
    breakpoint: {
      control: 'number',
      description: 'Viewport width in pixels below which mobile mode activates.',
      table: { defaultValue: { summary: '768' } },
    },
    // Sidebar.Root props
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Which side of the layout the sidebar appears on.',
      table: { defaultValue: { summary: 'left' } },
    },
  },
  render: (args) => {
    const { collapsed, defaultCollapsed, onCollapsedChange, mobileOpen, defaultMobileOpen, onMobileOpenChange, breakpoint, side } = args;
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 420,
          overflow: 'hidden',
          border: '1px solid var(--move-border-base)',
          borderRadius: 'var(--move-rounded-lg)',
          display: 'flex',
        }}
      >
        <Sidebar.Provider
          collapsed={collapsed}
          defaultCollapsed={defaultCollapsed}
          onCollapsedChange={onCollapsedChange}
          mobileOpen={mobileOpen}
          defaultMobileOpen={defaultMobileOpen}
          onMobileOpenChange={onMobileOpenChange}
          breakpoint={breakpoint}
        >
          <Sidebar.Root side={side}>
            <Sidebar.Header>
              <span style={{ fontWeight: 600, fontSize: 'var(--move-size-lg)' }}>App</span>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
                <Sidebar.Item icon={<Home size={18} />} tooltip="Home" active>
                  Home
                </Sidebar.Item>
                <Sidebar.Item icon={<BarChart3 size={18} />} tooltip="Analytics">
                  Analytics
                </Sidebar.Item>
                <Sidebar.Item icon={<Users size={18} />} tooltip="Users">
                  Users
                </Sidebar.Item>
                <Sidebar.Item icon={<Mail size={18} />} tooltip="Messages">
                  Messages
                </Sidebar.Item>
                <Sidebar.Item icon={<Bell size={18} />} tooltip="Notifications">
                  Notifications
                </Sidebar.Item>
              </Sidebar.Group>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
                <Sidebar.Item icon={<Settings size={18} />} tooltip="Settings">
                  Application Settings
                </Sidebar.Item>
                <Sidebar.Item icon={<HelpCircle size={18} />} tooltip="Help">
                  Help &amp; Documentation
                </Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.Item icon={<LogOut size={18} />} tooltip="Log out">
                Log out
              </Sidebar.Item>
              <Sidebar.Item icon={<PanelLeftClose size={18} />} tooltip="Toggle" asChild>
                <Sidebar.Trigger>Toggle</Sidebar.Trigger>
              </Sidebar.Item>
            </Sidebar.Footer>
            <Sidebar.Rail />
          </Sidebar.Root>
          <div style={{ flex: 1, padding: 'var(--move-spacing-lg)', overflow: 'auto' }}>
            <p style={{ color: 'var(--move-fg-muted)' }}>Main content area</p>
          </div>
        </Sidebar.Provider>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
