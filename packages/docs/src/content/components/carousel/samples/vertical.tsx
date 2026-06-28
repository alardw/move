import { Carousel } from 'move';
import { SlideTile } from './_slide';

/**
 * `orientation="vertical"` turns the snap axis sideways. Pair with
 * a fixed-height wrapper so the viewport has somewhere to scroll to —
 * the carousel inherits the wrapper height and clips its slides inside.
 */
export default function VerticalSample() {
  return (
    // recipe-purity-ignore: fixed-height frame so the vertical carousel has somewhere to scroll; no Move height prop
    <div style={{ height: 400 }}>
      <Carousel.Root orientation="vertical" showTriggers showIndicators triggerPlacement="overlay">
        <Carousel.Viewport>
          {Array.from({ length: 5 }).map((_, i) => (
            <Carousel.Slide key={i}>
              <SlideTile index={i} height={400} />
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
      </Carousel.Root>
    </div>
  );
}
