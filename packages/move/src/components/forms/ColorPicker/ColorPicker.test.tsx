// Generated from ColorPicker.spec.ts
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { ColorPicker } from './ColorPicker';

/** A controlled parent: it stores what the picker emits and hands it straight
 *  back, which is how ColorInput drives it. */
function Controlled({ initial }: { initial: string }) {
  const [value, setValue] = React.useState(initial);
  return <ColorPicker value={value} onValueChange={setValue} />;
}

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

    // Controlled mode used to rebuild HSV by re-parsing the value it had just
    // emitted. RGB cannot carry hue or saturation at the edges of the space, so
    // dragging to the bottom (every colour is #000000 there) came back as
    // h=0, s=0: the cursor jumped to the left edge and the hue reset to red.
    describe('controlled round-trip stability', () => {
      const satOf = (el: HTMLElement) =>
        Number(/Saturation (\d+)%/.exec(el.getAttribute('aria-valuetext') ?? '')?.[1]);
      const brightnessOf = (el: HTMLElement) =>
        Number(/Brightness (\d+)%/.exec(el.getAttribute('aria-valuetext') ?? '')?.[1]);

      it('keeps saturation while brightness is driven to zero', async () => {
        const user = userEvent.setup();
        render(<Controlled initial="#3366ff" />);
        const sat = screen.getByRole('slider', { name: 'Color saturation and brightness' });
        const before = satOf(sat);
        expect(before).toBeGreaterThan(0);

        sat.focus();
        // Shift+ArrowDown steps brightness by 10; extra presses clamp at the floor.
        for (let i = 0; i < 12; i++) await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

        expect(brightnessOf(sat)).toBe(0);
        expect(satOf(sat)).toBe(before);
      });

      it('keeps hue while brightness is driven to zero', async () => {
        const user = userEvent.setup();
        render(<Controlled initial="#3366ff" />);
        const hue = screen.getByRole('slider', { name: 'Hue' });
        const sat = screen.getByRole('slider', { name: 'Color saturation and brightness' });
        const before = hue.getAttribute('aria-valuenow');

        sat.focus();
        for (let i = 0; i < 12; i++) await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

        expect(hue).toHaveAttribute('aria-valuenow', before);
      });

      it('returns to the starting colour after down-and-back-up', async () => {
        const user = userEvent.setup();
        render(<Controlled initial="#3366ff" />);
        const sat = screen.getByRole('slider', { name: 'Color saturation and brightness' });
        const before = sat.getAttribute('aria-valuetext');

        sat.focus();
        for (let i = 0; i < 10; i++) await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
        for (let i = 0; i < 10; i++) await user.keyboard('{Shift>}{ArrowUp}{/Shift}');

        // No drift: the position the user left is the position they come back to.
        expect(sat).toHaveAttribute('aria-valuetext', before);
      });

      it('still adopts a value the parent genuinely changes', async () => {
        // The echo is ignored, but real external control must still win.
        const { rerender } = render(<ColorPicker value="#ff0000" onValueChange={() => {}} />);
        const hue = screen.getByRole('slider', { name: 'Hue' });
        expect(hue).toHaveAttribute('aria-valuenow', '0');

        rerender(<ColorPicker value="#00ff00" onValueChange={() => {}} />);
        expect(hue).toHaveAttribute('aria-valuenow', '120');
      });
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

    it('is keyboard-operable — arrow keys move the value (WCAG 2.1.1)', () => {
      render(<ColorPicker defaultValue="#ff0000" />);
      const hue = screen.getByRole('slider', { name: 'Hue' });
      const start = Number(hue.getAttribute('aria-valuenow'));
      fireEvent.keyDown(hue, { key: 'ArrowRight' });
      expect(Number(hue.getAttribute('aria-valuenow'))).toBe(start + 1);
      fireEvent.keyDown(hue, { key: 'ArrowLeft' });
      expect(Number(hue.getAttribute('aria-valuenow'))).toBe(start);
      fireEvent.keyDown(hue, { key: 'End' });
      expect(hue.getAttribute('aria-valuenow')).toBe('359');
      fireEvent.keyDown(hue, { key: 'Home' });
      expect(hue.getAttribute('aria-valuenow')).toBe('0');
    });

    it('does not move when disabled', () => {
      render(<ColorPicker defaultValue="#ff0000" disabled />);
      const hue = screen.getByRole('slider', { name: 'Hue' });
      const start = hue.getAttribute('aria-valuenow');
      fireEvent.keyDown(hue, { key: 'ArrowRight' });
      expect(hue.getAttribute('aria-valuenow')).toBe(start);
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
      const swatchButtons = screen
        .getAllByRole('button')
        .filter((b) => b.getAttribute('aria-label')?.startsWith('#'));
      expect(swatchButtons).toHaveLength(3);
    });

    it('swatch buttons have aria-label with color value', () => {
      render(<ColorPicker swatches={swatches} />);
      expect(screen.getByRole('button', { name: '#ff0000' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '#00ff00' })).toBeInTheDocument();
    });

    it('does not render swatches when prop not provided', () => {
      render(<ColorPicker />);
      const swatchButtons = screen
        .queryAllByRole('button')
        .filter((b) => b.getAttribute('aria-label')?.startsWith('#'));
      expect(swatchButtons).toHaveLength(0);
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
      expect(screen.getByLabelText('Color format')).toBeInTheDocument();
    });

    it('format selector shows current format value', () => {
      render(<ColorPicker />);
      const trigger = screen.getByLabelText('Color format');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent(/hex/i);
    });

    it('format selector is disabled when component is disabled', () => {
      render(<ColorPicker disabled />);
      expect(screen.getByLabelText('Color format')).toBeDisabled();
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

  // === Controlled / uncontrolled (behavior-3) ===
  // The spec declares the value/defaultValue/onValueChange triad. Every test above
  // drives defaultValue or no value at all, leaving the controlled half — where the
  // parent owns the colour — unexercised.
  describe('controlled and uncontrolled', () => {
    const swatches = ['#ff0000', '#00ff00', '#0000ff'];

    it('controlled: value owns the colour, a swatch click only reports', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ColorPicker format="hex" value="#ff0000" swatches={swatches} onValueChange={onChange} />,
      );
      const input = screen.getByRole('textbox', { name: 'Hex color value' });
      expect(input).toHaveValue('ff0000');

      await user.click(screen.getByRole('button', { name: '#00ff00' }));
      expect(onChange).toHaveBeenCalledWith('#00ff00');
      // The parent never fed the new value back, so the picker must still read the prop.
      expect(input).toHaveValue('ff0000');
    });

    it('uncontrolled: defaultValue seeds it and a swatch click owns the colour', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="hex" defaultValue="#ff0000" swatches={swatches} />);
      const input = screen.getByRole('textbox', { name: 'Hex color value' });

      await user.click(screen.getByRole('button', { name: '#00ff00' }));
      // No `value` prop, so the picker owns the colour and must move on its own.
      expect(input).toHaveValue('00ff00');
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

    // The model always clamped alpha to 0–1; the FIELD did not, so it could sit
    // at 101% or 500% over a colour that was fully opaque.
    it('ArrowUp at 100% does not push the field past 100', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgba" defaultValue="#ff0000" />);
      const alphaInput = screen.getByRole('textbox', { name: 'Alpha' });

      await user.click(alphaInput);
      await user.keyboard('{ArrowUp}{ArrowUp}');
      expect(alphaInput).toHaveValue('100');

      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
      expect(alphaInput).toHaveValue('100');
    });

    it('ArrowDown at 0% does not push the field below 0', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgba" defaultValue="#ff000000" />);
      const alphaInput = screen.getByRole('textbox', { name: 'Alpha' });

      await user.click(alphaInput);
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(alphaInput).toHaveValue('0');
    });

    it('typing an out-of-range alpha clamps the field to the colour', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorPicker format="rgba" defaultValue="#ff0000" onValueChange={onChange} />);
      const alphaInput = screen.getByRole('textbox', { name: 'Alpha' });

      await user.click(alphaInput);
      await user.clear(alphaInput);
      await user.type(alphaInput, '500');

      expect(alphaInput).toHaveValue('100');
      // And the committed colour agrees with what the field shows.
      expect(onChange).toHaveBeenLastCalledWith('rgba(255, 0, 0, 1)');
    });

    it('accepts an in-range alpha', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorPicker format="rgba" defaultValue="#ff0000" onValueChange={onChange} />);
      const alphaInput = screen.getByRole('textbox', { name: 'Alpha' });

      await user.click(alphaInput);
      await user.clear(alphaInput);
      await user.type(alphaInput, '50');

      expect(alphaInput).toHaveValue('50');
      expect(onChange).toHaveBeenLastCalledWith('rgba(255, 0, 0, 0.5)');
    });
  });

  // === Channel input bounds ===
  // Same defect as alpha, same shared handler: the nudge had no bounds at all,
  // so R could read 256 while the colour stayed at 255.
  describe('channel input bounds', () => {
    it('ArrowUp at the channel maximum does not exceed it', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgb" defaultValue="#ff0000" />);
      const red = screen.getByRole('textbox', { name: 'Red' });

      await user.click(red);
      await user.keyboard('{ArrowUp}{ArrowUp}');
      expect(red).toHaveValue('255');
    });

    it('ArrowDown at the channel minimum does not go negative', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgb" defaultValue="#ff0000" />);
      const green = screen.getByRole('textbox', { name: 'Green' });

      await user.click(green);
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(green).toHaveValue('0');
    });

    it('typing an out-of-range channel clamps the field', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgb" defaultValue="#000000" />);
      const red = screen.getByRole('textbox', { name: 'Red' });

      await user.click(red);
      await user.clear(red);
      await user.type(red, '999');
      expect(red).toHaveValue('255');
    });

    it('nudges within range', async () => {
      const user = userEvent.setup();
      render(<ColorPicker format="rgb" defaultValue="#806040" />);
      const red = screen.getByRole('textbox', { name: 'Red' });

      await user.click(red);
      await user.keyboard('{ArrowUp}');
      expect(red).toHaveValue('129');
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(red).toHaveValue('127');
    });
  });

  // === withPicker toggle ===
  describe('withPicker', () => {
    it('input row always shown regardless of withPicker', () => {
      render(<ColorPicker withPicker={false} />);
      expect(screen.getByLabelText('Color format')).toBeInTheDocument();
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
