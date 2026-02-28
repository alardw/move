import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Media/Image',
  component: Image,
  args: {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    alt: 'Mountain landscape',
    width: 400,
    height: 260,
    onLoad: fn(),
    onError: fn(),
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL. Used as SSR fallback when sources is provided.',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility.',
    },
    fallbackSrc: {
      control: 'text',
      description: 'Fallback image URL shown when the primary source fails to load.',
    },
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      table: { defaultValue: { summary: 'cover' } },
      description: 'How the image fills its container (object-fit).',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      table: { defaultValue: { summary: 'none' } },
      description: 'Border radius of the image container.',
    },
    position: {
      control: 'select',
      options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
      table: { defaultValue: { summary: 'center' } },
      description: 'Focal point when the image is cropped (object-position).',
    },
    aspectRatio: {
      control: 'text',
      description: 'CSS aspect ratio (e.g. "16/9", "1/1").',
    },
    width: {
      control: 'text',
      description: 'Width of the image container.',
    },
    height: {
      control: 'text',
      description: 'Height of the image container.',
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
      description: 'Browser loading strategy.',
    },
    onLoad: {
      description: 'Called when the image loads successfully.',
    },
    onError: {
      description: 'Called when the image fails to load.',
    },
  },
  render: (args) => <Image {...args} />,
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {};
