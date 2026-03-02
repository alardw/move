// Generated from Textarea.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders root div with textarea element inside', () => {
      render(<Textarea placeholder="test" />);
      const ta = screen.getByPlaceholderText('test');
      expect(ta.tagName).toBe('TEXTAREA');
      expect(ta.closest('div')).toBeTruthy();
    });

    it('defaults rows to 3', () => {
      render(<Textarea placeholder="test" />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('rows', '3');
    });

    it('forwards ref to the native textarea element', () => {
      const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>;
      render(<Textarea ref={ref} placeholder="test" />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current).toBe(screen.getByPlaceholderText('test'));
    });

    it('spreads HTML attributes onto the native textarea', () => {
      render(<Textarea placeholder="test" data-testid="my-ta" aria-label="Description" />);
      const ta = screen.getByPlaceholderText('test');
      expect(ta).toHaveAttribute('data-testid', 'my-ta');
      expect(ta).toHaveAttribute('aria-label', 'Description');
    });

    it('forwards className and style on root', () => {
      render(<Textarea placeholder="test" className="custom" style={{ margin: 8 }} />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies variant via data-variant attribute', () => {
      const { rerender } = render(<Textarea placeholder="test" variant="outlined" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-variant', 'outlined');

      rerender(<Textarea placeholder="test" variant="filled" />);
      expect(root).toHaveAttribute('data-variant', 'filled');
    });

    it('defaults to variant=outlined', () => {
      render(<Textarea placeholder="test" />);
      expect(screen.getByPlaceholderText('test').closest('div')!).toHaveAttribute('data-variant', 'outlined');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies size via data-size attribute', () => {
      const { rerender } = render(<Textarea placeholder="test" size="sm" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-size', 'sm');

      rerender(<Textarea placeholder="test" size="lg" />);
      expect(root).toHaveAttribute('data-size', 'lg');
    });

    it('defaults to size=md', () => {
      render(<Textarea placeholder="test" />);
      expect(screen.getByPlaceholderText('test').closest('div')!).toHaveAttribute('data-size', 'md');
    });
  });

  // === Resize ===
  describe('resize', () => {
    it('defaults resize to vertical', () => {
      render(<Textarea placeholder="test" />);
      expect(screen.getByPlaceholderText('test').style.resize).toBe('vertical');
    });

    it('applies resize prop as inline style', () => {
      render(<Textarea placeholder="test" resize="both" />);
      expect(screen.getByPlaceholderText('test').style.resize).toBe('both');
    });
  });

  // === Behavior ===
  describe('behavior', () => {
    it('clicking root focuses the native textarea', () => {
      render(<Textarea placeholder="test" />);
      const ta = screen.getByPlaceholderText('test');
      const root = ta.closest('div')!;
      fireEvent.click(root);
      expect(document.activeElement).toBe(ta);
    });

    it('applies width as inline style on root when provided', () => {
      render(<Textarea placeholder="test" width="400px" />);
      expect(screen.getByPlaceholderText('test').closest('div')!.style.width).toBe('400px');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid on root when invalid=true', () => {
      render(<Textarea placeholder="test" invalid />);
      expect(screen.getByPlaceholderText('test').closest('div')!).toHaveAttribute('data-invalid');
    });

    it('sets data-disabled on root when disabled=true', () => {
      render(<Textarea placeholder="test" disabled />);
      expect(screen.getByPlaceholderText('test').closest('div')!).toHaveAttribute('data-disabled');
    });

    it('sets data-readonly on root when readOnly=true', () => {
      render(<Textarea placeholder="test" readOnly />);
      expect(screen.getByPlaceholderText('test').closest('div')!).toHaveAttribute('data-readonly');
    });

    it('disabled textarea is actually disabled', () => {
      render(<Textarea placeholder="test" disabled />);
      expect(screen.getByPlaceholderText('test')).toBeDisabled();
    });
  });

  // === AutoSize ===
  describe('autoSize', () => {
    it('autoSize forces resize to none', () => {
      render(<Textarea placeholder="test" autoSize />);
      expect(screen.getByPlaceholderText('test').style.resize).toBe('none');
    });

    it('autoSize uses minRows for initial rows attribute', () => {
      render(<Textarea placeholder="test" autoSize minRows={2} />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('rows', '2');
    });

    it('autoSize falls back to rows when minRows is not set', () => {
      render(<Textarea placeholder="test" autoSize rows={5} />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('rows', '5');
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('native textarea provides implicit ARIA role', () => {
      render(<Textarea placeholder="test" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('label association works via id/htmlFor or aria-label', () => {
      render(
        <>
          <label htmlFor="desc-input">Description</label>
          <Textarea id="desc-input" placeholder="test" />
        </>
      );
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });
  });

  // === Form integration ===
  describe('form', () => {
    it('textarea participates in native form submission via name attribute', () => {
      render(<Textarea placeholder="test" name="description" />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('name', 'description');
    });

    it('value is read from native textarea element', () => {
      render(<Textarea placeholder="test" defaultValue="hello" />);
      expect(screen.getByPlaceholderText('test')).toHaveValue('hello');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<Textarea placeholder="test" sp={{ root: { className: 'sp-root' } }} />);
      expect(screen.getByPlaceholderText('test').closest('div')!.className).toContain('sp-root');
    });
  });
});
