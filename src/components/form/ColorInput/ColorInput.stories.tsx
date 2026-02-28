import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ColorInput } from './ColorInput';

const meta: Meta<typeof ColorInput> = {
  title: 'Form/ColorInput',
  component: ColorInput,
  args: {
    onValueChange: fn(),
    onChangeEnd: fn(),
    onFormatChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      table: { defaultValue: { summary: 'outlined' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    format: {
      control: 'select',
      options: ['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla'],
      table: { defaultValue: { summary: 'hex' } },
    },
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    onValueChange: {
      action: 'onValueChange',
    },
    onChangeEnd: {
      action: 'onChangeEnd',
    },
    onFormatChange: {
      action: 'onFormatChange',
    },
    swatchesPerRow: {
      control: 'number',
      table: { defaultValue: { summary: '7' } },
    },
    withPicker: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    withEyeDropper: {
      control: 'boolean',
    },
    eyeDropperLabel: {
      control: 'text',
    },
    swatchLabel: {
      control: 'text',
    },
    closeOnColorSwatchClick: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    invalid: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    id: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    autoFocus: {
      control: 'boolean',
    },
    onFocus: {
      action: 'onFocus',
    },
    onBlur: {
      action: 'onBlur',
    },
  },
  render: (args) => <ColorInput {...args} />,
};

export default meta;

type Story = StoryObj<typeof ColorInput>;

export const Default: Story = {};
