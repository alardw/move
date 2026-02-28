import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Label } from '../Label';
import { InputText } from '../InputText';

const meta: Meta<typeof FormField.Root> = {
  title: 'Form/FormField',
  component: FormField.Root,
  args: {
    children: undefined,
  },
  argTypes: {
    labelWidth: {
      control: 'text',
    },
  },
  render: (args) => (
    <FormField.Root labelWidth={args.labelWidth}>
      <FormField.Label>
        <Label htmlFor="story-field" required>Email address</Label>
      </FormField.Label>
      <FormField.Field>
        <InputText id="story-field" type="email" placeholder="you@example.com" />
      </FormField.Field>
      <FormField.Description>
        We&apos;ll never share your email with anyone.
      </FormField.Description>
    </FormField.Root>
  ),
};

export default meta;

type Story = StoryObj<typeof FormField.Root>;

export const Default: Story = {};
