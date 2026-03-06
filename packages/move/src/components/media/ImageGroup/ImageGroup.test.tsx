// Generated from ImageGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageGroup } from './ImageGroup';

describe('ImageGroup', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <ImageGroup>
          <div>Item 1</div>
          <div>Item 2</div>
        </ImageGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders children inside the grid', () => {
      render(
        <ImageGroup>
          <div>Item 1</div>
          <div>Item 2</div>
        </ImageGroup>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('wraps root in a container-query wrapper element', () => {
      const { container } = render(
        <ImageGroup>
          <div>Child</div>
        </ImageGroup>
      );
      // The outermost element should be the wrapper
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Root should be inside the wrapper
      expect(wrapper.firstChild).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className to root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} className="custom">
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveClass('custom');
    });

    it('forwards style to root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} style={{ marginTop: '10px' }}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} data-testid="my-grid">
          <div>Child</div>
        </ImageGroup>
      );
      expect(screen.getByTestId('my-grid')).toBeInTheDocument();
    });
  });

  // === Columns ===
  describe('columns', () => {
    it('defaults columns to 3', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveAttribute('data-columns', '3');
    });

    it('sets --move-imagegroup-columns CSS variable on root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} columns={4}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current?.style.getPropertyValue('--move-imagegroup-columns')).toBe('4');
    });

    it('applies data-columns attribute on root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} columns={5}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveAttribute('data-columns', '5');
    });
  });

  // === Gap ===
  describe('gap', () => {
    it('applies data-gap attribute on root (defaults to md)', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveAttribute('data-gap', 'md');
    });

    it('applies custom gap value', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} gap="lg">
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveAttribute('data-gap', 'lg');
    });
  });

  // === Radius ===
  describe('radius', () => {
    it('applies data-radius attribute on root when provided', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} radius="md">
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveAttribute('data-radius', 'md');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} sp={{ root: { className: 'sp-root' } }}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ImageGroup ref={ref} sp={{ root: { style: { marginTop: '5px' } } }}>
          <div>Child</div>
        </ImageGroup>
      );
      expect(ref.current).toHaveStyle({ marginTop: '5px' });
    });
  });
});
