import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose } from './Prose';

const meta: Meta<typeof Prose> = {
  title: 'Core/Prose',
  component: Prose,
  args: {
    children: (
      <>
        <h1>Move UI Library</h1>
        <h2>Getting Started</h2>
        <p>
          Move is an animated UI component library built with React. It provides a{' '}
          <a href="#">comprehensive set of components</a> for building modern interfaces.
        </p>
        <h3>Installation</h3>
        <p>Install the package using your preferred package manager:</p>
        <pre><code>npm install move</code></pre>
        <h3>Features</h3>
        <ul>
          <li>Built-in animation system</li>
          <li>Dark and light theme support</li>
          <li>Accessible by default</li>
          <li>TypeScript-first API</li>
        </ul>
        <ol>
          <li>Install the package</li>
          <li>Import the components you need</li>
          <li>Wrap your app in a ThemeProvider</li>
        </ol>
        <blockquote>
          <p>Move makes it easy to build beautiful, animated interfaces without the complexity.</p>
        </blockquote>
      </>
    ),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      table: { defaultValue: { summary: 'base' } },
    },
    children: {
      control: false,
    },
  },
  render: (args) => <Prose {...args} />,
};

export default meta;

type Story = StoryObj<typeof Prose>;

export const Default: Story = {};
