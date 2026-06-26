// Generated from TimeField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TimeField } from './TimeField';

describe('TimeField', () => {
  // === Root ===
  describe('Root', () => {
    it('renders root element', () => {
      const { container } = render(<TimeField.Root />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('defaults to data-size=md', () => {
      const { container } = render(<TimeField.Root />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('defaults to data-granularity=minute', () => {
      const { container } = render(<TimeField.Root />);
      expect(container.firstElementChild).toHaveAttribute('data-granularity', 'minute');
    });

    it('defaults to data-hourcycle=24', () => {
      const { container } = render(<TimeField.Root />);
      expect(container.firstElementChild).toHaveAttribute('data-hourcycle', '24');
    });

    it('applies custom size', () => {
      const { container } = render(<TimeField.Root size="lg" />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });

    it('applies disabled data attribute', () => {
      const { container } = render(<TimeField.Root disabled />);
      expect(container.firstElementChild).toHaveAttribute('data-disabled');
    });

    it('applies invalid data attribute', () => {
      const { container } = render(<TimeField.Root invalid />);
      expect(container.firstElementChild).toHaveAttribute('data-invalid');
    });

    it('forwards className', () => {
      const { container } = render(<TimeField.Root className="custom" />);
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style', () => {
      const { container } = render(<TimeField.Root style={{ margin: '10px' }} />);
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });
  });

  // === Auto-render segments ===
  describe('auto-render segments', () => {
    it('renders hour and minute segments for default granularity', () => {
      render(<TimeField.Root />);
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons).toHaveLength(2);
      expect(spinbuttons[0]).toHaveAttribute('aria-label', 'hour');
      expect(spinbuttons[1]).toHaveAttribute('aria-label', 'minute');
    });

    it('renders hour, minute, second segments for granularity=second', () => {
      render(<TimeField.Root granularity="second" />);
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons).toHaveLength(3);
      expect(spinbuttons[2]).toHaveAttribute('aria-label', 'second');
    });

    it('renders hour-only segment for granularity=hour', () => {
      render(<TimeField.Root granularity="hour" />);
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons).toHaveLength(1);
      expect(spinbuttons[0]).toHaveAttribute('aria-label', 'hour');
    });

    it('renders period button for hourCycle=12', () => {
      render(<TimeField.Root hourCycle={12} />);
      const spinbuttons = screen.getAllByRole('spinbutton');
      // hour + minute + period
      expect(spinbuttons).toHaveLength(3);
      expect(spinbuttons[2]).toHaveAttribute('aria-label', 'period');
    });

    it('renders separators between numeric segments', () => {
      const { container } = render(<TimeField.Root granularity="second" />);
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      // Two separators: between hour:minute and minute:second
      expect(separators).toHaveLength(2);
    });
  });

  // === Segment ===
  describe('Segment', () => {
    it('has role=spinbutton', () => {
      render(<TimeField.Root />);
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[0]).toHaveAttribute('role', 'spinbutton');
    });

    it('has aria-label matching segment type', () => {
      render(<TimeField.Root />);
      expect(screen.getAllByRole('spinbutton')[0]).toHaveAttribute('aria-label', 'hour');
    });

    it('has aria-valuenow with numeric value', () => {
      render(<TimeField.Root defaultValue="14:30" />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      expect(hourSeg).toHaveAttribute('aria-valuenow', '14');
    });

    it('shows zero-padded value', () => {
      render(<TimeField.Root defaultValue="03:05" />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      expect(hourSeg).toHaveAttribute('value', '03');
    });

    it('increments on ArrowUp', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root defaultValue="10:00" onValueChange={onChange} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      await user.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenCalledWith('11:00');
    });

    it('decrements on ArrowDown', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root defaultValue="10:00" onValueChange={onChange} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      await user.keyboard('{ArrowDown}');
      expect(onChange).toHaveBeenCalledWith('09:00');
    });

    it('wraps hour from 23 to 0 on increment', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root defaultValue="23:00" onValueChange={onChange} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      await user.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenCalledWith('00:00');
    });

    it('accepts digit typing with auto-advance', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root defaultValue="00:00" onValueChange={onChange} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      // Type "15" → should set hour to 15 and advance to minute
      await user.keyboard('1');
      await user.keyboard('5');
      expect(onChange).toHaveBeenCalledWith('15:00');
    });

    it('auto-commits single digit > max first digit', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root defaultValue="00:00" onValueChange={onChange} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      // Type "3" → can't form valid 30-39 (max 23), auto-commit 3
      await user.keyboard('3');
      expect(onChange).toHaveBeenCalledWith('03:00');
    });

    it('clears buffer on Backspace', async () => {
      const user = userEvent.setup();
      render(<TimeField.Root defaultValue="00:00" />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      await user.keyboard('1');
      await user.keyboard('{Backspace}');
      // Buffer cleared, no crash
      expect(hourSeg).toBeInTheDocument();
    });
  });

  // === Period ===
  describe('Period', () => {
    it('renders with role=spinbutton', () => {
      render(<TimeField.Root hourCycle={12} />);
      const periodBtn = screen.getAllByRole('spinbutton').find(
        (el) => el.getAttribute('aria-label') === 'period'
      );
      expect(periodBtn).toBeInTheDocument();
    });

    it('has aria-valuenow 0 for AM, 1 for PM', () => {
      render(<TimeField.Root hourCycle={12} defaultValue="03:00" />);
      const periodBtn = screen.getAllByRole('spinbutton').find(
        (el) => el.getAttribute('aria-label') === 'period'
      );
      expect(periodBtn).toHaveAttribute('aria-valuenow', '0'); // AM
    });

    it('toggles AM/PM on ArrowUp', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root hourCycle={12} defaultValue="03:00" onValueChange={onChange} />);
      const periodBtn = screen.getAllByRole('spinbutton').find(
        (el) => el.getAttribute('aria-label') === 'period'
      )!;
      await user.click(periodBtn);
      await user.keyboard('{ArrowUp}');
      // AM → PM: 03:00 → 15:00
      expect(onChange).toHaveBeenCalledWith('15:00');
    });

    it('responds to A key for AM', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root hourCycle={12} defaultValue="15:00" onValueChange={onChange} />);
      const periodBtn = screen.getAllByRole('spinbutton').find(
        (el) => el.getAttribute('aria-label') === 'period'
      )!;
      await user.click(periodBtn);
      await user.keyboard('a');
      // PM → AM: 15:00 → 03:00
      expect(onChange).toHaveBeenCalledWith('03:00');
    });

    it('responds to P key for PM', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root hourCycle={12} defaultValue="03:00" onValueChange={onChange} />);
      const periodBtn = screen.getAllByRole('spinbutton').find(
        (el) => el.getAttribute('aria-label') === 'period'
      )!;
      await user.click(periodBtn);
      await user.keyboard('p');
      // AM → PM: 03:00 → 15:00
      expect(onChange).toHaveBeenCalledWith('15:00');
    });
  });

  // === Separator ===
  describe('Separator', () => {
    it('has aria-hidden=true', () => {
      const { container } = render(<TimeField.Root />);
      const separator = container.querySelector('[aria-hidden="true"]');
      expect(separator).toBeInTheDocument();
    });

    it('defaults to colon content', () => {
      const { container } = render(<TimeField.Root />);
      const separator = container.querySelector('[aria-hidden="true"]');
      expect(separator?.textContent).toBe(':');
    });
  });

  // === Labels ===
  describe('labels', () => {
    it('overrides segment aria-labels via labels prop', () => {
      render(<TimeField.Root labels={{ hour: 'uur', minute: 'minuut' }} />);
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[0]).toHaveAttribute('aria-label', 'uur');
      expect(spinbuttons[1]).toHaveAttribute('aria-label', 'minuut');
    });

    it('overrides period aria-label via labels prop', () => {
      render(<TimeField.Root hourCycle={12} labels={{ period: 'dagdeel' }} />);
      const periodBtn = screen.getAllByRole('spinbutton').find(
        (el) => el.getAttribute('aria-label') === 'dagdeel'
      );
      expect(periodBtn).toBeInTheDocument();
    });
  });

  // === Disabled ===
  describe('disabled state', () => {
    it('prevents ArrowUp increment when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimeField.Root defaultValue="10:00" disabled onValueChange={onChange} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      await user.click(hourSeg);
      await user.keyboard('{ArrowUp}');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // === Controlled ===
  describe('controlled value', () => {
    it('displays controlled value', () => {
      render(<TimeField.Root value="14:30" onValueChange={() => {}} />);
      const hourSeg = screen.getAllByRole('spinbutton')[0];
      expect(hourSeg).toHaveAttribute('value', '14');
      const minSeg = screen.getAllByRole('spinbutton')[1];
      expect(minSeg).toHaveAttribute('value', '30');
    });
  });
});
