import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Select } from './Select';

const meta: Meta = {
  title: 'Form/Select',
  component: Select.Root,
  args: {
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    // Select.Root props
    value: {
      control: 'text',
      description: 'Controlled selected value.',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value for uncontrolled usage.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Called when the selected value changes.',
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state of the dropdown.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the dropdown is open by default.',
      table: { defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Called when the dropdown open state changes.',
    },

    // Select.Trigger props
    disabled: {
      control: 'boolean',
      description: 'Whether the trigger is disabled.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the trigger is in an invalid state.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the trigger.',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      description: 'Visual variant of the trigger.',
      table: { defaultValue: { summary: 'outlined' } },
    },
    width: {
      control: 'text',
      description: 'Custom width for the trigger.',
    },

    // Select.Content props
    sideOffset: {
      control: 'number',
      description: 'Distance in pixels from the trigger.',
      table: { defaultValue: { summary: '4' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Horizontal alignment of the content relative to the trigger.',
    },

    // Select.Value props
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no value is selected.',
    },
  },
  render: (args) => (
    <Select.Root
      value={args.value as string | undefined}
      defaultValue={args.defaultValue as string | undefined}
      onValueChange={args.onValueChange as (value: string) => void}
      open={args.open as boolean | undefined}
      defaultOpen={args.defaultOpen as boolean | undefined}
      onOpenChange={args.onOpenChange as (open: boolean) => void}
    >
      <Select.Trigger
        disabled={args.disabled as boolean | undefined}
        invalid={args.invalid as boolean | undefined}
        size={args.size as 'sm' | 'md' | 'lg' | undefined}
        variant={args.variant as 'outlined' | 'filled' | undefined}
        width={args.width as React.CSSProperties['width'] | undefined}
      >
        <Select.Value placeholder={(args.placeholder as string | undefined) ?? 'Choose a fruit'} />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          sideOffset={args.sideOffset as number | undefined}
          align={args.align as 'start' | 'center' | 'end' | undefined}
        >
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
          <Select.Item value="grape">Grape</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
