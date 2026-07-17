// Generated from CalendarView.spec.ts
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarView } from './CalendarView';
import { useCalendarView } from './useCalendarView';

// Fixed reference date to avoid test flakiness
const REF_DATE = new Date(2026, 2, 15); // March 15, 2026

describe('CalendarView', () => {
  // === Root ===
  describe('Root', () => {
    it('renders children within CalendarViewContext provider', () => {
      render(
        <CalendarView.Root>
          <div data-testid="child">hello</div>
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      const { container } = render(
        <CalendarView.Root className="custom" style={{ maxWidth: '800px' }}>
          <div>content</div>
        </CalendarView.Root>,
      );
      const root = container.firstElementChild!;
      expect(root).toHaveClass('custom');
      expect(root).toHaveStyle({ maxWidth: '800px' });
    });

    it('defaults to view=month', () => {
      render(
        <CalendarView.Root defaultDate={REF_DATE}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('month-view')).toBeInTheDocument();
    });

    it('defaults to date=new Date()', () => {
      render(
        <CalendarView.Root>
          <CalendarView.Title />
        </CalendarView.Root>,
      );
      // The title should contain the current month name
      const titleEl = screen.getByRole('heading', { level: 2 });
      expect(titleEl.textContent).toBeTruthy();
    });
  });

  // === Header ===
  describe('Header', () => {
    it('renders children with flex layout', () => {
      render(
        <CalendarView.Root>
          <CalendarView.Header>
            <span data-testid="header-child">Header content</span>
          </CalendarView.Header>
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('header-child')).toBeInTheDocument();
    });
  });

  // === Nav ===
  describe('Nav', () => {
    it('renders previous and next buttons', () => {
      render(
        <CalendarView.Root>
          <CalendarView.Nav />
        </CalendarView.Root>,
      );
      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
    });

    it('previous button calls goToPrev', () => {
      const onDateChange = vi.fn();
      render(
        <CalendarView.Root defaultDate={REF_DATE} onDateChange={onDateChange}>
          <CalendarView.Nav />
          <CalendarView.Title />
        </CalendarView.Root>,
      );
      const titleBefore = screen.getByRole('heading', { level: 2 }).textContent;
      fireEvent.click(screen.getByLabelText('Previous'));
      const titleAfter = screen.getByRole('heading', { level: 2 }).textContent;
      expect(titleAfter).not.toBe(titleBefore);
    });

    it('next button calls goToNext', () => {
      const onDateChange = vi.fn();
      render(
        <CalendarView.Root defaultDate={REF_DATE} onDateChange={onDateChange}>
          <CalendarView.Nav />
          <CalendarView.Title />
        </CalendarView.Root>,
      );
      const titleBefore = screen.getByRole('heading', { level: 2 }).textContent;
      fireEvent.click(screen.getByLabelText('Next'));
      const titleAfter = screen.getByRole('heading', { level: 2 }).textContent;
      expect(titleAfter).not.toBe(titleBefore);
    });
  });

  // === Title ===
  describe('Title', () => {
    it('renders h2 with aria-live="polite"', () => {
      render(
        <CalendarView.Root>
          <CalendarView.Title />
        </CalendarView.Root>,
      );
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveAttribute('aria-live', 'polite');
    });

    it('displays computed title string based on current view and date', () => {
      render(
        <CalendarView.Root defaultDate={REF_DATE} defaultView="month">
          <CalendarView.Title />
        </CalendarView.Root>,
      );
      const h2 = screen.getByRole('heading', { level: 2 });
      // Should contain "March" and "2026" for month view
      expect(h2.textContent).toContain('March');
      expect(h2.textContent).toContain('2026');
    });
  });

  // === Today ===
  describe('Today', () => {
    it('displays labels.today text', () => {
      render(
        <CalendarView.Root>
          <CalendarView.Today />
        </CalendarView.Root>,
      );
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('calls goToToday on click', () => {
      const onDateChange = vi.fn();
      render(
        <CalendarView.Root defaultDate={new Date(2020, 0, 1)} onDateChange={onDateChange}>
          <CalendarView.Today />
        </CalendarView.Root>,
      );
      fireEvent.click(screen.getByText('Today'));
      expect(onDateChange).toHaveBeenCalledTimes(1);
    });
  });

  // === ViewSwitcher ===
  describe('ViewSwitcher', () => {
    it('renders with view options', () => {
      render(
        <CalendarView.Root>
          <CalendarView.ViewSwitcher />
        </CalendarView.Root>,
      );
      expect(screen.getByText('Day')).toBeInTheDocument();
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Agenda')).toBeInTheDocument();
    });

    it('respects custom views prop to show subset', () => {
      render(
        <CalendarView.Root>
          <CalendarView.ViewSwitcher views={['day', 'month']} />
        </CalendarView.Root>,
      );
      expect(screen.getByText('Day')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.queryByText('Week')).not.toBeInTheDocument();
      expect(screen.queryByText('Agenda')).not.toBeInTheDocument();
    });
  });

  // === Body ===
  describe('Body', () => {
    it('renders MonthView when view=month', () => {
      render(
        <CalendarView.Root defaultView="month" defaultDate={REF_DATE}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('month-view')).toBeInTheDocument();
    });

    it('renders DayView when view=day', () => {
      render(
        <CalendarView.Root defaultView="day" defaultDate={REF_DATE}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('day-view')).toBeInTheDocument();
    });

    it('renders WeekView when view=week', () => {
      render(
        <CalendarView.Root defaultView="week" defaultDate={REF_DATE}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('week-view')).toBeInTheDocument();
    });

    it('renders AgendaView when view=agenda', () => {
      render(
        <CalendarView.Root defaultView="agenda" defaultDate={REF_DATE}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('agenda-view')).toBeInTheDocument();
    });
  });

  // === AgendaView ===
  describe('AgendaView', () => {
    it('shows empty message when no events', () => {
      render(
        <CalendarView.Root defaultView="agenda" defaultDate={REF_DATE} events={[]}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByText('No events in this period')).toBeInTheDocument();
    });
  });

  // === Controlled props ===
  describe('Controlled props', () => {
    it('controlled view prop overrides internal state', () => {
      render(
        <CalendarView.Root view="day" defaultDate={REF_DATE}>
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      expect(screen.getByTestId('day-view')).toBeInTheDocument();
    });

    it('onViewChange fires when view changes', () => {
      const onViewChange = vi.fn();
      render(
        <CalendarView.Root defaultView="month" onViewChange={onViewChange} defaultDate={REF_DATE}>
          <CalendarView.ViewSwitcher />
          <CalendarView.Body />
        </CalendarView.Root>,
      );
      fireEvent.click(screen.getByText('Day'));
      expect(onViewChange).toHaveBeenCalledWith('day');
    });
  });

  // === Labels ===
  describe('Labels', () => {
    it('supports full customization', () => {
      render(
        <CalendarView.Root labels={{ today: 'Vandaag', previous: 'Vorige', next: 'Volgende' }}>
          <CalendarView.Nav />
          <CalendarView.Today />
        </CalendarView.Root>,
      );
      expect(screen.getByText('Vandaag')).toBeInTheDocument();
      expect(screen.getByLabelText('Vorige')).toBeInTheDocument();
      expect(screen.getByLabelText('Volgende')).toBeInTheDocument();
    });
  });

  // === useCalendarView hook ===
  describe('useCalendarView', () => {
    it('returns expected interface', () => {
      const { result } = renderHook(() => useCalendarView({ defaultDate: REF_DATE }));
      expect(result.current.view).toBe('month');
      expect(result.current.date).toBeInstanceOf(Date);
      expect(typeof result.current.setView).toBe('function');
      expect(typeof result.current.setDate).toBe('function');
      expect(typeof result.current.goToToday).toBe('function');
      expect(typeof result.current.goToPrev).toBe('function');
      expect(typeof result.current.goToNext).toBe('function');
      expect(typeof result.current.title).toBe('string');
      expect(result.current.labels.today).toBe('Today');
    });
  });
});
