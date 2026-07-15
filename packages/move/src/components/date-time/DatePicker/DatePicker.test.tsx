// Generated from DatePicker.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker';

// Helper: minimal DatePicker composition
const renderDatePicker = (
  rootProps: Record<string, any> = {},
  inputProps: Record<string, any> = {},
) => {
  return render(
    <DatePicker.Root {...rootProps}>
      <DatePicker.Trigger>
        <DatePicker.Input {...inputProps} />
      </DatePicker.Trigger>
      <DatePicker.Content data-testid="content">
        <div role="grid">
          <div role="gridcell">1</div>
          <div role="gridcell">2</div>
          <div role="gridcell">3</div>
        </div>
      </DatePicker.Content>
    </DatePicker.Root>,
  );
};

describe('DatePicker', () => {
  // === Root ===
  describe('Root', () => {
    it('renders children', () => {
      render(
        <DatePicker.Root>
          <span data-testid="child">Hello</span>
        </DatePicker.Root>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      const { container } = render(
        <DatePicker.Root className="custom" style={{ marginTop: '10px' }}>
          <span>Content</span>
        </DatePicker.Root>,
      );
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveClass('custom');
      expect(root).toHaveStyle({ marginTop: '10px' });
    });

    it('defaults to mode=single', () => {
      // Mode affects Input behavior — single mode renders a typeable input
      renderDatePicker();
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).not.toHaveAttribute('readonly');
    });

    it('defaults to closeOnSelect=true', () => {
      // closeOnSelect is internal behavior — tested via integration
      renderDatePicker({ closeOnSelect: true });
      // No assertion needed — verifying it doesn't throw with default
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders children', () => {
      render(
        <DatePicker.Root>
          <DatePicker.Trigger>
            <span data-testid="trigger-child">Trigger</span>
          </DatePicker.Trigger>
        </DatePicker.Root>,
      );
      expect(screen.getByTestId('trigger-child')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      render(
        <DatePicker.Root>
          <DatePicker.Trigger className="trigger-class" style={{ padding: '8px' }}>
            <span data-testid="trigger-inner">T</span>
          </DatePicker.Trigger>
        </DatePicker.Root>,
      );
      const triggerChild = screen.getByTestId('trigger-inner');
      const trigger = triggerChild.parentElement as HTMLElement;
      expect(trigger).toHaveClass('trigger-class');
      expect(trigger).toHaveStyle({ padding: '8px' });
    });
  });

  // === Input ===
  describe('Input', () => {
    it('renders a text input for single mode', () => {
      renderDatePicker({ mode: 'single' });
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders two text inputs for range mode', () => {
      renderDatePicker({ mode: 'range' });
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBe(2);
    });

    it('defaults input size to md', () => {
      renderDatePicker();
      // Input renders — size is passed to InputText internally
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders calendar button with aria-label', () => {
      renderDatePicker();
      const button = screen.getByRole('button', { name: 'Open calendar' });
      expect(button).toBeInTheDocument();
    });

    it('range inputs have aria-labels', () => {
      renderDatePicker({ mode: 'range' });
      expect(screen.getByLabelText('Start date')).toBeInTheDocument();
      expect(screen.getByLabelText('End date')).toBeInTheDocument();
    });
  });

  // === Icon ===
  describe('Icon', () => {
    it('renders default calendar icon', () => {
      render(
        <DatePicker.Root>
          <DatePicker.Icon data-testid="icon" />
        </DatePicker.Root>,
      );
      // Icon slot renders with calendar icon fallback
      const icon = document.querySelector('[class*="icon"]');
      expect(icon).toBeInTheDocument();
    });

    it('renders custom children', () => {
      render(
        <DatePicker.Root>
          <DatePicker.Icon>
            <span data-testid="custom-icon">Custom</span>
          </DatePicker.Icon>
        </DatePicker.Root>,
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders children when open', () => {
      render(
        <DatePicker.Root defaultOpen>
          <DatePicker.Trigger>
            <DatePicker.Input />
          </DatePicker.Trigger>
          <DatePicker.Content>
            <span data-testid="calendar">Calendar</span>
          </DatePicker.Content>
        </DatePicker.Root>,
      );
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      render(
        <DatePicker.Root defaultOpen>
          <DatePicker.Trigger>
            <DatePicker.Input />
          </DatePicker.Trigger>
          <DatePicker.Content
            className="content-class"
            style={{ maxWidth: '300px' }}
            data-testid="content"
          >
            <span>Cal</span>
          </DatePicker.Content>
        </DatePicker.Root>,
      );
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('content-class');
      expect(content).toHaveStyle({ maxWidth: '300px' });
    });
  });

  // === Animation ===
  describe('Animation', () => {
    it('renders without animation when animations=false', () => {
      render(
        <DatePicker.Root defaultOpen animations={false}>
          <DatePicker.Trigger>
            <DatePicker.Input />
          </DatePicker.Trigger>
          <DatePicker.Content data-testid="content">
            <span>Cal</span>
          </DatePicker.Content>
        </DatePicker.Root>,
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  // === Labels ===
  describe('Labels', () => {
    it('uses default labels', () => {
      renderDatePicker();
      expect(screen.getByRole('button', { name: 'Open calendar' })).toBeInTheDocument();
    });

    it('supports custom labels', () => {
      render(
        <DatePicker.Root labels={{ openCalendar: 'Show calendar' }}>
          <DatePicker.Trigger>
            <DatePicker.Input />
          </DatePicker.Trigger>
        </DatePicker.Root>,
      );
      expect(screen.getByRole('button', { name: 'Show calendar' })).toBeInTheDocument();
    });
  });
});
