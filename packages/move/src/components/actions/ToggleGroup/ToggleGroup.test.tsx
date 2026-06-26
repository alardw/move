// Generated from ToggleGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleGroup } from './ToggleGroup';
import { createRef } from 'react';

describe('ToggleGroup', () => {
  // === Root ===
  describe('ToggleGroup.Root', () => {
    it('renders as Radix ToggleGroup.Root with type="single"', () => {
      render(
        <ToggleGroup.Root data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      const el = screen.getByTestId('tg');
      expect(el).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a">Alpha</ToggleGroup.Item>
          <ToggleGroup.Item value="b">Beta</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <ToggleGroup.Root ref={ref} defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <ToggleGroup.Root className="custom" style={{ marginTop: '10px' }} data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      const el = screen.getByTestId('tg');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('defaults to variant=secondary', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      // Variant is passed to items via context
      expect(screen.getByTestId('item')).toHaveAttribute('data-variant', 'secondary');
    });

    it('defaults to size=md', () => {
      render(
        <ToggleGroup.Root data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('tg')).toHaveAttribute('data-size', 'md');
      expect(screen.getByTestId('item')).toHaveAttribute('data-size', 'md');
    });

    it('applies data-orientation attribute', () => {
      render(
        <ToggleGroup.Root orientation="vertical" data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('tg')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('defaults data-orientation to horizontal', () => {
      render(
        <ToggleGroup.Root data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('tg')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('applies data-size attribute', () => {
      render(
        <ToggleGroup.Root size="lg" data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('tg')).toHaveAttribute('data-size', 'lg');
    });

    it('blocks deselection (ignores empty value)', () => {
      const onValueChange = vi.fn();
      render(
        <ToggleGroup.Root defaultValue="a" onValueChange={onValueChange}>
          <ToggleGroup.Item value="a" data-testid="item-a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" data-testid="item-b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      // Click item "a" which is already active — Radix fires "" for deselect
      fireEvent.click(screen.getByTestId('item-a'));
      // onValueChange should NOT have been called with ""
      const calls = onValueChange.mock.calls.filter((args: any) => args[0] === '');
      expect(calls.length).toBe(0);
    });

    it('provides size and variant to Items via context', () => {
      render(
        <ToggleGroup.Root size="lg" variant="primary" defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-variant', 'primary');
      expect(screen.getByTestId('item')).toHaveAttribute('data-size', 'lg');
    });

    it('renders indicator with aria-hidden="true"', () => {
      render(
        <ToggleGroup.Root data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      const indicator = screen.getByTestId('tg').querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
    });

    it('spreads HTML attributes', () => {
      render(
        <ToggleGroup.Root data-testid="tg" aria-label="format" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('tg')).toHaveAttribute('aria-label', 'format');
    });
  });

  // === Item ===
  describe('ToggleGroup.Item', () => {
    it('renders as Radix ToggleGroup.Item', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      const el = screen.getByTestId('item');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('BUTTON');
    });

    it('receives data-variant and data-size from context', () => {
      render(
        <ToggleGroup.Root size="sm" variant="danger" defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-variant', 'danger');
      expect(screen.getByTestId('item')).toHaveAttribute('data-size', 'sm');
    });

    it('supports disabled prop', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" disabled data-testid="item">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item')).toBeDisabled();
    });

    it('has data-state="on" when selected', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item-a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" data-testid="item-b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-state', 'on');
    });

    it('has data-state="off" when not selected', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item-a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" data-testid="item-b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-state', 'off');
    });

    it('forwards ref to item element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" ref={ref}>A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards className and style on item', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" className="item-custom" style={{ marginTop: '5px' }} data-testid="item">
            A
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      const el = screen.getByTestId('item');
      expect(el).toHaveClass('item-custom');
      expect(el).toHaveStyle({ marginTop: '5px' });
    });

    it('spreads HTML attributes on item', () => {
      render(
        <ToggleGroup.Root defaultValue="a">
          <ToggleGroup.Item value="a" data-testid="item" aria-label="option-a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('aria-label', 'option-a');
    });
  });

  // === Controlled / Uncontrolled ===
  describe('controlled / uncontrolled', () => {
    it('controlled value prop selects the matching item', () => {
      render(
        <ToggleGroup.Root value="b">
          <ToggleGroup.Item value="a" data-testid="item-a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" data-testid="item-b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-state', 'on');
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-state', 'off');
    });

    it('onValueChange fires when selection changes', () => {
      const onValueChange = vi.fn();
      render(
        <ToggleGroup.Root defaultValue="a" onValueChange={onValueChange}>
          <ToggleGroup.Item value="a" data-testid="item-a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" data-testid="item-b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      fireEvent.click(screen.getByTestId('item-b'));
      expect(onValueChange).toHaveBeenCalledWith('b');
    });

    it('uncontrolled defaultValue sets initial selection', () => {
      render(
        <ToggleGroup.Root defaultValue="b">
          <ToggleGroup.Item value="a" data-testid="item-a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b" data-testid="item-b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-state', 'on');
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-state', 'off');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <ToggleGroup.Root sp={{ root: { className: 'sp-root' } }} data-testid="tg" defaultValue="a">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
      expect(screen.getByTestId('tg')).toHaveClass('sp-root');
    });
  });
});
