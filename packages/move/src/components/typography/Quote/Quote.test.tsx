// Generated from Quote.spec.ts
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { Quote } from './Quote';

describe('Quote', () => {
  describe('rendering', () => {
    it('renders a bare <blockquote> as root when there is no attribution', () => {
      const { container } = render(<Quote>Stay hungry.</Quote>);
      expect(container.firstElementChild?.tagName).toBe('BLOCKQUOTE');
      expect(container.querySelector('figure')).toBeNull();
      expect(container.querySelector('figcaption')).toBeNull();
    });

    it('renders children as the quote text', () => {
      const { container } = render(<Quote>Stay hungry.</Quote>);
      expect(container.querySelector('blockquote')).toHaveTextContent('Stay hungry.');
    });

    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLElement>();
      render(<Quote ref={ref}>Q</Quote>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('BLOCKQUOTE');
    });

    it('passes className to the root', () => {
      const { container } = render(<Quote className="custom">Q</Quote>);
      expect(container.firstElementChild).toHaveClass('custom');
    });

    it('passes style to the root', () => {
      const { container } = render(<Quote style={{ opacity: 0.5 }}>Q</Quote>);
      expect(container.firstElementChild).toHaveStyle({ opacity: '0.5' });
    });

    it('spreads HTML attributes onto the root', () => {
      const { container } = render(<Quote data-testid="q">Q</Quote>);
      expect(container.firstElementChild).toHaveAttribute('data-testid', 'q');
    });
  });

  describe('attribution', () => {
    it('wraps the blockquote in a <figure> with a <figcaption> when attribution is provided', () => {
      const { container } = render(<Quote attribution="— Claude">Q</Quote>);
      const figure = container.querySelector('figure');
      expect(figure).not.toBeNull();
      expect(figure?.querySelector('blockquote')).not.toBeNull();
      expect(figure?.querySelector('figcaption')).not.toBeNull();
    });

    it('renders attribution in the <figcaption>, OUTSIDE the <blockquote>', () => {
      const { container } = render(<Quote attribution="— Claude">Q</Quote>);
      expect(container.querySelector('figcaption')).toHaveTextContent('— Claude');
      expect(container.querySelector('blockquote')).not.toHaveTextContent('— Claude');
    });

    it('makes the <figure> the root — ref and className land on it', () => {
      const ref = createRef<HTMLElement>();
      const { container } = render(
        <Quote ref={ref} className="custom" attribution="— A">
          Q
        </Quote>,
      );
      expect(ref.current?.tagName).toBe('FIGURE');
      expect(container.firstElementChild).toHaveClass('custom');
    });
  });

  describe('cite', () => {
    it('sets the cite attribute on the <blockquote> when provided', () => {
      const { container } = render(<Quote cite="https://example.com">Q</Quote>);
      expect(container.querySelector('blockquote')).toHaveAttribute('cite', 'https://example.com');
    });

    it('omits the cite attribute when not provided', () => {
      const { container } = render(<Quote>Q</Quote>);
      expect(container.querySelector('blockquote')).not.toHaveAttribute('cite');
    });
  });

  describe('variant', () => {
    it('defaults to variant=block via data-variant', () => {
      const { container } = render(<Quote>Q</Quote>);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'block');
    });

    it('applies variant=pull via data-variant', () => {
      const { container } = render(<Quote variant="pull">Q</Quote>);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'pull');
    });
  });

  describe('quote-mark icon', () => {
    it('renders the decorative quote-mark by default, aria-hidden', () => {
      const { container } = render(<Quote>Q</Quote>);
      const mark = container.querySelector('[aria-hidden="true"]');
      expect(mark).not.toBeNull();
      expect(mark?.querySelector('svg')).not.toBeNull();
    });

    it('omits the quote-mark when icon={false}', () => {
      const { container } = render(<Quote icon={false}>Q</Quote>);
      expect(container.querySelector('svg')).toBeNull();
    });
  });
});
