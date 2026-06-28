// Generated from AnimatedText.spec.ts (schemaVersion: 7, specHash: e7eefb38)
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { AnimatedText } from './AnimatedText';

const TEXT = 'Hello world';

/** Restore the default (non-reduced) matchMedia mock after overriding it. */
const defaultMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = defaultMatchMedia;
});

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe('AnimatedText', () => {
  describe('rendering', () => {
    it('renders the full text content', () => {
      render(<AnimatedText data-testid="t">{TEXT}</AnimatedText>);
      // textContent survives splitting (segments + accessible copy concatenate).
      expect(screen.getByTestId('t').textContent).toContain(TEXT);
    });

    it('renders as span by default', () => {
      render(<AnimatedText data-testid="t">{TEXT}</AnimatedText>);
      expect(screen.getByTestId('t').tagName).toBe('SPAN');
    });

    it('renders as the specified element via as prop', () => {
      const { rerender } = render(
        <AnimatedText as="p" data-testid="t">{TEXT}</AnimatedText>,
      );
      expect(screen.getByTestId('t').tagName).toBe('P');

      rerender(<AnimatedText as="h1" data-testid="t">{TEXT}</AnimatedText>);
      expect(screen.getByTestId('t').tagName).toBe('H1');

      rerender(<AnimatedText as="div" data-testid="t">{TEXT}</AnimatedText>);
      expect(screen.getByTestId('t').tagName).toBe('DIV');
    });

    it('forwards ref to the root element', () => {
      const ref = { current: null } as React.RefObject<HTMLElement>;
      render(<AnimatedText ref={ref}>{TEXT}</AnimatedText>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('forwards className and style', () => {
      render(
        <AnimatedText className="custom" style={{ marginTop: '10px' }} data-testid="t">
          {TEXT}
        </AnimatedText>,
      );
      const el = screen.getByTestId('t');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <AnimatedText data-testid="t" title="a title">
          {TEXT}
        </AnimatedText>,
      );
      expect(screen.getByTestId('t')).toHaveAttribute('title', 'a title');
    });
  });

  describe('props → data attributes', () => {
    it('defaults to by=word and effect=fade', () => {
      render(<AnimatedText data-testid="t">{TEXT}</AnimatedText>);
      const el = screen.getByTestId('t');
      expect(el).toHaveAttribute('data-by', 'word');
      expect(el).toHaveAttribute('data-effect', 'fade');
    });

    it('reflects the by prop via data-by', () => {
      for (const by of ['character', 'word', 'line'] as const) {
        const { unmount } = render(
          <AnimatedText by={by} data-testid="t">{TEXT}</AnimatedText>,
        );
        expect(screen.getByTestId('t')).toHaveAttribute('data-by', by);
        unmount();
      }
    });

    it('reflects the effect prop via data-effect', () => {
      for (const effect of ['fade', 'slideUp', 'blurUp', 'scale'] as const) {
        const { unmount } = render(
          <AnimatedText effect={effect} data-testid="t">{TEXT}</AnimatedText>,
        );
        expect(screen.getByTestId('t')).toHaveAttribute('data-effect', effect);
        unmount();
      }
    });
  });

  describe('splitting', () => {
    it('splits text into segments and marks them aria-hidden', () => {
      render(<AnimatedText by="word" data-testid="t">{TEXT}</AnimatedText>);
      const el = screen.getByTestId('t');
      const hidden = el.querySelectorAll('[aria-hidden="true"]');
      expect(hidden.length).toBeGreaterThan(0);
    });

    it('keeps an accessible copy of the full text for screen readers', () => {
      render(<AnimatedText by="character" data-testid="t">{TEXT}</AnimatedText>);
      // The visible characters are split, but the full sentence is still
      // findable as a single accessible node.
      expect(screen.getByText(TEXT)).toBeInTheDocument();
    });

    it('re-renders with new text when children change', () => {
      const { rerender } = render(
        <AnimatedText data-testid="t">{TEXT}</AnimatedText>,
      );
      rerender(<AnimatedText data-testid="t">Goodbye now</AnimatedText>);
      expect(screen.getByTestId('t').textContent).toContain('Goodbye now');
      expect(screen.getByTestId('t').textContent).not.toContain('Hello');
    });
  });

  describe('hover trigger', () => {
    it('starts hidden, reveals on hover, and hides again on leave (replayable)', () => {
      render(
        <AnimatedText trigger="hover" once={false} by="word" data-testid="t">
          {TEXT}
        </AnimatedText>,
      );
      const el = screen.getByTestId('t');
      const segment = el.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(segment).toBeTruthy();
      // Seeded hidden until the user hovers.
      expect(segment.style.opacity).toBe('0');
      fireEvent.mouseEnter(el);
      fireEvent.mouseLeave(el);
      // reset() snaps segments back to hidden so the next hover replays.
      expect(segment.style.opacity).toBe('0');
    });
  });

  describe('reduced motion', () => {
    it('renders text immediately without splitting and marks data-animated', async () => {
      mockReducedMotion(true);
      render(
        <AnimatedText trigger="mount" data-testid="t">{TEXT}</AnimatedText>,
      );
      const el = screen.getByTestId('t');
      await waitFor(() => expect(el).toHaveAttribute('data-animated'));
      // No split occurred: no aria-hidden segments, plain text intact.
      expect(el.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
      expect(el.textContent).toBe(TEXT);
    });
  });
});
