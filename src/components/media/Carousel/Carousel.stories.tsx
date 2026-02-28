import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Carousel } from './Carousel';

// ---------------------------------------------------------------------------
// Helper: a coloured placeholder slide
// ---------------------------------------------------------------------------

const SLIDE_TONES = [
  { bg: 'var(--move-primary)', fg: 'var(--move-primary-fg)' },
  { bg: 'var(--move-success)', fg: 'var(--move-success-fg)' },
  { bg: 'var(--move-warning)', fg: 'var(--move-warning-fg)' },
  { bg: 'var(--move-error)', fg: 'var(--move-error-fg)' },
  { bg: 'var(--move-info)', fg: 'var(--move-info-fg)' },
];

function DemoSlide({ index }: { index: number }) {
  const tone = SLIDE_TONES[index % SLIDE_TONES.length];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        borderRadius: 'var(--move-rounded-md)',
        backgroundColor: tone.bg,
        color: tone.fg,
        fontSize: 'var(--move-size-xl)',
        fontWeight: 'var(--move-weight-semibold)',
        userSelect: 'none',
      }}
    >
      Slide {index + 1}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Carousel.Root> = {
  title: 'Media/Carousel',
  component: Carousel.Root,
  args: {
    onPageChange: fn(),
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Scroll orientation.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Snap alignment.',
      table: { defaultValue: { summary: 'start' } },
    },
    slidesPerView: {
      control: 'number',
      description: 'Number of slides visible at once.',
      table: { defaultValue: { summary: '1' } },
    },
    loop: {
      control: 'boolean',
      description: 'Loop back to start.',
      table: { defaultValue: { summary: 'false' } },
    },
    autoplay: {
      control: 'number',
      description: 'Auto-advance interval in ms. 0 = off.',
      table: { defaultValue: { summary: '0' } },
    },
    draggable: {
      control: 'boolean',
      description: 'Allow drag/swipe navigation.',
      table: { defaultValue: { summary: 'true' } },
    },
    page: {
      control: 'number',
      description: 'Controlled active page.',
    },
    defaultPage: {
      control: 'number',
      description: 'Initial page when uncontrolled.',
    },
    onPageChange: {
      action: 'onPageChange',
      description: 'Called when the active page changes.',
    },
    showTriggers: {
      control: 'boolean',
      description: 'Render built-in prev/next triggers.',
      table: { defaultValue: { summary: 'false' } },
    },
    showIndicators: {
      control: 'boolean',
      description: 'Render built-in indicators.',
      table: { defaultValue: { summary: 'false' } },
    },
    triggerPlacement: {
      control: 'select',
      options: ['none', 'top', 'bottom', 'overlay', 'indicator-sides'],
      description: 'Placement strategy for built-in triggers.',
      table: { defaultValue: { summary: 'top' } },
    },
    triggerAlign: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment for top/bottom rows and indicator-sides row.',
      table: { defaultValue: { summary: 'end' } },
    },
    triggerSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Trigger size for built-in controls.',
      table: { defaultValue: { summary: 'md' } },
    },
    triggerVariant: {
      control: 'select',
      options: ['surface', 'ghost', 'solid'],
      description: 'Trigger visual variant for built-in controls.',
      table: { defaultValue: { summary: 'surface' } },
    },
    overlayInset: {
      control: 'text',
      description: 'Horizontal inset for overlay trigger placement.',
      table: { defaultValue: { summary: 'var(--move-spacing-sm)' } },
    },
    overlayOffsetY: {
      control: 'text',
      description: 'Vertical offset for overlay trigger placement.',
      table: { defaultValue: { summary: '50%' } },
    },
    overlayHideUntilHover: {
      control: 'boolean',
      description: 'Hide overlay triggers until hover/focus.',
      table: { defaultValue: { summary: 'false' } },
    },
    indicatorPlacement: {
      control: 'select',
      options: ['inside-bottom', 'below'],
      description: 'Placement for built-in indicators.',
      table: { defaultValue: { summary: 'below' } },
    },
    indicatorGap: {
      control: 'text',
      description: 'Override indicator gap token.',
    },
    indicatorInset: {
      control: 'text',
      description: 'Horizontal inset for inside-bottom indicators.',
      table: { defaultValue: { summary: 'var(--move-spacing-sm)' } },
    },
  },
};

export default meta;

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

type Story = StoryObj<typeof Carousel.Root>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Carousel.Root {...args}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--move-spacing-sm)',
            justifyContent: 'flex-end',
            marginBottom: 'var(--move-spacing-sm)',
          }}
        >
          <Carousel.PrevTrigger />
          <Carousel.NextTrigger />
        </div>
        <Carousel.Viewport>
          {Array.from({ length: 5 }, (_, i) => (
            <Carousel.Slide key={i}>
              <DemoSlide index={i} />
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
        <Carousel.IndicatorGroup />
      </Carousel.Root>
    </div>
  ),
};
