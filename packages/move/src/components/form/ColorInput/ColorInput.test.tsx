// Generated from ColorInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ColorInput } from './ColorInput';

describe('ColorInput', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders root element', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('renders input element', () => {
      render(<ColorInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders swatch with role=button', () => {
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toBeInTheDocument();
    });

    it('forwards className to root', () => {
      const { container } = render(<ColorInput className="custom" />);
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style to root', () => {
      const { container } = render(<ColorInput style={{ margin: '10px' }} />);
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<ColorInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('defaults to data-variant=outlined', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'outlined');
    });

    it('defaults to data-size=md', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('defaults to data-format=hex', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toHaveAttribute('data-format', 'hex');
    });

    it('applies custom variant', () => {
      const { container } = render(<ColorInput variant="filled" />);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'filled');
    });

    it('applies custom size', () => {
      const { container } = render(<ColorInput size="lg" />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });

    it('sets data-disabled when disabled', () => {
      const { container } = render(<ColorInput disabled />);
      expect(container.firstElementChild).toHaveAttribute('data-disabled');
    });

    it('sets data-invalid when invalid', () => {
      const { container } = render(<ColorInput invalid />);
      expect(container.firstElementChild).toHaveAttribute('data-invalid');
    });

    it('sets data-readonly when readOnly', () => {
      const { container } = render(<ColorInput readOnly />);
      expect(container.firstElementChild).toHaveAttribute('data-readonly');
    });
  });

  // === Swatch ===
  describe('swatch', () => {
    it('swatch has aria-label', () => {
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toHaveAttribute('aria-label', 'Open color picker');
    });

    it('swatch has tabIndex=-1', () => {
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toHaveAttribute('tabindex', '-1');
    });

    it('swatch displays current color as backgroundColor', () => {
      const { container } = render(<ColorInput defaultValue="#ff0000" />);
      const swatch = container.querySelector('[role="button"]') as HTMLElement;
      expect(swatch.style.backgroundColor).toBeTruthy();
    });

    it('swatch custom label via swatchLabel prop', () => {
      const { container } = render(<ColorInput swatchLabel="Choose" />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toHaveAttribute('aria-label', 'Choose');
    });
  });

  // === Input ===
  describe('input', () => {
    it('input shows current value', () => {
      render(<ColorInput defaultValue="#ff0000" />);
      expect(screen.getByRole('textbox')).toHaveValue('#ff0000');
    });

    it('input shows placeholder', () => {
      render(<ColorInput placeholder="Pick color" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Pick color');
    });

    it('input is disabled when component is disabled', () => {
      render(<ColorInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('forwards name to input', () => {
      render(<ColorInput name="color" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'color');
    });

    it('forwards id to input', () => {
      render(<ColorInput id="my-color" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-color');
    });

    it('forwards required to input', () => {
      render(<ColorInput required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('required');
    });
  });

  // === Input editing ===
  describe('input editing', () => {
    it('snapshots value on focus', async () => {
      const user = userEvent.setup();
      render(<ColorInput defaultValue="#ff0000" />);
      const input = screen.getByRole('textbox');
      await user.click(input);
      expect(input).toHaveValue('#ff0000');
    });

    it('validates and commits valid color on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#ff0000" onValueChange={onChange} />);
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '#00ff00');
      await user.tab();
      expect(onChange).toHaveBeenCalled();
    });

    it('does not commit invalid color on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#ff0000" onValueChange={onChange} />);
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, 'not-a-color');
      await user.tab();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('Enter key triggers blur', async () => {
      const user = userEvent.setup();
      render(<ColorInput defaultValue="#ff0000" />);
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.keyboard('{Enter}');
      expect(document.activeElement).not.toBe(input);
    });
  });

  // === Popover ===
  describe('popover', () => {
    it('swatch click opens popover with ColorPicker', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]') as HTMLElement;
      await user.click(swatch);
      // ColorPicker renders sliders inside popover content
      expect(document.body.querySelector('[data-radix-popper-content-wrapper]')).toBeInTheDocument();
    });

    it('disabled prevents swatch click', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorInput disabled />);
      const swatch = container.querySelector('[role="button"]') as HTMLElement;
      await user.click(swatch);
      expect(document.body.querySelector('[data-radix-popper-content-wrapper]')).not.toBeInTheDocument();
    });
  });

  // === Callbacks ===
  describe('callbacks', () => {
    it('calls onFocus when input is focused', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<ColorInput onFocus={onFocus} />);
      await user.click(screen.getByRole('textbox'));
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input is blurred', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<ColorInput onBlur={onBlur} />);
      await user.click(screen.getByRole('textbox'));
      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });
  });
});
