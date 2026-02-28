import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Form/ColorPicker',
  component: ColorPicker,
  args: {
    onValueChange: fn(),
    onChangeEnd: fn(),
    onFormatChange: fn(),
  },
  argTypes: {
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
    formatOptions: {
      control: false,
    },
    swatches: {
      control: false,
    },
    swatchesPerRow: {
      control: 'number',
      table: { defaultValue: { summary: '7' } },
    },
    withPicker: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    fullWidth: {
      control: 'boolean',
    },
    saturationLabel: {
      control: 'text',
    },
    hueLabel: {
      control: 'text',
    },
    alphaLabel: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
  render: (args) => <ColorPicker {...args} defaultValue="#3b82f6" />,
};

export default meta;

type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {};
