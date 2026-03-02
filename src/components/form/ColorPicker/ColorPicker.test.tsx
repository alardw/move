// Generated from ColorPicker.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders root element', () => {
      const { container } = render(<ColorPicker />);
      const root = container.firstElementChild;
      expect(root).toBeInTheDocument();
    });

    it('renders with data-size=md by default', () => {
      const { container } = render(<ColorPicker />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('renders with data-format=hex by default', () => {
      const { container } = render(<ColorPicker />);
      expect(container.firstElementChild).toHaveAttribute('data-format', 'hex');
    });

    it('forwards className to root', () => {
      const { container } = render(<ColorPicker className="custom" />);
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style to root', () => {
      const { container } = render(<ColorPicker style={{ margin: '10px' }} />);
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<ColorPicker ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies sm size', () => {
      const { container } = render(<ColorPicker size="sm" />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'sm');
    });

    it('applies lg size', () => {
      const { container } = render(<ColorPicker size="lg" />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });
  });

  // === Disabled / ReadOnly ===
  describe('state attributes', () => {
    it('sets data-disabled when disabled', () => {
      const { container } = render(<ColorPicker disabled />);
      expect(container.firstElementChild).toHaveAttribute('data-disabled');
    });

    it('sets data-readonly when readOnly', () => {
      const { container } = render(<ColorPicker readOnly />);
      expect(container.firstElementChild).toHaveAttribute('data-readonly');
    });

    it('sets data-fullwidth when fullWidth', () => {
      const { container } = render(<ColorPicker fullWidth />);
      expect(container.firstElementChild).toHaveAttribute('data-fullwidth');
    });
  });

  // === Saturation area ===
  describe('saturation area', () => {
    it('renders saturation area when withPicker=true', () => {
      render(<ColorPicker withPicker />);
      expect(screen.getByRole('slider', { name: /saturation/i })).toBeInTheDocument();
    });

    it('hides saturation area when withPicker=false', () => {
      render(<ColorPicker withPicker={false} />);
      expect(screen.queryByRole('slider', { name: /saturation/i })).not.toBeInTheDocument();
    });

    it('saturation area has aria-label', () => {
      render(<ColorPicker />);
      const sat = screen.getByRole('slider', { name: 'Color saturation and brightness' });
      expect(sat).toBeInTheDocument();
    });

    it('saturation area has aria-valuetext', () => {
      render(<ColorPicker defaultValue="#ff0000" />);
      const sat = screen.getByRole('slider', { name: 'Color saturation and brightness' });
      expect(sat).toHaveAttribute('aria-valuetext');
      expect(sat.getAttribute('aria-valuetext')).toMatch(/Saturation.*%.*Brightness.*%/);
    });
  });

  // === Hue slider ===
  describe('hue slider', () => {
    it('renders hue slider when withPicker=true', () => {
      render(<ColorPicker />);
      expect(screen.getByRole('slider', { name: 'Hue' })).toBeInTheDocument();
    });

    it('hue slider has aria-valuemin, aria-valuemax, aria-valuenow', () => {
      render(<ColorPicker />);
      const hue = screen.getByRole('slider', { name: 'Hue' });
      expect(hue).toHaveAttribute('aria-valuemin', '0');
      expect(hue).toHaveAttribute('aria-valuemax', '360');
      expect(hue).toHaveAttribute('aria-valuenow');
    });

    it('hides hue slider when withPicker=false', () => {
      render(<ColorPicker withPicker={false} />);
      expect(screen.queryByRole('slider', { name: 'Hue' })).not.toBeInTheDocument();
    });
  });

  // === Alpha slider ===
  describe('alpha slider', () => {
    it('shows alpha slider when format has alpha channel', () => {
      render(<ColorPicker format="rgba" />);
      expect(screen.getByRole('slider', { name: 'Opacity' })).toBeInTheDocument();
    });

    it('hides alpha slider when format has no alpha channel', () => {
      render(<ColorPicker format="hex" />);
      expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
    });

    it('alpha slider has aria-valuemin, aria-valuemax, aria-valuenow', () => {
      render(<ColorPicker format="rgba" />);
      const alpha = screen.getByRole('slider', { name: 'Opacity' });
      expect(alpha).toHaveAttribute('aria-valuemin', '0');
      expect(alpha).toHaveAttribute('aria-valuemax', '100');
      expect(alpha).toHaveAttribute('aria-valuenow');
    });
  });

  // === Swatches ===
  describe('swatches', () => {
    const swatches = ['#ff0000', '#00ff00', '#0000ff'];

    it('renders swatches when swatches prop provided', () => {
      render(<ColorPicker swatches={swatches} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('swatch buttons have aria-label with color value', () => {
      render(<ColorPicker swatches={swatches} />);
      expect(screen.getByRole('button', { name: '#ff0000' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '#00ff00' })).toBeInTheDocument();
    });

    it('does not render swatches when prop not provided', () => {
      render(<ColorPicker />);
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('swatch click calls onValueChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorPicker swatches={swatches} onValueChange={onChange} />);
      await user.click(screen.getByRole('button', { name: '#ff0000' }));
      expect(onChange).toHaveBeenCalled();
    });

    it('swatch click calls onChangeEnd', async () => {
      const user = userEvent.setup();
      const onEnd = vi.fn();
      render(<ColorPicker swatches={swatches} onChangeEnd={onEnd} />);
      await user.click(screen.getByRole('button', { name: '#ff0000' }));
      expect(onEnd).toHaveBeenCalled();
    });
  });

  // === Format selector ===
  describe('format selector', () => {
    it('renders format selector with aria-label', () => {
      render(<ColorPicker />);
      expect(screen.getByRole('combobox', { name: 'Color format' })).toBeInTheDocument();
    });

    it('format selector shows current format options', () => {
      render(<ColorPicker />);
      const select = screen.getByRole('combobox', { name: 'Color format' });
      expect(select).toBeInTheDocument();
      const options = select.querySelectorAll('option');
      expect(options).toHaveLength(3); // hex, rgb, hsl
    });

    it('changing format calls onFormatChange', async () => {
      const user = userEvent.setup();
      const onFormatChange = vi.fn();
      render(<ColorPicker onFormatChange={onFormatChange} />);
      const select = screen.getByRole('combobox', { name: 'Color format' });
      await user.selectOptions(select, 'rgb');
      expect(onFormatChange).toHaveBeenCalled();
    });

    it('format selector is disabled when component is disabled', () => {
      render(<ColorPicker disabled />);
      expect(screen.getByRole('combobox', { name: 'Color format' })).toBeDisabled();
    });
  });

  // === Hex input ===
  describe('hex input', () => {
    it('renders hex input when format is hex', () => {
      render(<ColorPicker format="hex" />);
      expect(screen.getByRole('textbox', { name: 'Hex color value' })).toBeInTheDocument();
    });

    it('hex input shows hex string value', () => {
      render(<ColorPicker format="hex" defaultValue="#ff0000" />);
      const input = screen.getByRole('textbox', { name: 'Hex color value' });
      expect(input).toHaveValue('ff0000');
    });
  });

  // === Channel inputs (RGB mode) ===
  describe('channel inputs (RGB)', () => {
    it('renders R, G, B inputs when format is rgb', () => {
      render(<ColorPicker format="rgb" />);
      expect(screen.getByRole('textbox', { name: 'Red' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Green' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Blue' })).toBeInTheDocument();
    });

    it('does not render hex input when format is rgb', () => {
      render(<ColorPicker format="rgb" />);
      expect(screen.queryByRole('textbox', { name: 'Hex color value' })).not.toBeInTheDocument();
    });
  });

  // === Channel inputs (HSL mode) ===
  describe('channel inputs (HSL)', () => {
    it('renders H, S, L inputs when format is hsl', () => {
      render(<ColorPicker format="hsl" />);
      expect(screen.getByRole('textbox', { name: 'Hue' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Saturation' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Lightness' })).toBeInTheDocument();
    });
  });

  // === Alpha input ===
  describe('alpha input', () => {
    it('renders alpha input when format has alpha', () => {
      render(<ColorPicker format="rgba" />);
      expect(screen.getByRole('textbox', { name: 'Alpha' })).toBeInTheDocument();
    });

    it('does not render alpha input when format has no alpha', () => {
      render(<ColorPicker format="hex" />);
      expect(screen.queryByRole('textbox', { name: 'Alpha' })).not.toBeInTheDocument();
    });

    it('alpha input shows percentage value', () => {
      render(<ColorPicker format="rgba" defaultValue="#ff0000" />);
      const alphaInput = screen.getByRole('textbox', { name: 'Alpha' });
      expect(alphaInput).toHaveValue('100');
    });
  });

  // === withPicker toggle ===
  describe('withPicker', () => {
    it('input row always shown regardless of withPicker', () => {
      render(<ColorPicker withPicker={false} />);
      expect(screen.getByRole('combobox', { name: 'Color format' })).toBeInTheDocument();
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('Enter on channel input triggers blur', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgb" />);
      const rInput = screen.getByRole('textbox', { name: 'Red' });
      await user.click(rInput);
      await user.keyboard('{Enter}');
      expect(document.activeElement).not.toBe(rInput);
    });
  });

  // === Controlled value ===
  describe('controlled value', () => {
    it('calls onValueChange with formatted value on swatch click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorPicker swatches={['#00ff00']} onValueChange={onChange} />);
      await user.click(screen.getByRole('button', { name: '#00ff00' }));
      expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^#/));
    });
  });
});
