// Generated from FormField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from './FormField';

describe('FormField', () => {
  // === Root ===
  describe('Root', () => {
    it('renders a container div with inner grid wrapper', () => {
      const { container } = render(
        <FormField.Root data-testid="root">
          <FormField.Field>content</FormField.Field>
        </FormField.Root>,
      );
      const root = screen.getByTestId('root');
      expect(root.tagName).toBe('DIV');
      // Inner grid wrapper
      expect(root.firstElementChild?.tagName).toBe('DIV');
    });

    it('applies labelWidth as --move-formfield-label-width CSS custom property', () => {
      render(
        <FormField.Root data-testid="root" labelWidth="12rem">
          <FormField.Field>content</FormField.Field>
        </FormField.Root>,
      );
      const root = screen.getByTestId('root');
      expect(root.style.getPropertyValue('--move-formfield-label-width')).toBe('12rem');
    });

    it('forwards className and style on Root', () => {
      render(
        <FormField.Root data-testid="root" className="custom" style={{ margin: 8 }}>
          <FormField.Field>content</FormField.Field>
        </FormField.Root>,
      );
      const root = screen.getByTestId('root');
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });

    it('forwards ref on Root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <FormField.Root ref={ref as any}>
          <FormField.Field>content</FormField.Field>
        </FormField.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Label ===
  describe('Label', () => {
    it('renders children content in a label container', () => {
      render(
        <FormField.Root>
          <FormField.Label>My Label</FormField.Label>
        </FormField.Root>,
      );
      expect(screen.getByText('My Label')).toBeInTheDocument();
    });

    it('forwards className and style on Label', () => {
      render(
        <FormField.Root>
          <FormField.Label className="label-class" style={{ color: 'blue' }}>
            Label
          </FormField.Label>
        </FormField.Root>,
      );
      const el = screen.getByText('Label');
      expect(el.className).toContain('label-class');
      expect(el.style.color).toBe('blue');
    });

    it('forwards ref on Label', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <FormField.Root>
          <FormField.Label ref={ref as any}>Label</FormField.Label>
        </FormField.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Field ===
  describe('Field', () => {
    it('renders children content in a field container', () => {
      render(
        <FormField.Root>
          <FormField.Field>
            <input placeholder="test" />
          </FormField.Field>
        </FormField.Root>,
      );
      expect(screen.getByPlaceholderText('test')).toBeInTheDocument();
    });

    it('forwards className and style on Field', () => {
      render(
        <FormField.Root>
          <FormField.Field className="field-class" style={{ padding: 4 }} data-testid="field">
            content
          </FormField.Field>
        </FormField.Root>,
      );
      const el = screen.getByTestId('field');
      expect(el.className).toContain('field-class');
      expect(el.style.padding).toBe('4px');
    });
  });

  // === Description ===
  describe('Description', () => {
    it('renders children content in a description container', () => {
      render(
        <FormField.Root>
          <FormField.Description>Hint text</FormField.Description>
        </FormField.Root>,
      );
      expect(screen.getByText('Hint text')).toBeInTheDocument();
    });

    it('sets data-error when error=true', () => {
      render(
        <FormField.Root>
          <FormField.Description error data-testid="desc">
            Error message
          </FormField.Description>
        </FormField.Root>,
      );
      expect(screen.getByTestId('desc')).toHaveAttribute('data-error');
    });

    it('does not set data-error when error is not provided', () => {
      render(
        <FormField.Root>
          <FormField.Description data-testid="desc">Hint</FormField.Description>
        </FormField.Root>,
      );
      expect(screen.getByTestId('desc')).not.toHaveAttribute('data-error');
    });

    it('forwards className and style on Description', () => {
      render(
        <FormField.Root>
          <FormField.Description className="desc-class" style={{ fontSize: 12 }} data-testid="desc">
            Hint
          </FormField.Description>
        </FormField.Root>,
      );
      const el = screen.getByTestId('desc');
      expect(el.className).toContain('desc-class');
      expect(el.style.fontSize).toBe('12px');
    });
  });
});
