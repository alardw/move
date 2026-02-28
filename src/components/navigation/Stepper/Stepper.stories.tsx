import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  args: {
    onStepClick: fn(),
  },
  argTypes: {
    active: {
      control: 'number',
      table: { defaultValue: { summary: '0' } },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    onStepClick: {
      action: 'onStepClick',
    },
  },
  render: (args) => (
    <Stepper {...args}>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Account</Stepper.Title>
        <Stepper.Description>Create your account</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Verification</Stepper.Title>
        <Stepper.Description>Verify your email</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Complete</Stepper.Title>
        <Stepper.Description>Get started</Stepper.Description>
      </Stepper.Step>
    </Stepper>
  ),
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {};
