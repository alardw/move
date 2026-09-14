import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Illustration } from './Illustration';

/** The drawing a call site would write. */
const drawing = (
  <svg viewBox="0 0 640 360" width="640" height="360" data-testid="drawing">
    <rect className="illustration-panel" x="0" y="0" width="640" height="360" />
  </svg>
);

describe('Illustration', () => {
  describe('structure', () => {
    it("renders the caller's svg untouched", () => {
      render(<Illustration title="A flow">{drawing}</Illustration>);
      const svg = screen.getByTestId('drawing');
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg.getAttribute('viewBox')).toBe('0 0 640 360');
      // The component never rewrites the artwork — an export pastes in whole.
      expect(svg.querySelector('.illustration-panel')).toBeInTheDocument();
    });

    it('renders a figcaption only when a caption is given', () => {
      const { rerender } = render(<Illustration title="A flow">{drawing}</Illustration>);
      expect(document.querySelector('figcaption')).toBeNull();

      rerender(
        <Illustration title="A flow" caption="How a trigger resolves">
          {drawing}
        </Illustration>,
      );
      expect(screen.getByText('How a trigger resolves').tagName.toLowerCase()).toBe('figcaption');
    });

    it('forwards className and style', () => {
      render(
        <Illustration title="A flow" className="custom" style={{ opacity: 0.5 }}>
          {drawing}
        </Illustration>,
      );
      const figure = screen.getByRole('img', { name: 'A flow' }).parentElement!;
      expect(figure).toHaveClass('custom');
      expect(figure).toHaveStyle({ opacity: '0.5' });
    });
  });

  describe('naming', () => {
    it('names the drawing, not the figure', () => {
      render(<Illustration title="A flow">{drawing}</Illustration>);
      const graphic = screen.getByRole('img', { name: 'A flow' });
      expect(graphic.tagName.toLowerCase()).toBe('div');
      // The role collapses the artwork into one node; the figure stays a figure.
      expect(graphic.parentElement?.tagName.toLowerCase()).toBe('figure');
    });

    it('leaves the figure without a role, so a caption is still announced', () => {
      render(
        <Illustration title="A flow" caption="How a trigger resolves">
          {drawing}
        </Illustration>,
      );
      // role="img" on the figure would make its subtree presentational and
      // silence the very text the caption exists to say.
      const figure = screen.getByText('How a trigger resolves').closest('figure')!;
      expect(figure).not.toHaveAttribute('role');
      expect(screen.getByText('How a trigger resolves')).toBeInTheDocument();
    });

    it('points aria-describedby at the description, never aria-labelledby', () => {
      render(
        <Illustration title="A flow" desc="Three steps, left to right.">
          {drawing}
        </Illustration>,
      );
      const graphic = screen.getByRole('img', { name: 'A flow' });
      const describedBy = graphic.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy!)).toHaveTextContent(
        'Three steps, left to right.',
      );
      // A description folded into the name makes one run-on name and no
      // description at all.
      expect(graphic).not.toHaveAttribute('aria-labelledby');
      expect(graphic).toHaveAttribute('aria-label', 'A flow');
    });

    it('renders the description clipped rather than hidden', () => {
      render(
        <Illustration title="A flow" desc="Three steps, left to right.">
          {drawing}
        </Illustration>,
      );
      // `hidden` would drop it from the accessibility tree, leaving
      // aria-describedby pointing at nothing.
      const desc = screen.getByText('Three steps, left to right.');
      expect(desc).not.toHaveAttribute('hidden');
      expect(desc).toBeInTheDocument();
    });
  });

  describe('size', () => {
    it('defaults to auto', () => {
      render(<Illustration title="A flow">{drawing}</Illustration>);
      const figure = screen.getByRole('img', { name: 'A flow' }).parentElement!;
      expect(figure).toHaveAttribute('data-size', 'auto');
    });

    it.each(['sm', 'md', 'lg', 'xl', 'full'] as const)('carries data-size %s', (size) => {
      render(
        <Illustration title="A flow" size={size}>
          {drawing}
        </Illustration>,
      );
      const figure = screen.getByRole('img', { name: 'A flow' }).parentElement!;
      expect(figure).toHaveAttribute('data-size', size);
    });
  });

  describe('animation', () => {
    it('does not move by default', () => {
      render(<Illustration title="A flow">{drawing}</Illustration>);
      const figure = screen.getByRole('img', { name: 'A flow' }).parentElement!;
      // A drawing that staggers every time it appears is noise; opting in is
      // the consumer's call.
      expect(figure.style.transform).toBe('');
    });

    it('keeps stagger and surface attributes on children', () => {
      render(
        <Illustration title="A flow">
          <svg viewBox="0 0 10 10">
            <g data-move-stagger="" data-surface="subtle" data-testid="group">
              <rect className="illustration-panel" />
            </g>
          </svg>
        </Illustration>,
      );
      const group = screen.getByTestId('group');
      // The parent's animation targets these, and data-surface re-resolves the
      // ground tokens for the subtree. Rewriting children would break both.
      expect(group).toHaveAttribute('data-move-stagger');
      expect(group).toHaveAttribute('data-surface', 'subtle');
    });
  });
});
