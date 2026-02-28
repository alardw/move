import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Calendar } from './Calendar';
import type { CalendarRootProps } from './Calendar';

const meta: Meta<CalendarRootProps> = {
  title: 'Calendar/Calendar',
  component: Calendar.Root,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
      table: { defaultValue: { summary: 'single' } },
    },
    locale: {
      control: 'text',
      table: { defaultValue: { summary: 'en-US' } },
    },
    weekStartsOn: {
      control: 'number',
      table: { defaultValue: { summary: '0' } },
    },
    numberOfMonths: {
      control: 'number',
      table: { defaultValue: { summary: '1' } },
    },
    showWeekNumbers: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onValueChange: {
      action: 'onValueChange',
    },
  },
};

export default meta;

type Story = StoryObj<CalendarRootProps>;

function CalendarStory(args: CalendarRootProps) {
  const [value, setValue] = useState<any>(null);
  return (
    <Calendar.Root
      {...args}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        args.onValueChange?.(v);
      }}
    >
      <Calendar.Nav />
      <Calendar.Grid />
    </Calendar.Root>
  );
}

export const Default: Story = {
  render: (args) => <CalendarStory {...args} />,
};
