import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Autocomplete } from './Autocomplete';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
];

const meta: Meta = {
  title: 'Form/Autocomplete',
  component: Autocomplete.Root,
  args: {
    onValueChange: fn(),
    onOpenChange: fn(),
    onInputValueChange: fn(),
  },
  argTypes: {
    // Root props
    value: {
      control: 'text',
      description: 'Controlled selected value(s).',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value(s) for uncontrolled usage.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Called when selected value(s) change.',
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether open by default.',
      table: { defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Called when open state changes.',
    },
    multiple: {
      control: 'boolean',
      description: 'Enable multi-value mode with tags.',
      table: { defaultValue: { summary: 'false' } },
    },
    inputValue: {
      control: 'text',
      description: 'Controlled input value.',
    },
    onInputValueChange: {
      action: 'onInputValueChange',
      description: 'Called when input value changes.',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state in content.',
      table: { defaultValue: { summary: 'false' } },
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Close after selecting. Defaults to true for single, false for multi.',
    },
    openOnFocus: {
      control: 'boolean',
      description: 'Open dropdown when input is focused.',
      table: { defaultValue: { summary: 'true' } },
    },
    allowCustomValue: {
      control: 'boolean',
      description: 'Allow the user to submit a value not in the list.',
    },
    // Trigger props exposed for the story
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Trigger size.',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      description: 'Visual variant of the trigger.',
      table: { defaultValue: { summary: 'outlined' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the trigger and input.',
    },
    invalid: {
      control: 'boolean',
      description: 'Error/invalid state on the trigger.',
    },
    // Skip: animate, filterFn, style, className, sp, asChild
    animate: { table: { disable: true } },
    filterFn: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    sp: { table: { disable: true } },
    asChild: { table: { disable: true } },
  },
  render: (args) => {
    const {
      onValueChange,
      onOpenChange,
      onInputValueChange,
      value,
      defaultValue,
      open,
      defaultOpen,
      multiple,
      inputValue,
      loading,
      closeOnSelect,
      openOnFocus,
      allowCustomValue,
      size,
      variant,
      disabled,
      invalid,
    } = args;

    return (
      <Autocomplete.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        open={open}
        defaultOpen={defaultOpen}
        multiple={multiple}
        inputValue={inputValue}
        onInputValueChange={onInputValueChange}
        loading={loading}
        closeOnSelect={closeOnSelect}
        openOnFocus={openOnFocus}
        allowCustomValue={allowCustomValue}
      >
        <Autocomplete.Trigger size={size} variant={variant} disabled={disabled} invalid={invalid}>
          {multiple && <Autocomplete.TagList />}
          <Autocomplete.Input placeholder="Search fruits..." disabled={disabled} />
          <Autocomplete.ClearTrigger />
          <Autocomplete.Icon />
        </Autocomplete.Trigger>
        <Autocomplete.Portal>
          <Autocomplete.Content sideOffset={4}>
            <Autocomplete.Loading>Searching...</Autocomplete.Loading>
            <Autocomplete.Empty>No results found</Autocomplete.Empty>
            {fruits.map((f) => (
              <Autocomplete.Item key={f.value} value={f.value}>
                {f.label}
              </Autocomplete.Item>
            ))}
          </Autocomplete.Content>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    );
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
