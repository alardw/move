// Generated from Password.spec.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Password } from './Password';

describe('Password', () => {
  const renderPassword = (props: Record<string, unknown> = {}) =>
    render(<Password placeholder="Enter password" {...props} />);

  // === Rendering ===
  describe('rendering', () => {
    it('renders input with type="password" by default', () => {
      renderPassword();
      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders toggle button', () => {
      renderPassword();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('forwards ref to the native input element', () => {
      const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
      render(<Password ref={ref as any} placeholder="test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('forwards className and style on root', () => {
      const { container } = renderPassword({ className: 'custom', style: { margin: 8 } });
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });

    it('HTML attrs spread to input element', () => {
      renderPassword({ 'aria-label': 'Password field' });
      expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute(
        'aria-label',
        'Password field',
      );
    });
  });

  // === Visibility toggle ===
  describe('visibility toggle', () => {
    it('toggles input type to "text" when toggle clicked', async () => {
      const user = userEvent.setup();
      renderPassword();
      const toggle = screen.getByRole('button');
      await user.click(toggle);
      expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'text');
    });

    it('toggle aria-label changes between show/hide', async () => {
      const user = userEvent.setup();
      renderPassword();
      const toggle = screen.getByRole('button');
      expect(toggle).toHaveAttribute('aria-label', 'Show password');
      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-label', 'Hide password');
    });

    it('toggle has tabIndex=-1', () => {
      renderPassword();
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1');
    });

    it('onVisibleChange fires on toggle click', async () => {
      const user = userEvent.setup();
      const onVisibleChange = vi.fn();
      renderPassword({ onVisibleChange });
      await user.click(screen.getByRole('button'));
      expect(onVisibleChange).toHaveBeenCalledWith(true);
    });

    it('controlled visibility via visible prop', () => {
      renderPassword({ visible: true, onVisibleChange: () => {} });
      expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'text');
    });

    it('uncontrolled visibility via defaultVisible prop', () => {
      renderPassword({ defaultVisible: true });
      expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'text');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies data-variant', () => {
      const { container } = renderPassword({ variant: 'filled' });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-variant', 'filled');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies data-size', () => {
      const { container } = renderPassword({ size: 'sm' });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-size', 'sm');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid when invalid=true', () => {
      const { container } = renderPassword({ invalid: true });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-invalid');
    });

    it('sets data-disabled when disabled', () => {
      const { container } = renderPassword({ disabled: true });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-disabled');
    });

    it('sets data-readonly when readOnly', () => {
      const { container } = renderPassword({ readOnly: true });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-readonly');
    });

    it('disabled toggle cannot be clicked', async () => {
      const user = userEvent.setup();
      const onVisibleChange = vi.fn();
      renderPassword({ disabled: true, onVisibleChange });
      await user.click(screen.getByRole('button'));
      expect(onVisibleChange).not.toHaveBeenCalled();
    });
  });

  // === Root click ===
  describe('root click', () => {
    it('root click focuses the input', async () => {
      const user = userEvent.setup();
      const { container } = renderPassword();
      await user.click(container.firstChild as HTMLElement);
      expect(screen.getByPlaceholderText('Enter password')).toHaveFocus();
    });
  });

  // === Width ===
  describe('width', () => {
    it('custom width applied to root', () => {
      const { container } = renderPassword({ width: 300 });
      expect((container.firstChild as HTMLElement).style.width).toBe('300px');
    });
  });

  // === Form ===
  describe('form', () => {
    it('name prop participates in form submission', () => {
      renderPassword({ name: 'pwd' });
      expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('name', 'pwd');
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('toggle button has type="button"', () => {
      renderPassword();
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('toggle icon has aria-hidden', () => {
      const { container } = renderPassword();
      const toggleIcon = container.querySelector('[aria-hidden="true"]');
      expect(toggleIcon).toBeInTheDocument();
    });
  });
});
