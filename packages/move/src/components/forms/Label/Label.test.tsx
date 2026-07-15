// Generated from Label.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as a native label element via Radix Label.Root', () => {
      render(<Label>Name</Label>);
      const el = screen.getByText('Name');
      expect(el.tagName).toBe('LABEL');
    });

    it('renders children as label text', () => {
      render(<Label>Email address</Label>);
      expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLLabelElement | null>;
      render(<Label ref={ref as any}>Name</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it('forwards className and style', () => {
      render(
        <Label className="custom" style={{ color: 'red' }}>
          Name
        </Label>,
      );
      const el = screen.getByText('Name');
      expect(el.className).toContain('custom');
      expect(el.style.color).toBe('red');
    });

    it('spreads HTML attributes', () => {
      render(<Label data-testid="my-label">Name</Label>);
      expect(screen.getByTestId('my-label')).toBeInTheDocument();
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies size via data-size attribute (sm, md, lg)', () => {
      const { rerender } = render(<Label size="sm">Name</Label>);
      const el = screen.getByText('Name');
      expect(el).toHaveAttribute('data-size', 'sm');

      rerender(<Label size="lg">Name</Label>);
      expect(el).toHaveAttribute('data-size', 'lg');
    });

    it('defaults size to md', () => {
      render(<Label>Name</Label>);
      expect(screen.getByText('Name')).toHaveAttribute('data-size', 'md');
    });
  });

  // === Required asterisk ===
  describe('required asterisk', () => {
    it('shows asterisk (*) when required=true', () => {
      render(<Label required>Name</Label>);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('hides asterisk when required is not set', () => {
      render(<Label>Name</Label>);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('asterisk has aria-hidden="true"', () => {
      render(<Label required>Name</Label>);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === Disabled ===
  describe('disabled', () => {
    it('sets data-disabled when disabled=true', () => {
      render(<Label disabled>Name</Label>);
      expect(screen.getByText('Name')).toHaveAttribute('data-disabled');
    });

    it('does not set data-disabled when disabled is not set', () => {
      render(<Label>Name</Label>);
      expect(screen.getByText('Name')).not.toHaveAttribute('data-disabled');
    });
  });

  // === htmlFor ===
  describe('htmlFor', () => {
    it('passes htmlFor to the underlying label element', () => {
      render(<Label htmlFor="email-input">Email</Label>);
      expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<Label sp={{ root: { className: 'sp-root' } }}>Name</Label>);
      expect(screen.getByText('Name').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(<Label sp={{ root: { style: { margin: '4px' } } }}>Name</Label>);
      expect(screen.getByText('Name').style.margin).toBe('4px');
    });
  });
});
