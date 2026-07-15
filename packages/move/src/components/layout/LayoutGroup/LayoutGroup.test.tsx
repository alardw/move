// Generated from LayoutGroup.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LayoutGroup } from './LayoutGroup';

// Note: the FLIP animation itself (reposition / enter / exit) depends on real
// layout + a MutationObserver firing before paint, neither of which jsdom
// provides meaningfully. These tests cover the rendered contract; the animation
// path is exercised manually + in the docs sample.

describe('LayoutGroup', () => {
  describe('rendering', () => {
    it('renders its children', () => {
      render(
        <LayoutGroup data-testid="lg">
          <div>a</div>
          <div>b</div>
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').children).toHaveLength(2);
    });

    it('renders as a div by default', () => {
      render(<LayoutGroup data-testid="lg">x</LayoutGroup>);
      expect(screen.getByTestId('lg').tagName).toBe('DIV');
    });

    it('renders as the specified element via as prop', () => {
      const { rerender } = render(
        <LayoutGroup as="ul" data-testid="lg">
          x
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').tagName).toBe('UL');

      rerender(
        <LayoutGroup as="ol" data-testid="lg">
          x
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').tagName).toBe('OL');

      rerender(
        <LayoutGroup as="section" data-testid="lg">
          x
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').tagName).toBe('SECTION');
    });

    it('forwards ref to the root element', () => {
      const ref = { current: null } as React.RefObject<HTMLElement>;
      render(<LayoutGroup ref={ref}>x</LayoutGroup>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('forwards className and style', () => {
      render(
        <LayoutGroup className="custom" style={{ marginTop: '10px' }} data-testid="lg">
          x
        </LayoutGroup>,
      );
      const el = screen.getByTestId('lg');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <LayoutGroup data-testid="lg" aria-label="grid">
          x
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg')).toHaveAttribute('aria-label', 'grid');
    });
  });

  describe('props → data attributes', () => {
    it('defaults to fade-scale enter and exit', () => {
      render(<LayoutGroup data-testid="lg">x</LayoutGroup>);
      const el = screen.getByTestId('lg');
      expect(el).toHaveAttribute('data-enter', 'fade-scale');
      expect(el).toHaveAttribute('data-exit', 'fade-scale');
    });

    it('reflects enter and exit props', () => {
      render(
        <LayoutGroup enter="fade" exit="none" data-testid="lg">
          x
        </LayoutGroup>,
      );
      const el = screen.getByTestId('lg');
      expect(el).toHaveAttribute('data-enter', 'fade');
      expect(el).toHaveAttribute('data-exit', 'none');
    });
  });

  describe('disabled', () => {
    it('renders normally when disabled and children change without crashing', () => {
      const { rerender } = render(
        <LayoutGroup disabled data-testid="lg">
          <div key="a">a</div>
          <div key="b">b</div>
        </LayoutGroup>,
      );
      rerender(
        <LayoutGroup disabled data-testid="lg">
          <div key="b">b</div>
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').children).toHaveLength(1);
    });
  });

  describe('layout changes', () => {
    it('reflects added and removed children in the DOM', () => {
      const { rerender } = render(
        <LayoutGroup data-testid="lg">
          <div key="a">a</div>
          <div key="b">b</div>
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').children).toHaveLength(2);

      rerender(
        <LayoutGroup data-testid="lg">
          <div key="a">a</div>
          <div key="b">b</div>
          <div key="c">c</div>
        </LayoutGroup>,
      );
      expect(screen.getByTestId('lg').textContent).toContain('c');
    });
  });
});
