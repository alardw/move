import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CalendarView } from './CalendarView';
import type { CalendarEvent } from '../_shared/types';

// ---------------------------------------------------------------------------
// Sample events anchored to today so they always appear
// ---------------------------------------------------------------------------

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    start: new Date(y, m, d, 9, 0),
    end: new Date(y, m, d, 9, 30),
    color: 'primary',
  },
  {
    id: '2',
    title: 'Design Review',
    start: new Date(y, m, d, 10, 0),
    end: new Date(y, m, d, 11, 0),
    color: 'info',
  },
  {
    id: '3',
    title: 'Lunch Break',
    start: new Date(y, m, d, 12, 0),
    end: new Date(y, m, d, 13, 0),
    color: 'success',
  },
  {
    id: '4',
    title: 'Sprint Planning',
    start: new Date(y, m, d, 14, 0),
    end: new Date(y, m, d, 15, 30),
    color: 'warning',
  },
  {
    id: '5',
    title: 'Project Deadline',
    start: new Date(y, m, d + 2),
    allDay: true,
    color: 'danger',
  },
  {
    id: '6',
    title: 'Workshop',
    start: new Date(y, m, d + 3, 9, 0),
    end: new Date(y, m, d + 3, 17, 0),
    color: 'info',
  },
  {
    id: '7',
    title: 'One-on-One',
    start: new Date(y, m, d + 1, 11, 0),
    end: new Date(y, m, d + 1, 11, 30),
    color: 'primary',
  },
  {
    id: '8',
    title: 'Team Outing',
    start: new Date(y, m, d + 5),
    allDay: true,
    color: 'success',
  },
  {
    id: '9',
    title: 'Bug Bash',
    start: new Date(y, m, d + 4, 13, 0),
    end: new Date(y, m, d + 4, 17, 0),
    color: 'warning',
  },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof CalendarView.Root> = {
  title: 'Calendar/CalendarView',
  component: CalendarView.Root,
  args: {
    onViewChange: fn(),
    onDateChange: fn(),
    onEventClick: fn(),
    onSlotClick: fn(),
    onDayClick: fn(),
    onAllDayClick: fn(),
  },
  argTypes: {
    // Controlled view
    view: {
      control: 'select',
      options: ['day', 'week', 'month', 'agenda'],
      description: 'Controlled current view mode.',
    },
    // Uncontrolled initial view
    defaultView: {
      control: 'select',
      options: ['day', 'week', 'month', 'agenda'],
      description: 'Uncontrolled initial view mode.',
      table: { defaultValue: { summary: "'month'" } },
    },
    // Controlled date — too complex for a simple control, omit
    date: {
      control: false,
      description: 'Controlled current date.',
    },
    // Uncontrolled initial date
    defaultDate: {
      control: false,
      description: 'Uncontrolled initial date.',
      table: { defaultValue: { summary: 'new Date()' } },
    },
    // Locale
    locale: {
      control: 'text',
      description: 'BCP 47 locale for formatting and layout.',
      table: { defaultValue: { summary: "'en-US'" } },
    },
    // Week starts on
    weekStartsOn: {
      control: 'number',
      description: 'Day the week starts on (0 = Sunday, 1 = Monday, etc).',
      table: { defaultValue: { summary: 'locale-derived' } },
    },
    // Time grid: first hour
    startHour: {
      control: 'number',
      description: 'First hour shown in day/week time grids.',
      table: { defaultValue: { summary: '0' } },
    },
    // Time grid: last hour
    endHour: {
      control: 'number',
      description: 'Last hour shown in day/week time grids.',
      table: { defaultValue: { summary: '24' } },
    },
    // Slot interval
    slotInterval: {
      control: 'select',
      options: [30, 60],
      description: 'Slot interval in minutes for day/week time grids.',
      table: { defaultValue: { summary: '60' } },
    },
    // Max events per cell in month view
    maxEventsPerCell: {
      control: 'number',
      description: 'Maximum events shown per cell in month view before overflow.',
      table: { defaultValue: { summary: '3' } },
    },
    // Always show all-day row
    showAllDay: {
      control: 'boolean',
      description: 'Always show the all-day section in day/week views.',
      table: { defaultValue: { summary: 'false' } },
    },
    // Event handlers
    onViewChange: { action: 'onViewChange', description: 'Called when the view mode changes.' },
    onDateChange: { action: 'onDateChange', description: 'Called when the current date changes.' },
    onEventClick: { action: 'onEventClick', description: 'Called when an event is clicked.' },
    onSlotClick: { action: 'onSlotClick', description: 'Called when an empty time slot is clicked.' },
    onDayClick: { action: 'onDayClick', description: 'Called when a day header is clicked in month view.' },
    onAllDayClick: { action: 'onAllDayClick', description: 'Called when the all-day area is clicked.' },
    // Omit complex / internal props
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    children: { table: { disable: true } },
    renderEvent: { table: { disable: true } },
    labels: { table: { disable: true } },
    events: { table: { disable: true } },
  },
};

export default meta;

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

type Story = StoryObj<typeof CalendarView.Root>;

export const Default: Story = {
  render: (args) => (
    <CalendarView.Root {...args} events={sampleEvents}>
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
        <CalendarView.ViewSwitcher />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  ),
};
