import { Carousel } from 'move';
import { SlideTile } from './_slide';

export default function BasicSample() {
  return (
    <Carousel.Root showTriggers showIndicators>
      <Carousel.Viewport>
        {Array.from({ length: 5 }).map((_, i) => (
          <Carousel.Slide key={i}>
            <SlideTile index={i} />
          </Carousel.Slide>
        ))}
      </Carousel.Viewport>
    </Carousel.Root>
  );
}
