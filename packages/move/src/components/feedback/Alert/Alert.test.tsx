// Generated from Alert.spec.ts (schemaVersion: 6, specHash: b9fbaaa9)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Alert>Test alert</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with role=alert', () => {
      render(<Alert>Content</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<Alert ref={ref}>Content</Alert>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute('role')).toBe('alert');
    });

    it('passes className to root', () => {
      render(<Alert className="custom">Content</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('custom');
    });

    it('passes style to root', () => {
      render(
        <Alert animations={false} style={{ marginTop: '10px' }}>
          Content
        </Alert>,
      );
      expect(screen.getByRole('alert')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<Alert data-testid="my-alert">Content</Alert>);
      expect(screen.getByTestId('my-alert')).toBeInTheDocument();
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('defaults to variant=info', () => {
      render(<Alert>Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'info');
    });

    it('applies variant via data-variant attribute', () => {
      const { rerender } = render(<Alert variant="success">Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'success');

      rerender(<Alert variant="warning">Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'warning');

      rerender(<Alert variant="danger">Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'danger');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=md', () => {
      render(<Alert>Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-size', 'md');
    });

    it('applies size via data-size attribute', () => {
      const { rerender } = render(<Alert size="sm">Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-size', 'sm');

      rerender(<Alert size="lg">Content</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-size', 'lg');
    });
  });

  // === Icon ===
  describe('icon', () => {
    it('shows default icon per variant', () => {
      render(<Alert>Content</Alert>);
      const icon = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('shows custom icon when icon prop is a string', () => {
      render(<Alert icon="star">Content</Alert>);
      const icon = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('hides icon when icon=false', () => {
      render(<Alert icon={false}>Content</Alert>);
      const icon = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(icon).not.toBeInTheDocument();
    });
  });

  // === Title and description ===
  describe('content', () => {
    it('renders title when provided', () => {
      render(<Alert title="My Title">Description</Alert>);
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('renders children as description', () => {
      render(<Alert>Description text</Alert>);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  // === Close button ===
  describe('close button', () => {
    it('shows close button when closable=true', () => {
      render(<Alert closable>Content</Alert>);
      expect(screen.getByRole('button', { name: 'Close alert' })).toBeInTheDocument();
    });

    it('does not show close button by default', () => {
      render(<Alert>Content</Alert>);
      expect(screen.queryByRole('button', { name: 'Close alert' })).not.toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
      const onClose = vi.fn();
      render(
        <Alert closable onClose={onClose} animations={false}>
          Content
        </Alert>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Close alert' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('hides after close when animations=false', () => {
      render(
        <Alert closable animations={false}>
          Content
        </Alert>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Close alert' }));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('has role=alert on root', () => {
      render(<Alert>Content</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('icon has aria-hidden=true', () => {
      render(<Alert>Content</Alert>);
      const icon = screen.getByRole('alert').querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('close button has aria-label', () => {
      render(<Alert closable>Content</Alert>);
      const closeBtn = screen.getByRole('button', { name: 'Close alert' });
      expect(closeBtn).toHaveAttribute('aria-label', 'Close alert');
    });

    it('supports custom close label via labels prop', () => {
      render(
        <Alert closable labels={{ close: 'Dismiss' }}>
          Content
        </Alert>,
      );
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('accepts animations=false to disable all animation', () => {
      render(<Alert animations={false}>Content</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<Alert sp={{ root: { className: 'sp-root' } }}>Content</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Alert animations={false} sp={{ root: { style: { marginTop: '5px' } } }}>
          Content
        </Alert>,
      );
      expect(screen.getByRole('alert')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
