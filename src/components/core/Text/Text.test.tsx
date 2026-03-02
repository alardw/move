// Generated from Text.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as p element by default', () => {
      render(<Text data-testid="text">Hello</Text>);
      const el = screen.getByTestId('text');
      expect(el.tagName).toBe('P');
    });

    it('renders children content', () => {
      render(<Text>Hello world</Text>);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLElement>;
      render(<Text ref={ref}>Text</Text>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('forwards className and style', () => {
      render(
        <Text className="custom" style={{ marginTop: '10px' }} data-testid="text">
          Text
        </Text>
      );
      const el = screen.getByTestId('text');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Text data-testid="text" aria-label="description">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveAttribute('aria-label', 'description');
    });
  });

  // === Dynamic element (as prop) ===
  describe('dynamic element', () => {
    it('defaults to as=p', () => {
      render(<Text data-testid="text">Text</Text>);
      expect(screen.getByTestId('text').tagName).toBe('P');
    });

    it.each(['span', 'div', 'em', 'strong', 'small', 'del'] as const)(
      'renders as %s element via as prop',
      (element) => {
        render(
          <Text as={element} data-testid="text">
            Text
          </Text>
        );
        expect(screen.getByTestId('text').tagName).toBe(element.toUpperCase());
      }
    );
  });

  // === Defaults ===
  describe('defaults', () => {
    it('defaults to size=base', () => {
      render(<Text data-testid="text">Text</Text>);
      expect(screen.getByTestId('text')).toHaveAttribute('data-size', 'base');
    });

    it('defaults to weight=normal', () => {
      render(<Text data-testid="text">Text</Text>);
      expect(screen.getByTestId('text')).toHaveAttribute('data-weight', 'normal');
    });

    it('defaults to color=base', () => {
      render(<Text data-testid="text">Text</Text>);
      expect(screen.getByTestId('text')).toHaveAttribute('data-color', 'base');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it.each(['xs', 'sm', 'base', 'lg', 'xl'] as const)(
      'applies size=%s via data-size attribute',
      (size) => {
        render(
          <Text size={size} data-testid="text">
            Text
          </Text>
        );
        expect(screen.getByTestId('text')).toHaveAttribute('data-size', size);
      }
    );
  });

  // === Weights ===
  describe('weights', () => {
    it.each(['normal', 'medium', 'semibold', 'bold'] as const)(
      'applies weight=%s via data-weight attribute',
      (weight) => {
        render(
          <Text weight={weight} data-testid="text">
            Text
          </Text>
        );
        expect(screen.getByTestId('text')).toHaveAttribute('data-weight', weight);
      }
    );
  });

  // === Colors ===
  describe('colors', () => {
    it.each(['base', 'muted', 'subtle', 'primary', 'success', 'warning', 'error'] as const)(
      'applies color=%s via data-color attribute',
      (color) => {
        render(
          <Text color={color} data-testid="text">
            Text
          </Text>
        );
        expect(screen.getByTestId('text')).toHaveAttribute('data-color', color);
      }
    );
  });

  // === Align ===
  describe('align', () => {
    it('applies align via data-align attribute when provided', () => {
      render(
        <Text align="center" data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveAttribute('data-align', 'center');
    });

    it('omits data-align when align prop is not provided', () => {
      render(<Text data-testid="text">Text</Text>);
      expect(screen.getByTestId('text')).not.toHaveAttribute('data-align');
    });

    it.each(['left', 'center', 'right'] as const)(
      'supports align=%s',
      (align) => {
        render(
          <Text align={align} data-testid="text">
            Text
          </Text>
        );
        expect(screen.getByTestId('text')).toHaveAttribute('data-align', align);
      }
    );
  });

  // === Truncate ===
  describe('truncate', () => {
    it('applies data-truncate attribute when truncate=true', () => {
      render(
        <Text truncate data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveAttribute('data-truncate');
    });

    it('omits data-truncate when truncate is not provided', () => {
      render(<Text data-testid="text">Text</Text>);
      expect(screen.getByTestId('text')).not.toHaveAttribute('data-truncate');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Text sp={{ root: { className: 'sp-root' } }} data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveClass('sp-root');
    });
  });
});
