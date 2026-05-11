import { Carousel } from 'move';
import { SlideTile } from './_slide';

/**
 * `autoplay` advances pages on an interval (in ms). Combined with
 * `loop`, the carousel rotates indefinitely — useful for hero
 * banners and product tours that don’t need a manual operator.
 */
export default function AutoplaySample() {
  return (
    <Carousel.Root autoplay={3000} loop showIndicators triggerPlacement="overlay" overlayHideUntilHover>
      <Carousel.Viewport>
        {['Welcome', 'New tools', 'Smarter sync', 'Built for teams', 'Get started'].map((label, i) => (
          <Carousel.Slide key={i}>
            <SlideTile index={i} label={label} height={220} />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
    </Carousel.Root>
  );
}
