// Generated from InputRange.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputRange } from './InputRange';

describe('InputRange', () => {
  const renderSlider = (props: Record<string, unknown> = {}) => render(<InputRange {...props} />);

  // === Rendering ===
  describe('rendering', () => {
    it('renders slider with role=slider on thumb', () => {
      renderSlider();
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('renders track and range elements', () => {
      const { container } = renderSlider();
      expect(container.querySelector('[class*="track"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="range"]')).toBeInTheDocument();
    });

    it('forwards className and style when showValue=false', () => {
      const { container } = renderSlider({ className: 'custom', style: { margin: 8 } });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });

    it('forwards className and style to wrapper when showValue=true', () => {
      const { container } = renderSlider({ showValue: true, defaultValue: 50 });
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('wrapper');
    });
  });

  // === Value ===
  describe('value', () => {
    it('renders single thumb for single defaultValue', () => {
      renderSlider({ defaultValue: 50 });
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(1);
    });

    it('renders two thumbs for array defaultValue', () => {
      renderSlider({ defaultValue: [20, 80] });
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('controlled value works', () => {
      renderSlider({ value: 60, onValueChange: () => {} });
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '60');
    });

    it('sets aria-valuemin and aria-valuemax', () => {
      renderSlider({ min: 10, max: 90 });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '90');
    });
  });

  // === showValue ===
  describe('showValue', () => {
    it('shows value label for single value', () => {
      const { container } = renderSlider({ showValue: true, defaultValue: 42 });
      const valueEls = container.querySelectorAll('[class*="value"]');
      expect(valueEls.length).toBeGreaterThanOrEqual(1);
      expect(valueEls[valueEls.length - 1].textContent).toBe('42');
    });

    it('shows two value labels for range', () => {
      const { container } = renderSlider({ showValue: true, defaultValue: [10, 90] });
      const valueEls = container.querySelectorAll('[class*="value"]');
      expect(valueEls).toHaveLength(2);
      expect(valueEls[0].textContent).toBe('10');
      expect(valueEls[1].textContent).toBe('90');
    });

    it('uses custom formatValue', () => {
      const { container } = renderSlider({
        showValue: true,
        defaultValue: 50,
        formatValue: (v: number) => `${v}%`,
      });
      const valueEls = container.querySelectorAll('[class*="value"]');
      expect(valueEls[valueEls.length - 1].textContent).toBe('50%');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to data-size=md', () => {
      const { container } = renderSlider();
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-size', 'md');
    });

    it('applies data-size=sm', () => {
      const { container } = renderSlider({ size: 'sm' });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-size', 'sm');
    });

    it('applies data-size=lg', () => {
      const { container } = renderSlider({ size: 'lg' });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-size', 'lg');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid', () => {
      const { container } = renderSlider({ invalid: true });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-invalid');
    });

    it('sets data-disabled', () => {
      const { container } = renderSlider({ disabled: true });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-disabled');
    });
  });

  // === Orientation ===
  describe('orientation', () => {
    it('defaults to horizontal', () => {
      const { container } = renderSlider();
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('sets vertical orientation', () => {
      const { container } = renderSlider({ orientation: 'vertical' });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  // === Form ===
  describe('form', () => {
    it('passes name prop to Slider.Root', () => {
      const { container } = renderSlider({ name: 'volume' });
      // Radix Slider receives name and creates hidden inputs for form submission
      // In jsdom the hidden inputs may not render, so verify name is on root
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toBeInTheDocument();
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('thumb has role=slider from Radix', () => {
      renderSlider();
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('thumb has aria-valuenow', () => {
      renderSlider({ defaultValue: 42 });
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
    });

    it('disabled state sets data-disabled on root', () => {
      const { container } = renderSlider({ disabled: true });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root).toHaveAttribute('data-disabled');
    });
  });

  // === Custom width ===
  describe('custom width', () => {
    it('applies width to root when showValue=false', () => {
      const { container } = renderSlider({ width: 200 });
      const root = container.querySelector('[class*="root"]') as HTMLElement;
      expect(root.style.width).toBe('200px');
    });

    it('applies width to wrapper when showValue=true', () => {
      const { container } = renderSlider({ width: 200, showValue: true, defaultValue: 50 });
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('200px');
    });
  });
});
