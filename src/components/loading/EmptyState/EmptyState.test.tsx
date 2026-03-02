// Generated from EmptyState.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div element', () => {
      render(<EmptyState data-testid="empty">Content</EmptyState>);
      const el = screen.getByTestId('empty');
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<EmptyState ref={ref}>Content</EmptyState>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <EmptyState className="custom" style={{ marginTop: '10px' }} data-testid="empty">
          Content
        </EmptyState>
      );
      const el = screen.getByTestId('empty');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<EmptyState data-testid="empty" aria-label="empty state">Content</EmptyState>);
      expect(screen.getByTestId('empty')).toHaveAttribute('aria-label', 'empty state');
    });

    it('renders children after structured slots', () => {
      render(
        <EmptyState title="Title" data-testid="empty">
          <span data-testid="child">Extra</span>
        </EmptyState>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  // === Icon ===
  describe('icon', () => {
    it('renders icon when icon prop is provided', () => {
      render(<EmptyState icon="image-off" data-testid="empty" />);
      const icon = screen.getByTestId('empty').querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('does not render icon slot when icon prop is omitted', () => {
      render(<EmptyState data-testid="empty" />);
      const icon = screen.getByTestId('empty').querySelector('[aria-hidden="true"]');
      expect(icon).not.toBeInTheDocument();
    });

    it('icon has aria-hidden="true"', () => {
      render(<EmptyState icon="image-off" data-testid="empty" />);
      const icon = screen.getByTestId('empty').querySelector('[aria-hidden="true"]');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === Title ===
  describe('title', () => {
    it('renders title when title prop is provided', () => {
      render(<EmptyState title="No items" data-testid="empty" />);
      expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('does not render title slot when title prop is omitted', () => {
      render(<EmptyState data-testid="empty" />);
      const el = screen.getByTestId('empty');
      // Should have no child divs when no props set
      expect(el.children.length).toBe(0);
    });
  });

  // === Description ===
  describe('description', () => {
    it('renders description when description prop is provided', () => {
      render(<EmptyState description="Nothing here yet" data-testid="empty" />);
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    it('does not render description slot when description prop is omitted', () => {
      render(<EmptyState title="Title" data-testid="empty" />);
      expect(screen.queryByText('Nothing here yet')).not.toBeInTheDocument();
    });
  });

  // === Action ===
  describe('action', () => {
    it('renders action when action prop is provided', () => {
      render(
        <EmptyState action={<button>Add</button>} data-testid="empty" />
      );
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('does not render action slot when action prop is omitted', () => {
      render(<EmptyState title="Title" data-testid="empty" />);
      // Only title div should be present
      const el = screen.getByTestId('empty');
      expect(el.children.length).toBe(1);
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=md', () => {
      render(<EmptyState data-testid="empty" />);
      expect(screen.getByTestId('empty')).toHaveAttribute('data-size', 'md');
    });

    it('applies size via data-size attribute', () => {
      render(<EmptyState size="lg" data-testid="empty" />);
      expect(screen.getByTestId('empty')).toHaveAttribute('data-size', 'lg');
    });

    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(<EmptyState size={size} data-testid="empty" />);
      expect(screen.getByTestId('empty')).toHaveAttribute('data-size', size);
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <EmptyState sp={{ root: { className: 'sp-root' } }} data-testid="empty" />
      );
      expect(screen.getByTestId('empty')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <EmptyState sp={{ root: { style: { marginTop: '5px' } } }} data-testid="empty" />
      );
      expect(screen.getByTestId('empty')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
