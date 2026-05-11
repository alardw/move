import { Carousel, Stack } from 'move';
import { SlideTile } from './_slide';

/**
 * Skip the built-in `showTriggers` / `showIndicators` and compose
 * your own controls when the layout demands it — a row of triggers
 * above the viewport with indicators tucked between them.
 */
export default function ComposedSample() {
  return (
    <Carousel.Root>
      <Stack gap="md">
        <Stack direction="row" gap="sm" align="center" justify="between">
          <Carousel.PrevTrigger />
          <Carousel.IndicatorGroup />
          <Carousel.NextTrigger />
        </Stack>
        <Carousel.Viewport>
          {Array.from({ length: 5 }).map((_, i) => (
            <Carousel.Slide key={i}>
              <SlideTile index={i} />
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
      </Stack>
    </Carousel.Root>
  );
}
