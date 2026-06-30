// Generated from InputText.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputText } from './InputText';

describe('InputText', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders root div with input element inside', () => {
      render(<InputText placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input.tagName).toBe('INPUT');
      expect(input.closest('div')).toBeTruthy();
    });

    it('defaults type to text', () => {
      render(<InputText placeholder="test" />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('type', 'text');
    });

    it('forwards ref to the native input element', () => {
      const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
      render(<InputText ref={ref as any} placeholder="test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toBe(screen.getByPlaceholderText('test'));
    });

    it('spreads HTML attributes onto the native input', () => {
      render(<InputText placeholder="test" data-testid="my-input" aria-label="Name" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveAttribute('data-testid', 'my-input');
      expect(input).toHaveAttribute('aria-label', 'Name');
    });

    it('forwards className and style on root', () => {
      render(<InputText placeholder="test" className="custom" style={{ margin: 8 }} />);
      const input = screen.getByPlaceholderText('test');
      const root = input.closest('div')!;
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies variant via data-variant attribute (outlined, filled)', () => {
      const { rerender } = render(<InputText placeholder="test" variant="outlined" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-variant', 'outlined');

      rerender(<InputText placeholder="test" variant="filled" />);
      expect(root).toHaveAttribute('data-variant', 'filled');
    });

    it('defaults to variant=outlined', () => {
      render(<InputText placeholder="test" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-variant', 'outlined');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies size via data-size attribute (sm, md, lg)', () => {
      const { rerender } = render(<InputText placeholder="test" size="sm" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-size', 'sm');

      rerender(<InputText placeholder="test" size="lg" />);
      expect(root).toHaveAttribute('data-size', 'lg');
    });

    it('defaults to size=md', () => {
      render(<InputText placeholder="test" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-size', 'md');
    });
  });

  // === Icons ===
  describe('icons', () => {
    it('renders iconLeft slot when iconLeft prop is provided', () => {
      render(<InputText placeholder="test" iconLeft={<span data-testid="left-icon">L</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders iconRight slot when iconRight prop is provided', () => {
      render(<InputText placeholder="test" iconRight={<span data-testid="right-icon">R</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('does not render icon slots when icon props are not provided', () => {
      render(<InputText placeholder="test" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      // Root should only contain the input, no icon spans
      const spans = root.querySelectorAll('span');
      expect(spans.length).toBe(0);
    });

    it('icon slots have aria-hidden="true"', () => {
      render(
        <InputText
          placeholder="test"
          iconLeft={<span data-testid="left-icon">L</span>}
          iconRight={<span data-testid="right-icon">R</span>}
        />,
      );
      const leftSlot = screen.getByTestId('left-icon').parentElement!;
      const rightSlot = screen.getByTestId('right-icon').parentElement!;
      expect(leftSlot).toHaveAttribute('aria-hidden', 'true');
      expect(rightSlot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === Behavior ===
  describe('behavior', () => {
    it('clicking root focuses the native input', () => {
      render(<InputText placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      const root = input.closest('div')!;
      fireEvent.click(root);
      expect(document.activeElement).toBe(input);
    });

    it('applies width as inline style on root when provided', () => {
      render(<InputText placeholder="test" width="200px" />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root.style.width).toBe('200px');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid on root when invalid=true', () => {
      render(<InputText placeholder="test" invalid />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-invalid');
    });

    it('sets data-disabled on root when disabled=true', () => {
      render(<InputText placeholder="test" disabled />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-disabled');
    });

    it('sets data-readonly on root when readOnly=true', () => {
      render(<InputText placeholder="test" readOnly />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root).toHaveAttribute('data-readonly');
    });

    it('disabled input is actually disabled', () => {
      render(<InputText placeholder="test" disabled />);
      expect(screen.getByPlaceholderText('test')).toBeDisabled();
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('native input provides implicit ARIA role', () => {
      render(<InputText placeholder="test" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('label association works via id/htmlFor or aria-label', () => {
      render(
        <>
          <label htmlFor="name-input">Name</label>
          <InputText id="name-input" placeholder="test" />
        </>,
      );
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('aria-invalid should be conveyed when invalid', () => {
      render(<InputText placeholder="test" invalid aria-invalid="true" />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // === Form integration ===
  describe('form', () => {
    it('input participates in native form submission via name attribute', () => {
      render(<InputText placeholder="test" name="username" />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('name', 'username');
    });

    it('value is read from native input element', () => {
      render(<InputText placeholder="test" defaultValue="hello" />);
      expect(screen.getByPlaceholderText('test')).toHaveValue('hello');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<InputText placeholder="test" sp={{ root: { className: 'sp-root' } }} />);
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root.className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <InputText placeholder="test" sp={{ root: { style: { border: '2px solid red' } } }} />,
      );
      const root = screen.getByPlaceholderText('test').closest('div')!;
      expect(root.style.border).toBe('2px solid red');
    });
  });
});
