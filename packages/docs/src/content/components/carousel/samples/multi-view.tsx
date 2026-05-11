import { Carousel } from 'move';
import { SlideTile } from './_slide';

/**
 * `slidesPerView` shows multiple slides at once. The scroll-snap still
 * lands on whole pages, so flicks and arrow-key nav move a full set at
 * a time instead of half a slide.
 */
export default function MultiViewSample() {
  return (
    <Carousel.Root slidesPerView={3} showTriggers showIndicators triggerPlacement="bottom">
      <Carousel.Viewport>
        {Array.from({ length: 9 }).map((_, i) => (
          <Carousel.Slide key={i}>
            <SlideTile index={i} height={160} />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
    </Carousel.Root>
  );
}
