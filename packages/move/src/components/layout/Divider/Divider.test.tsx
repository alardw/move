// Generated from Divider.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div element with role=separator', () => {
      render(<Divider data-testid="divider" />);
      const el = screen.getByRole('separator');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('renders horizontal orientation by default', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('renders vertical orientation when orientation=vertical', () => {
      render(<Divider orientation="vertical" />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('sets aria-orientation matching orientation prop', () => {
      const { rerender } = render(<Divider />);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');

      rerender(<Divider orientation="vertical" />);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<Divider ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute('role')).toBe('separator');
    });

    it('forwards className and style', () => {
      render(<Divider className="custom" style={{ marginTop: '10px' }} />);
      const el = screen.getByRole('separator');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<Divider data-testid="my-divider" aria-label="section divider" />);
      const el = screen.getByTestId('my-divider');
      expect(el).toHaveAttribute('aria-label', 'section divider');
    });
  });

  // === Line type ===
  describe('line type', () => {
    it('defaults to type=solid', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-type', 'solid');
    });

    it('applies line style via data-type attribute', () => {
      const { rerender } = render(<Divider type="dashed" />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-type', 'dashed');

      rerender(<Divider type="dotted" />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-type', 'dotted');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=sm', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-size', 'sm');
    });

    it('applies data-size attribute', () => {
      const { rerender } = render(<Divider size="md" />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-size', 'md');

      rerender(<Divider size="lg" />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-size', 'lg');
    });

    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(<Divider size={size} />);
      expect(screen.getByRole('separator')).toHaveAttribute('data-size', size);
    });
  });

  // === Alignment ===
  describe('alignment', () => {
    it('defaults to align=center', () => {
      render(<Divider>Label</Divider>);
      expect(screen.getByRole('separator')).toHaveAttribute('data-align', 'center');
    });

    it('sets data-align when children are provided', () => {
      render(<Divider align="left">Label</Divider>);
      expect(screen.getByRole('separator')).toHaveAttribute('data-align', 'left');
    });

    it('omits data-align when no children', () => {
      render(<Divider align="left" />);
      expect(screen.getByRole('separator')).not.toHaveAttribute('data-align');
    });
  });

  // === Content ===
  describe('content', () => {
    it('renders content slot when children are provided', () => {
      render(<Divider>Section</Divider>);
      expect(screen.getByText('Section')).toBeInTheDocument();
    });

    it('does not render content slot when no children', () => {
      render(<Divider data-testid="divider" />);
      const root = screen.getByTestId('divider');
      expect(root.querySelector('span')).toBeNull();
    });

    it('sets data-has-content when children are provided', () => {
      render(<Divider>Label</Divider>);
      expect(screen.getByRole('separator')).toHaveAttribute('data-has-content');
    });

    it('omits data-has-content when no children', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).not.toHaveAttribute('data-has-content');
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('has role=separator on root', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has aria-orientation matching orientation prop', () => {
      render(<Divider orientation="horizontal" />);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('sets aria-orientation=vertical for vertical divider', () => {
      render(<Divider orientation="vertical" />);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<Divider sp={{ root: { className: 'sp-root' } }} />);
      expect(screen.getByRole('separator')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(<Divider sp={{ root: { style: { marginTop: '5px' } } }} />);
      expect(screen.getByRole('separator')).toHaveStyle({ marginTop: '5px' });
    });

    it('merges sp className on content', () => {
      render(<Divider sp={{ content: { className: 'sp-content' } }}>Label</Divider>);
      expect(screen.getByText('Label')).toHaveClass('sp-content');
    });
  });
});
