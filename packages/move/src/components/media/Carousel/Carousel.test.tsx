// Generated from Carousel.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Carousel } from './Carousel';

// Helper to render a basic Carousel with slides
function renderCarousel(rootProps: Record<string, unknown> = {}, slideCount = 3) {
  return render(
    <Carousel.Root {...rootProps}>
      <Carousel.Viewport>
        {Array.from({ length: slideCount }, (_, i) => (
          <Carousel.Slide key={i}>Slide {i + 1}</Carousel.Slide>
        ))}
      </Carousel.Viewport>
    </Carousel.Root>,
  );
}

describe('Carousel', () => {
  // === Root rendering ===
  describe('root rendering', () => {
    it('renders with role="region" and aria-roledescription="carousel"', () => {
      const { container } = renderCarousel();
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute('role', 'region');
      expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('forwards className on Root', () => {
      const { container } = renderCarousel({ className: 'custom-root' });
      expect(container.firstChild).toHaveClass('custom-root');
    });

    it('forwards style on Root', () => {
      const { container } = renderCarousel({ style: { marginTop: '10px' } });
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });

    it('sets data-orientation on root (defaults to horizontal)', () => {
      const { container } = renderCarousel();
      expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('sets data-orientation to vertical when orientation is vertical', () => {
      const { container } = renderCarousel({ orientation: 'vertical' });
      expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  // === Viewport ===
  describe('viewport', () => {
    it('renders as flex scroll-snap container', () => {
      const { container } = renderCarousel();
      const viewport = container.querySelector('[aria-live]');
      expect(viewport).toBeInTheDocument();
    });

    it('sets data-orientation based on orientation prop', () => {
      const { container } = renderCarousel({ orientation: 'vertical' });
      const viewport = container.querySelector('[aria-live]');
      expect(viewport).toHaveAttribute('data-orientation', 'vertical');
    });

    it('sets data-align based on align prop', () => {
      const { container } = renderCarousel({ align: 'center' });
      const viewport = container.querySelector('[aria-live]');
      expect(viewport).toHaveAttribute('data-align', 'center');
    });

    it('sets data-draggable when draggable is true (default)', () => {
      const { container } = renderCarousel();
      const viewport = container.querySelector('[aria-live]');
      expect(viewport).toHaveAttribute('data-draggable');
    });

    it('has aria-live="polite"', () => {
      const { container } = renderCarousel();
      const viewport = container.querySelector('[aria-live="polite"]');
      expect(viewport).toBeInTheDocument();
    });

    it('forwards className on Viewport', () => {
      const { container } = render(
        <Carousel.Root>
          <Carousel.Viewport className="custom-viewport">
            <Carousel.Slide>Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      const viewport = container.querySelector('[aria-live]');
      expect(viewport).toHaveClass('custom-viewport');
    });

    it('forwards style on Viewport', () => {
      const { container } = render(
        <Carousel.Root>
          <Carousel.Viewport style={{ padding: '5px' }}>
            <Carousel.Slide>Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      const viewport = container.querySelector('[aria-live]');
      expect(viewport).toHaveStyle({ padding: '5px' });
    });

    it('forwards ref on Viewport', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Carousel.Root>
          <Carousel.Viewport ref={ref}>
            <Carousel.Slide>Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Slide ===
  describe('slide', () => {
    it('renders with role="group" and aria-roledescription="slide"', () => {
      renderCarousel();
      const slides = screen.getAllByRole('group');
      expect(slides.length).toBe(3);
      slides.forEach((slide) => {
        expect(slide).toHaveAttribute('aria-roledescription', 'slide');
      });
    });

    it('registers itself on mount (affects page count)', () => {
      const { container } = render(
        <Carousel.Root showIndicators>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      // With 2 slides and 1 per view, there should be 2 indicator buttons
      const indicators = container.querySelectorAll('[role="tablist"] button');
      expect(indicators.length).toBe(2);
    });

    it('forwards className on Slide', () => {
      render(
        <Carousel.Root>
          <Carousel.Viewport>
            <Carousel.Slide className="custom-slide">Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      const slide = screen.getByRole('group');
      expect(slide).toHaveClass('custom-slide');
    });

    it('forwards style on Slide', () => {
      render(
        <Carousel.Root>
          <Carousel.Viewport>
            <Carousel.Slide style={{ background: 'red' }}>Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      const slide = screen.getByRole('group');
      expect(slide).toHaveStyle({ background: 'red' });
    });

    it('forwards ref on Slide', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Carousel.Root>
          <Carousel.Viewport>
            <Carousel.Slide ref={ref}>Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('sets data-orientation on slide', () => {
      render(
        <Carousel.Root orientation="vertical">
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      const slide = screen.getByRole('group');
      expect(slide).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  // === PrevTrigger ===
  describe('PrevTrigger', () => {
    it('defaults aria-label to "Previous slide"', () => {
      render(
        <Carousel.Root>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.PrevTrigger />
        </Carousel.Root>,
      );
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    });

    it('is disabled when canScrollPrev is false (non-loop, first page)', () => {
      render(
        <Carousel.Root defaultPage={0}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.PrevTrigger />
        </Carousel.Root>,
      );
      expect(screen.getByLabelText('Previous slide')).toBeDisabled();
    });

    it('scrolls to previous page on click', () => {
      const onChange = vi.fn();
      render(
        <Carousel.Root defaultPage={1} onPageChange={onChange}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.PrevTrigger />
        </Carousel.Root>,
      );
      fireEvent.click(screen.getByLabelText('Previous slide'));
      expect(onChange).toHaveBeenCalledWith(0);
    });
  });

  // === NextTrigger ===
  describe('NextTrigger', () => {
    it('defaults aria-label to "Next slide"', () => {
      render(
        <Carousel.Root>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.NextTrigger />
        </Carousel.Root>,
      );
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('is disabled when canScrollNext is false (non-loop, last page)', () => {
      render(
        <Carousel.Root defaultPage={1}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.NextTrigger />
        </Carousel.Root>,
      );
      expect(screen.getByLabelText('Next slide')).toBeDisabled();
    });

    it('scrolls to next page on click', () => {
      const onChange = vi.fn();
      render(
        <Carousel.Root defaultPage={0} onPageChange={onChange}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.NextTrigger />
        </Carousel.Root>,
      );
      fireEvent.click(screen.getByLabelText('Next slide'));
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  // === IndicatorGroup ===
  describe('IndicatorGroup', () => {
    it('renders with role="tablist"', () => {
      render(
        <Carousel.Root showIndicators>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('has aria-label "Slide indicators" by default', () => {
      render(
        <Carousel.Root showIndicators>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      expect(screen.getByLabelText('Slide indicators')).toBeInTheDocument();
    });

    it('auto-generates indicators based on pageCount', () => {
      const { container } = render(
        <Carousel.Root showIndicators>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
            <Carousel.Slide>Slide 3</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      const indicators = container.querySelectorAll('[role="tablist"] button');
      expect(indicators.length).toBe(3);
    });
  });

  // === Indicator ===
  describe('Indicator', () => {
    it('renders with role="tab" and aria-selected', () => {
      render(
        <Carousel.Root defaultPage={0}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.IndicatorGroup>
            <Carousel.Indicator index={0} />
            <Carousel.Indicator index={1} />
          </Carousel.IndicatorGroup>
        </Carousel.Root>,
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(2);
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('sets data-active when its index matches current page', () => {
      render(
        <Carousel.Root defaultPage={1}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.IndicatorGroup>
            <Carousel.Indicator index={0} />
            <Carousel.Indicator index={1} />
          </Carousel.IndicatorGroup>
        </Carousel.Root>,
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).not.toHaveAttribute('data-active');
      expect(tabs[1]).toHaveAttribute('data-active');
    });

    it('scrollToPage on click', () => {
      const onChange = vi.fn();
      render(
        <Carousel.Root defaultPage={0} onPageChange={onChange}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.IndicatorGroup>
            <Carousel.Indicator index={0} />
            <Carousel.Indicator index={1} />
          </Carousel.IndicatorGroup>
        </Carousel.Root>,
      );
      fireEvent.click(screen.getAllByRole('tab')[1]);
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  // === Controlled page ===
  describe('controlled page', () => {
    it('controlled page prop drives the active page', () => {
      render(
        <Carousel.Root page={1}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.IndicatorGroup>
            <Carousel.Indicator index={0} />
            <Carousel.Indicator index={1} />
          </Carousel.IndicatorGroup>
        </Carousel.Root>,
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('onPageChange fires when page changes', () => {
      const onPageChange = vi.fn();
      render(
        <Carousel.Root page={0} onPageChange={onPageChange}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.NextTrigger />
        </Carousel.Root>,
      );
      fireEvent.click(screen.getByLabelText('Next slide'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  // === Loop mode ===
  describe('loop mode', () => {
    it('enables wrapping and keeps triggers enabled', () => {
      render(
        <Carousel.Root loop defaultPage={0}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.PrevTrigger />
          <Carousel.NextTrigger />
        </Carousel.Root>,
      );
      // With loop, even at page 0, prev should be enabled
      expect(screen.getByLabelText('Previous slide')).not.toBeDisabled();
      expect(screen.getByLabelText('Next slide')).not.toBeDisabled();
    });
  });

  // === Built-in controls ===
  describe('built-in controls', () => {
    it('showTriggers renders built-in prev/next triggers', () => {
      render(
        <Carousel.Root showTriggers>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('showIndicators renders built-in indicator dots', () => {
      render(
        <Carousel.Root showIndicators>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
        </Carousel.Root>,
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('animations={false} disables scroll animation (instant scroll)', () => {
      // When animations={false}, scrolling should still work (just instant)
      const onChange = vi.fn();
      render(
        <Carousel.Root animations={false} defaultPage={0} onPageChange={onChange}>
          <Carousel.Viewport>
            <Carousel.Slide>Slide 1</Carousel.Slide>
            <Carousel.Slide>Slide 2</Carousel.Slide>
          </Carousel.Viewport>
          <Carousel.NextTrigger />
        </Carousel.Root>,
      );
      fireEvent.click(screen.getByLabelText('Next slide'));
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  describe('autoplay pause/resume', () => {
    it('re-arms autoplay after hover ends (pause then resume)', () => {
      const setIntervalSpy = vi.spyOn(window, 'setInterval');
      try {
        const { container } = renderCarousel({ autoplay: 1000 });
        const viewport = container.querySelector('[aria-live]') as HTMLElement;
        // count only the autoplay interval (delay === 1000), ignore others
        const armCount = () => setIntervalSpy.mock.calls.filter((c) => c[1] === 1000).length;
        expect(armCount()).toBeGreaterThan(0); // armed on mount
        const before = armCount();
        fireEvent.mouseEnter(viewport); // pause — clears the interval
        fireEvent.mouseLeave(viewport); // resume — must RE-ARM (was the bug: no resume)
        expect(armCount()).toBeGreaterThan(before);
      } finally {
        setIntervalSpy.mockRestore();
      }
    });
  });
});
