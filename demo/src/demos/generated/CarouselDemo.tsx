// Generated from Carousel.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Carousel } from 'move';
import type { DemoDefinition } from '../types';

const slideStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
  background: 'var(--move-bg-subtle)',
  borderRadius: 'var(--move-rounded-md)',
  fontSize: 24,
  fontWeight: 600,
};

export const demo: DemoDefinition = {
  id: 'media:Carousel',
  name: 'Carousel',
  category: 'media',
  description: 'Compound scroll-snap carousel with configurable orientation, slides-per-view, autoplay, drag/swipe, and built-in trigger/indicator controls',
  controls: [
    {
      name: 'orientation',
      kind: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      name: 'slidesPerView',
      kind: 'select',
      options: ['1', '2', '3'],
      defaultValue: '1',
    },
    {
      name: 'showTriggers',
      kind: 'toggle',
      defaultValue: true,
    },
    {
      name: 'showIndicators',
      kind: 'toggle',
      defaultValue: true,
    },
    {
      name: 'loop',
      kind: 'toggle',
      defaultValue: false,
    },
  ],
  initialProps: {
    orientation: 'horizontal',
    slidesPerView: '1',
    showTriggers: true,
    showIndicators: true,
    loop: false,
  },
  render: (props) => (
    <Carousel.Root
      orientation={props.orientation as 'horizontal' | 'vertical'}
      slidesPerView={Number(props.slidesPerView)}
      showTriggers={props.showTriggers as boolean}
      showIndicators={props.showIndicators as boolean}
      loop={props.loop as boolean}
    >
      <Carousel.Viewport>
        {[1, 2, 3, 4, 5].map((n) => (
          <Carousel.Slide key={n}>
            <div style={slideStyle}>Slide {n}</div>
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
    </Carousel.Root>
  ),
};
