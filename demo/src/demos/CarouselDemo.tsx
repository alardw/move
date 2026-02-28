import { useState, type CSSProperties } from 'react';
import { Carousel, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

const slideTones = [
  { bg: 'var(--move-primary)', fg: 'var(--move-primary-fg)' },
  { bg: 'var(--move-success)', fg: 'var(--move-success-fg)' },
  { bg: 'var(--move-warning)', fg: 'var(--move-warning-fg)' },
  { bg: 'var(--move-error)', fg: 'var(--move-error-fg)' },
  { bg: 'var(--move-info)', fg: 'var(--move-info-fg)' },
];
const darkerInactiveIndicators = {
  ['--move-carousel-indicator-bg' as string]: 'var(--move-border-emphasis)',
} as CSSProperties;
const overlayTriggerStyle = {
  ['--move-carousel-trigger-bg' as string]: 'rgb(17 24 39 / 0.58)',
  ['--move-carousel-trigger-bg-hover' as string]: 'rgb(17 24 39 / 0.72)',
  ['--move-carousel-trigger-border' as string]: 'rgb(255 255 255 / 0.24)',
  ['--move-carousel-trigger-fg' as string]: 'var(--move-fg-inverse)',
} as CSSProperties;

function DemoSlide({ index, height = 200, minWidth }: { index: number; height?: number; minWidth?: number | string }) {
  const tone = slideTones[index % slideTones.length];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        minWidth,
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

// ─────────────────────────────────────────────────────────────────
// Usage
// ─────────────────────────────────────────────────────────────────

function UsageExample() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Carousel.Root style={darkerInactiveIndicators}>
        <Stack direction="row" gap="sm" style={{ justifyContent: 'flex-end', marginBottom: 'var(--move-spacing-sm)' }}>
          <Carousel.PrevTrigger />
          <Carousel.NextTrigger />
        </Stack>
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
  );
}

// ─────────────────────────────────────────────────────────────────
// Multiple slides per view
// ─────────────────────────────────────────────────────────────────

function MultiplePerViewExample() {
  return (
    <Carousel.Root slidesPerView={3} style={darkerInactiveIndicators}>
      <Stack direction="row" gap="sm" style={{ justifyContent: 'flex-end', marginBottom: 'var(--move-spacing-sm)' }}>
        <Carousel.PrevTrigger />
        <Carousel.NextTrigger />
      </Stack>
      <Carousel.Viewport>
        {Array.from({ length: 9 }, (_, i) => (
          <Carousel.Slide key={i}>
            <DemoSlide index={i} height={140} />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
      <Carousel.IndicatorGroup />
    </Carousel.Root>
  );
}

// ─────────────────────────────────────────────────────────────────
// Loop
// ─────────────────────────────────────────────────────────────────

function LoopExample() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Carousel.Root loop style={darkerInactiveIndicators}>
        <Stack direction="row" gap="sm" style={{ justifyContent: 'flex-end', marginBottom: 'var(--move-spacing-sm)' }}>
          <Carousel.PrevTrigger />
          <Carousel.NextTrigger />
        </Stack>
        <Carousel.Viewport>
          {Array.from({ length: 4 }, (_, i) => (
            <Carousel.Slide key={i}>
              <DemoSlide index={i} />
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
        <Carousel.IndicatorGroup />
      </Carousel.Root>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Controlled
// ─────────────────────────────────────────────────────────────────

function ControlledExample() {
  const [page, setPage] = useState(0);

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 'var(--move-spacing-sm)', fontSize: 'var(--move-font-size-sm)', color: 'var(--move-text-muted)' }}>
        Current page: {page}
      </div>
      <Carousel.Root page={page} onPageChange={setPage} style={darkerInactiveIndicators}>
        <Stack direction="row" gap="sm" style={{ justifyContent: 'flex-end', marginBottom: 'var(--move-spacing-sm)' }}>
          <Carousel.PrevTrigger />
          <Carousel.NextTrigger />
        </Stack>
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
  );
}

// ─────────────────────────────────────────────────────────────────
// Vertical
// ─────────────────────────────────────────────────────────────────

function VerticalExample() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Carousel.Root orientation="vertical" style={darkerInactiveIndicators}>
        <div style={{ display: 'flex', gap: 'var(--move-spacing-md)' }}>
          <div style={{ flex: 1 }}>
            <Carousel.Viewport style={{ height: 300 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Carousel.Slide key={i}>
                  <DemoSlide index={i} height={300} minWidth={220} />
                </Carousel.Slide>
              ))}
            </Carousel.Viewport>
            <Carousel.IndicatorGroup />
          </div>
          <Stack direction="column" gap="sm" style={{ justifyContent: 'center' }}>
            <Carousel.PrevTrigger />
            <Carousel.NextTrigger />
          </Stack>
        </div>
      </Carousel.Root>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Overlay controls
// ─────────────────────────────────────────────────────────────────

function OverlayControlsExample() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Carousel.Root
        showTriggers
        showIndicators
        triggerPlacement="overlay"
        triggerVariant="surface"
        indicatorPlacement="below"
        overlayInset="var(--move-spacing-sm)"
        style={{ ...darkerInactiveIndicators, ...overlayTriggerStyle }}
      >
        <Carousel.Viewport>
          {Array.from({ length: 5 }, (_, i) => (
            <Carousel.Slide key={i}>
              <DemoSlide index={i} />
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
      </Carousel.Root>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Controls around indicators
// ─────────────────────────────────────────────────────────────────

function IndicatorSidesExample() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Carousel.Root
        showTriggers
        showIndicators
        triggerPlacement="indicator-sides"
        triggerAlign="center"
        style={darkerInactiveIndicators}
      >
        <Carousel.Viewport>
          {Array.from({ length: 6 }, (_, i) => (
            <Carousel.Slide key={i}>
              <DemoSlide index={i} />
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
      </Carousel.Root>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Examples
// ─────────────────────────────────────────────────────────────────

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Scroll-snap powered slides with navigation triggers and dot indicators.',
    component: <UsageExample />,
    code: `import { Carousel } from 'move';

<Carousel.Root>
  <Carousel.PrevTrigger />
  <Carousel.NextTrigger />
  <Carousel.Viewport>
    <Carousel.Slide>Slide 1</Carousel.Slide>
    <Carousel.Slide>Slide 2</Carousel.Slide>
    <Carousel.Slide>Slide 3</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.IndicatorGroup />
</Carousel.Root>`,
  },
  {
    id: 'multiple-per-view',
    name: 'Multiple per view',
    description: 'Show several slides at once with slidesPerView.',
    component: <MultiplePerViewExample />,
    code: `<Carousel.Root slidesPerView={3}>
  <Carousel.PrevTrigger />
  <Carousel.NextTrigger />
  <Carousel.Viewport>
    {items.map((item, i) => (
      <Carousel.Slide key={i}>{item}</Carousel.Slide>
    ))}
  </Carousel.Viewport>
  <Carousel.IndicatorGroup />
</Carousel.Root>`,
  },
  {
    id: 'loop',
    name: 'Loop',
    description: 'Wraps around endlessly when you reach the last slide.',
    component: <LoopExample />,
    code: `<Carousel.Root loop>
  <Carousel.PrevTrigger />
  <Carousel.NextTrigger />
  <Carousel.Viewport>
    <Carousel.Slide>Slide 1</Carousel.Slide>
    <Carousel.Slide>Slide 2</Carousel.Slide>
    <Carousel.Slide>Slide 3</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.IndicatorGroup />
</Carousel.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Drive the active page from your own state.',
    component: <ControlledExample />,
    code: `const [page, setPage] = useState(0);

<Carousel.Root page={page} onPageChange={setPage}>
  <Carousel.PrevTrigger />
  <Carousel.NextTrigger />
  <Carousel.Viewport>
    <Carousel.Slide>Slide 1</Carousel.Slide>
    <Carousel.Slide>Slide 2</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.IndicatorGroup />
</Carousel.Root>`,
  },
  {
    id: 'vertical',
    name: 'Vertical',
    description: 'Stack slides top to bottom with vertical orientation.',
    component: <VerticalExample />,
    code: `<Carousel.Root orientation="vertical">
  <div style={{ display: 'flex', gap: 16 }}>
    <div style={{ flex: 1 }}>
      <Carousel.Viewport style={{ height: 300 }}>
        <Carousel.Slide>Slide 1</Carousel.Slide>
        <Carousel.Slide>Slide 2</Carousel.Slide>
      </Carousel.Viewport>
      <Carousel.IndicatorGroup />
    </div>
    <div>
      <Carousel.PrevTrigger />
      <Carousel.NextTrigger />
    </div>
  </div>
</Carousel.Root>`,
  },
  {
    id: 'overlay-controls',
    name: 'Overlay controls',
    description: 'Place previous/next over the slide area while keeping indicators below for legibility.',
    component: <OverlayControlsExample />,
    code: `<Carousel.Root
  showTriggers
  showIndicators
  triggerPlacement="overlay"
  triggerVariant="solid"
  indicatorPlacement="below"
>
  <Carousel.Viewport>
    {slides.map((slide) => (
      <Carousel.Slide key={slide.id}>{slide.content}</Carousel.Slide>
    ))}
  </Carousel.Viewport>
</Carousel.Root>`,
  },
  {
    id: 'indicator-sides',
    name: 'Indicator sides',
    description: 'Place triggers left/right of the indicators row.',
    component: <IndicatorSidesExample />,
    code: `<Carousel.Root
  showTriggers
  showIndicators
  triggerPlacement="indicator-sides"
  triggerAlign="center"
>
  <Carousel.Viewport>
    {slides.map((slide) => (
      <Carousel.Slide key={slide.id}>{slide.content}</Carousel.Slide>
    ))}
  </Carousel.Viewport>
</Carousel.Root>`,
  },
];

export function CarouselDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Carousel"
        description="Scroll-snap slides with flexible navigation and indicators."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Carousel.Root"
        properties={[
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Scroll direction.' },
          { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Snap alignment of slides.' },
          { name: 'slidesPerView', type: 'number', default: '1', description: 'Number of slides visible at once.' },
          { name: 'loop', type: 'boolean', default: 'false', description: 'Wrap around at the edges.' },
          { name: 'autoplay', type: 'number', default: '0', description: 'Auto-advance interval in milliseconds. 0 disables autoplay.' },
          { name: 'draggable', type: 'boolean', default: 'true', description: 'Allow drag/swipe to navigate.' },
          { name: 'page', type: 'number', description: 'Controlled active page (0-indexed).' },
          { name: 'defaultPage', type: 'number', default: '0', description: 'Initial page when uncontrolled.' },
          { name: 'onPageChange', type: '(page: number) => void', description: 'Called when the active page changes.' },
          { name: 'showTriggers', type: 'boolean', default: 'false', description: 'Render built-in previous/next controls.' },
          { name: 'showIndicators', type: 'boolean', default: 'false', description: 'Render built-in indicator controls.' },
          { name: 'triggerPlacement', type: "'none' | 'top' | 'bottom' | 'overlay' | 'indicator-sides'", default: "'top'", description: 'Placement strategy for built-in trigger controls.' },
          { name: 'triggerAlign', type: "'start' | 'center' | 'end'", default: "'end'", description: 'Alignment of built-in controls in row layouts.' },
          { name: 'triggerSize', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of built-in trigger controls.' },
          { name: 'triggerVariant', type: "'surface' | 'ghost' | 'solid'", default: "'surface'", description: 'Visual variant of built-in trigger controls.' },
          { name: 'overlayInset', type: 'string | number', default: "'var(--move-spacing-sm)'", description: 'Horizontal inset for overlay trigger placement.' },
          { name: 'overlayOffsetY', type: 'string | number', default: "'50%'", description: 'Vertical offset for overlay trigger placement.' },
          { name: 'overlayHideUntilHover', type: 'boolean', default: 'false', description: 'Fade overlay triggers in on hover/focus.' },
          { name: 'indicatorPlacement', type: "'inside-bottom' | 'below'", default: "'below'", description: 'Placement of built-in indicators.' },
          { name: 'indicatorGap', type: 'string | number', description: 'Override spacing between indicators.' },
          { name: 'indicatorInset', type: 'string | number', default: "'var(--move-spacing-sm)'", description: 'Horizontal inset for inside-bottom indicators.' },
        ]}
      />

      <DocPage.ApiSection
        title="Carousel.Viewport"
        properties={[
          { name: 'children', type: 'ReactNode', description: 'Carousel.Slide elements.' },
        ]}
      />

      <DocPage.ApiSection
        title="Carousel.Slide"
        properties={[
          { name: 'children', type: 'ReactNode', description: 'Slide content.' },
        ]}
      />

      <DocPage.ApiSection
        title="Carousel.PrevTrigger / NextTrigger"
        properties={[
          { name: 'aria-label', type: 'string', description: 'Accessible label for the button.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Trigger size.' },
          { name: 'variant', type: "'surface' | 'ghost' | 'solid'", default: "'surface'", description: 'Trigger visual variant.' },
          { name: 'children', type: 'ReactNode', description: 'Custom icon or content. Falls back to a chevron icon.' },
        ]}
      />

      <DocPage.ApiSection
        title="Carousel.IndicatorGroup"
        properties={[
          { name: 'children', type: 'ReactNode', description: 'Custom Carousel.Indicator elements. Auto-generated when omitted.' },
        ]}
      />

      <DocPage.ApiSection
        title="Carousel.Indicator"
        properties={[
          { name: 'index', type: 'number', description: 'The page index this indicator targets.' },
        ]}
      />
    </DocPage.Root>
  );
}
