import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from './DatePicker';
import { Calendar } from '../../calendar/Calendar/Calendar';

const meta: Meta = {
  title: 'Form/DatePicker',
  component: DatePicker.Root,
  args: {
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
      table: { defaultValue: { summary: 'single' } },
    },
    closeOnSelect: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    open: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    locale: {
      control: 'text',
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
    yearRange: {
      control: 'number',
      table: { defaultValue: { summary: '10' } },
    },
    fixedWeeks: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onValueChange: {
      action: 'onValueChange',
    },
    onOpenChange: {
      action: 'onOpenChange',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <DatePicker.Root
      mode={args.mode}
      closeOnSelect={args.closeOnSelect}
      open={args.open}
      defaultOpen={args.defaultOpen}
      locale={args.locale}
      weekStartsOn={args.weekStartsOn}
      numberOfMonths={args.numberOfMonths}
      showWeekNumbers={args.showWeekNumbers}
      yearRange={args.yearRange}
      fixedWeeks={args.fixedWeeks}
      showTime={args.showTime}
      onValueChange={args.onValueChange}
      onOpenChange={args.onOpenChange}
    >
      <DatePicker.Trigger>
        <DatePicker.Input placeholder="Pick a date" />
      </DatePicker.Trigger>
      <DatePicker.Portal>
        <DatePicker.Content>
          <Calendar.Nav />
          <Calendar.Grid />
        </DatePicker.Content>
      </DatePicker.Portal>
    </DatePicker.Root>
  ),
};
