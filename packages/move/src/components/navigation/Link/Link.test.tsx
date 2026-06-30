// Generated from Link.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as anchor element', () => {
      render(<Link data-testid="link">Click me</Link>);
      const el = screen.getByTestId('link');
      expect(el.tagName).toBe('A');
    });

    it('renders children content', () => {
      render(<Link>Click me</Link>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLAnchorElement>;
      render(<Link ref={ref}>Link</Link>);
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it('forwards className and style', () => {
      render(
        <Link className="custom" style={{ marginTop: '10px' }} data-testid="link">
          Link
        </Link>,
      );
      const el = screen.getByTestId('link');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Link data-testid="link" aria-label="home link" href="/home">
          Link
        </Link>,
      );
      const el = screen.getByTestId('link');
      expect(el).toHaveAttribute('aria-label', 'home link');
      expect(el).toHaveAttribute('href', '/home');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('defaults to variant=default', () => {
      render(<Link data-testid="link">Link</Link>);
      expect(screen.getByTestId('link')).toHaveAttribute('data-variant', 'default');
    });

    it('applies variant via data-variant attribute', () => {
      render(
        <Link variant="muted" data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveAttribute('data-variant', 'muted');
    });

    it.each(['default', 'muted', 'subtle'] as const)('supports variant=%s', (variant) => {
      render(
        <Link variant={variant} data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveAttribute('data-variant', variant);
    });
  });

  // === Underline ===
  describe('underline', () => {
    it('defaults to underline=hover', () => {
      render(<Link data-testid="link">Link</Link>);
      expect(screen.getByTestId('link')).toHaveAttribute('data-underline', 'hover');
    });

    it('applies underline via data-underline attribute', () => {
      render(
        <Link underline="always" data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveAttribute('data-underline', 'always');
    });

    it.each(['always', 'hover', 'none'] as const)('supports underline=%s', (underline) => {
      render(
        <Link underline={underline} data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveAttribute('data-underline', underline);
    });
  });

  // === Size ===
  describe('size', () => {
    it('applies size via data-size attribute when provided', () => {
      render(
        <Link size="lg" data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveAttribute('data-size', 'lg');
    });

    it('omits data-size when size prop is not provided', () => {
      render(<Link data-testid="link">Link</Link>);
      expect(screen.getByTestId('link')).not.toHaveAttribute('data-size');
    });

    it.each(['xs', 'sm', 'base', 'lg', 'xl'] as const)('supports size=%s', (size) => {
      render(
        <Link size={size} data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveAttribute('data-size', size);
    });
  });

  // === External ===
  describe('external', () => {
    it('adds target=_blank and rel=noopener noreferrer when external=true', () => {
      render(
        <Link external data-testid="link" href="https://example.com">
          External
        </Link>,
      );
      const el = screen.getByTestId('link');
      expect(el).toHaveAttribute('target', '_blank');
      expect(el).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add target or rel when external is not set', () => {
      render(
        <Link data-testid="link" href="/internal">
          Internal
        </Link>,
      );
      const el = screen.getByTestId('link');
      expect(el).not.toHaveAttribute('target');
      expect(el).not.toHaveAttribute('rel');
    });
  });

  // === asChild ===
  describe('asChild', () => {
    it('renders as child via asChild using Radix Slot', () => {
      render(
        <Link asChild data-testid="link">
          <button type="button">Custom trigger</button>
        </Link>,
      );
      const el = screen.getByTestId('link');
      expect(el.tagName).toBe('BUTTON');
      expect(el).toHaveTextContent('Custom trigger');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Link sp={{ root: { className: 'sp-root' } }} data-testid="link">
          Link
        </Link>,
      );
      expect(screen.getByTestId('link')).toHaveClass('sp-root');
    });
  });
});
