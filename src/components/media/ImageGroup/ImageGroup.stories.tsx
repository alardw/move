import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGroup } from './ImageGroup';
import { Image } from '../Image/Image';

const PHOTOS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop',
];

const meta: Meta<typeof ImageGroup> = {
  title: 'Media/ImageGroup',
  component: ImageGroup,
  args: {},
  argTypes: {
    columns: {
      control: 'number',
      table: { defaultValue: { summary: '3' } },
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: 'md' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    children: {
      table: { disable: true },
    },
  },
  render: (args) => (
    <ImageGroup {...args}>
      {PHOTOS.map((src, i) => (
        <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="4/3" width="100%" radius="md" />
      ))}
    </ImageGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof ImageGroup>;

export const Default: Story = {};
