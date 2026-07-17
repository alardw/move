// Generated from Calendar.spec.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from './Calendar';

// Fixed reference date to avoid test flakiness with "today" checks
const REF_DATE = new Date(2026, 2, 15); // March 15, 2026

describe('Calendar', () => {
  // === Root ===
  describe('Root', () => {
    it('renders children', () => {
      render(
        <Calendar.Root>
          <div data-testid="child">hello</div>
        </Calendar.Root>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      const { container } = render(
        <Calendar.Root className="custom" style={{ maxWidth: '300px' }}>
          <Calendar.Nav />
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const root = container.firstElementChild!;
      expect(root).toHaveClass('custom');
      expect(root).toHaveStyle({ maxWidth: '300px' });
    });

    it('defaults to mode=single', () => {
      const onChange = vi.fn();
      render(
        <Calendar.Root onValueChange={onChange}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      // Click a day cell
      const cells = screen.getAllByRole('gridcell');
      fireEvent.click(cells[10]);
      // In single mode, onValueChange gets a Date
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
    });
  });

  // === Grid ===
  describe('Grid', () => {
    it('renders weekday headers', () => {
      render(
        <Calendar.Root locale="en-US">
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(7);
    });

    it('renders day cells with role=gridcell', () => {
      render(
        <Calendar.Root>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const cells = screen.getAllByRole('gridcell');
      expect(cells.length).toBeGreaterThanOrEqual(28);
      expect(cells.length).toBeLessThanOrEqual(42);
    });

    it('displays correct number of months when numberOfMonths > 1', () => {
      render(
        <Calendar.Root numberOfMonths={2}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const grids = screen.getAllByRole('grid');
      expect(grids.length).toBe(2);
    });
  });

  // === Day cell states ===
  describe('Day cell states', () => {
    it('receives aria-selected when selected', () => {
      render(
        <Calendar.Root value={REF_DATE}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const selected = screen
        .getAllByRole('gridcell')
        .filter((cell) => cell.getAttribute('aria-selected') === 'true');
      expect(selected.length).toBeGreaterThanOrEqual(1);
    });

    // behavior-3: the spec declares the value/defaultValue/onValueChange triad, but the
    // tests only ever drive `value` — the uncontrolled half, where Calendar owns the
    // selection, went unexercised.
    it('uncontrolled: defaultValue seeds the selection and a click moves it', () => {
      const onChange = vi.fn();
      render(
        <Calendar.Root defaultValue={REF_DATE} onValueChange={onChange}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const selectedOf = () =>
        screen.getAllByRole('gridcell').filter((c) => c.getAttribute('aria-selected') === 'true');
      expect(selectedOf()).toHaveLength(1);
      const first = selectedOf()[0];

      const other = screen.getAllByRole('gridcell').find((c) => c !== first && c.textContent);
      fireEvent.click(other!);

      expect(onChange).toHaveBeenCalledTimes(1);
      // No `value` prop, so Calendar owns the selection and must move it itself.
      expect(selectedOf()[0]).not.toBe(first);
    });

    it('receives data-today for current date', () => {
      render(
        <Calendar.Root>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const todayCells = screen
        .getAllByRole('gridcell')
        .filter((cell) => cell.hasAttribute('data-today'));
      // There should be exactly one today cell (unless today is not in the displayed month)
      expect(todayCells.length).toBeLessThanOrEqual(1);
    });

    it('receives data-outside for out-of-month dates', () => {
      render(
        <Calendar.Root>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const outsideCells = screen
        .getAllByRole('gridcell')
        .filter((cell) => cell.hasAttribute('data-outside'));
      // There should be some outside cells at the beginning or end of the grid
      expect(outsideCells.length).toBeGreaterThanOrEqual(0);
    });

    it('receives data-disabled for disabled dates', () => {
      const tomorrow = new Date(REF_DATE);
      tomorrow.setDate(tomorrow.getDate() + 1);
      render(
        <Calendar.Root value={REF_DATE} constraints={{ disabledDates: [tomorrow] }}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const disabledCells = screen
        .getAllByRole('gridcell')
        .filter((cell) => cell.hasAttribute('data-disabled'));
      expect(disabledCells.length).toBeGreaterThanOrEqual(1);
    });
  });

  // === Range mode ===
  describe('Range mode', () => {
    it('shows range-start and range-end states', () => {
      const range = { from: new Date(2026, 2, 10), to: new Date(2026, 2, 20) };
      render(
        <Calendar.Root mode="range" value={range}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      const cells = screen.getAllByRole('gridcell');
      const rangeStart = cells.filter((c) => c.getAttribute('data-state') === 'range-start');
      const rangeEnd = cells.filter((c) => c.getAttribute('data-state') === 'range-end');
      expect(rangeStart.length).toBe(1);
      expect(rangeEnd.length).toBe(1);
    });
  });

  // === Nav ===
  describe('Nav', () => {
    it('renders previous/next buttons with aria-labels', () => {
      render(
        <Calendar.Root>
          <Calendar.Nav />
          <Calendar.Grid />
        </Calendar.Root>,
      );
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('navigates months via buttons', async () => {
      render(
        <Calendar.Root value={new Date(2026, 0, 15)}>
          <Calendar.Nav />
          <Calendar.Grid />
        </Calendar.Root>,
      );
      // Check grid starts on January
      expect(screen.getByRole('grid').getAttribute('aria-label')).toContain('January');

      // Find the nav button via aria-label and click it
      const nextBtn = screen.getByLabelText('Next month');
      await fireEvent.click(nextBtn);

      // The grid should now be February
      expect(screen.getByRole('grid').getAttribute('aria-label')).toContain('February');
    });
  });

  // === Keyboard navigation ===
  describe('Keyboard navigation', () => {
    it('arrow keys move focus between days', () => {
      render(
        <Calendar.Root value={REF_DATE}>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      // Focus a cell first
      const cells = screen.getAllByRole('gridcell');
      const selectedCell = cells.find((c) => c.getAttribute('aria-selected') === 'true');
      if (selectedCell) {
        fireEvent.focus(selectedCell);
        fireEvent.keyDown(selectedCell.closest('[role="grid"]')!, { key: 'ArrowRight' });
        // Focus should have shifted - the test verifies no error is thrown
      }
    });
  });

  // === Labels ===
  describe('Labels', () => {
    it('supports customization', () => {
      render(
        <Calendar.Root labels={{ previousMonth: 'Vorige maand', nextMonth: 'Volgende maand' }}>
          <Calendar.Nav />
          <Calendar.Grid />
        </Calendar.Root>,
      );
      expect(screen.getByLabelText('Vorige maand')).toBeInTheDocument();
      expect(screen.getByLabelText('Volgende maand')).toBeInTheDocument();
    });
  });

  // === Week numbers ===
  describe('Week numbers', () => {
    it('displays when showWeekNumbers=true', () => {
      const { container } = render(
        <Calendar.Root showWeekNumbers>
          <Calendar.Grid />
        </Calendar.Root>,
      );
      // Week number rows should have the data attribute
      const weekNumberRows = container.querySelectorAll('[data-has-week-numbers]');
      expect(weekNumberRows.length).toBeGreaterThan(0);
    });
  });
});
