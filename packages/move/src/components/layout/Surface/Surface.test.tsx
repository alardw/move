// Generated from Surface.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { Surface } from './Surface';
import { useSurface } from '../../../infrastructure/Surface';

/** Reports the tone React context is handing out at this point in the tree. */
function ToneProbe({ id }: { id: string }) {
  const tone = useSurface();
  return <span data-testid={id}>{tone}</span>;
}

describe('Surface', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Surface data-testid="s">content</Surface>);
      expect(screen.getByTestId('s')).toBeInTheDocument();
    });

    it('paints when it renders its own element', () => {
      render(<Surface data-testid="s">x</Surface>);
      expect(screen.getByTestId('s')).toHaveAttribute('data-paint');
    });

    it('forwards ref to root element', () => {
      const ref = React.createRef<HTMLElement>();
      render(<Surface ref={ref}>x</Surface>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('passes className to root', () => {
      render(
        <Surface data-testid="s" className="mine">
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveClass('mine');
    });

    it('passes style to root', () => {
      render(
        <Surface data-testid="s" style={{ opacity: 0.5 }}>
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveStyle({ opacity: '0.5' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Surface data-testid="s" aria-label="panel">
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveAttribute('aria-label', 'panel');
    });
  });

  describe('owning a ground', () => {
    it('takes the alternate of the tone it lands on', () => {
      // Nothing above it provides a tone, so the ambient ground is `base` and
      // the panel standing on it becomes `subtle`.
      render(<Surface data-testid="s">x</Surface>);
      expect(screen.getByTestId('s')).toHaveAttribute('data-surface', 'subtle');
    });

    it('alternates again one level deeper, so nesting keeps a step between grounds', () => {
      render(
        <Surface data-testid="outer">
          <Surface data-testid="inner">
            <Surface data-testid="innermost">x</Surface>
          </Surface>
        </Surface>,
      );
      expect(screen.getByTestId('outer')).toHaveAttribute('data-surface', 'subtle');
      expect(screen.getByTestId('inner')).toHaveAttribute('data-surface', 'base');
      expect(screen.getByTestId('innermost')).toHaveAttribute('data-surface', 'subtle');
    });

    it('provides the resolved tone to descendants', () => {
      // Both halves of owns-surface: the attribute moves the CSS, the provider
      // moves React. A panel with only the attribute leaves anything inside it
      // computing from the ground OUTSIDE, and it steps to the wrong shade.
      render(
        <Surface>
          <ToneProbe id="inside" />
        </Surface>,
      );
      expect(screen.getByTestId('inside')).toHaveTextContent('subtle');
    });

    it('agrees with itself: the attribute and the context report the same tone', () => {
      render(
        <Surface data-testid="s">
          <ToneProbe id="inside" />
        </Surface>,
      );
      expect(screen.getByTestId('inside')).toHaveTextContent(
        screen.getByTestId('s').getAttribute('data-surface')!,
      );
    });
  });

  describe('tone', () => {
    it('pins the ground instead of alternating', () => {
      render(
        <Surface data-testid="s" tone="base">
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveAttribute('data-surface', 'base');
    });

    it('a pinned ground is still provided to descendants', () => {
      render(
        <Surface tone="base">
          <ToneProbe id="inside" />
        </Surface>,
      );
      expect(screen.getByTestId('inside')).toHaveTextContent('base');
    });

    it('alternation resumes from the pinned tone', () => {
      render(
        <Surface tone="base">
          <Surface data-testid="child">x</Surface>
        </Surface>,
      );
      expect(screen.getByTestId('child')).toHaveAttribute('data-surface', 'subtle');
    });
  });

  describe('layout participation', () => {
    it('sets data-fill for fill=parent', () => {
      render(
        <Surface data-testid="s" fill="parent">
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveAttribute('data-fill', 'parent');
    });

    it('sets data-fill for fill=remaining', () => {
      render(
        <Surface data-testid="s" fill="remaining">
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveAttribute('data-fill', 'remaining');
    });

    it('applies flex sizing via data-flex', () => {
      render(
        <Surface data-testid="s" flex={1}>
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveAttribute('data-flex', '1');
    });

    it('claims nothing when neither is set', () => {
      render(<Surface data-testid="s">x</Surface>);
      expect(screen.getByTestId('s')).not.toHaveAttribute('data-fill');
      expect(screen.getByTestId('s')).not.toHaveAttribute('data-flex');
    });
  });

  describe('asChild', () => {
    it('paints the child element and adds no wrapper node', () => {
      const { container } = render(
        <Surface asChild>
          <section data-testid="s">x</section>
        </Surface>,
      );
      const el = screen.getByTestId('s');
      expect(el.tagName).toBe('SECTION');
      expect(el).toHaveAttribute('data-surface', 'subtle');
      // The section IS the root — nothing wrapping it.
      expect(container.firstElementChild).toBe(el);
    });

    it('does not paint the wrapped element — that element already owns its look', () => {
      // Card has a radius and a border, Alert a variant colour, and both expose
      // it as an overridable component token. Two single-class background rules
      // on one element would be settled by stylesheet order.
      render(
        <Surface asChild>
          <section data-testid="s">x</section>
        </Surface>,
      );
      expect(screen.getByTestId('s')).not.toHaveAttribute('data-paint');
    });

    it('keeps its class on the wrapped element, which still carries fill/flex', () => {
      render(
        <Surface asChild>
          <section data-testid="s" className="theirs">
            x
          </section>
        </Surface>,
      );
      const el = screen.getByTestId('s');
      expect(el).toHaveClass('theirs');
      expect(el.className.split(' ').length).toBeGreaterThan(1);
    });

    it('still provides the tone to the wrapped element’s descendants', () => {
      render(
        <Surface asChild>
          <section>
            <ToneProbe id="inside" />
          </section>
        </Surface>,
      );
      expect(screen.getByTestId('inside')).toHaveTextContent('subtle');
    });
  });

  describe('slot props', () => {
    it('merges sp className', () => {
      render(
        <Surface data-testid="s" sp={{ root: { className: 'from-sp' } }}>
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveClass('from-sp');
    });

    it('merges sp style', () => {
      render(
        <Surface data-testid="s" sp={{ root: { style: { opacity: 0.25 } } }}>
          x
        </Surface>,
      );
      expect(screen.getByTestId('s')).toHaveStyle({ opacity: '0.25' });
    });
  });
});
