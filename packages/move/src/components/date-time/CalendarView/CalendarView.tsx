'use client';
// Generated from CalendarView.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
// Provenance: original-components/date-time/CalendarView/CalendarView.tsx

import * as React from 'react';
import { useCalendarView } from './useCalendarView';
import type { UseCalendarViewOptions } from './useCalendarView';
import type { CalendarViewMode } from '../_shared/types';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { AgendaView } from './AgendaView';
import { Button } from '../../actions/Button';
import { Icon } from '../../../infrastructure/Icon';
import { ToggleGroup } from '../../actions/ToggleGroup';
import styles from './CalendarView.module.css';

// ============================================================================
// Context
// ============================================================================

interface CalendarViewContextValue extends ReturnType<typeof useCalendarView> {}

const CalendarViewContext = React.createContext<CalendarViewContextValue | null>(null);

function useCalendarViewContext() {
  const ctx = React.useContext(CalendarViewContext);
  if (!ctx) {
    throw new Error('CalendarView components must be used within CalendarView.Root');
  }
  return ctx;
}

// ============================================================================
// Root
// ============================================================================

export interface CalendarViewRootProps extends UseCalendarViewOptions {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CalendarViewRoot: React.FC<CalendarViewRootProps> = ({
  children,
  className,
  style,
  ...options
}) => {
  const ctx = useCalendarView(options);

  return (
    <CalendarViewContext.Provider value={ctx}>
      <div className={`${styles.root} ${className ?? ''}`} style={style}>
        {children}
      </div>
    </CalendarViewContext.Provider>
  );
};
CalendarViewRoot.displayName = 'CalendarView.Root';

// ============================================================================
// Header
// ============================================================================

export interface CalendarViewHeaderProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CalendarViewHeader: React.FC<CalendarViewHeaderProps> = ({
  children,
  className,
  style,
}) => (
  <div className={`${styles.header} ${className ?? ''}`} style={style}>
    {children}
  </div>
);
CalendarViewHeader.displayName = 'CalendarView.Header';

// ============================================================================
// Nav
// ============================================================================

export interface CalendarViewNavProps {
  className?: string;
}

const CalendarViewNav: React.FC<CalendarViewNavProps> = ({ className }) => {
  const { goToPrev, goToNext, labels } = useCalendarViewContext();

  return (
    <Button.Group className={`${styles.nav} ${className ?? ''}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={goToPrev}
        aria-label={labels.previous}
      >
        <Icon name="chevron-left" size="sm" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={goToNext}
        aria-label={labels.next}
      >
        <Icon name="chevron-right" size="sm" />
      </Button>
    </Button.Group>
  );
};
CalendarViewNav.displayName = 'CalendarView.Nav';

// ============================================================================
// Title
// ============================================================================

export interface CalendarViewTitleProps {
  className?: string;
}

const CalendarViewTitle: React.FC<CalendarViewTitleProps> = ({ className }) => {
  const { title } = useCalendarViewContext();
  return (
    <h2 className={`${styles.title} ${className ?? ''}`} aria-live="polite">
      {title}
    </h2>
  );
};
CalendarViewTitle.displayName = 'CalendarView.Title';

// ============================================================================
// Today button
// ============================================================================

export interface CalendarViewTodayProps {
  className?: string;
  children?: React.ReactNode;
}

const CalendarViewToday: React.FC<CalendarViewTodayProps> = ({
  className,
  children,
}) => {
  const { goToToday, labels } = useCalendarViewContext();
  return (
    <Button
      variant="secondary"
      size="sm"
      className={className}
      onClick={goToToday}
    >
      {children ?? labels.today}
    </Button>
  );
};
CalendarViewToday.displayName = 'CalendarView.Today';

// ============================================================================
// ViewSwitcher
// ============================================================================

export interface CalendarViewViewSwitcherProps {
  className?: string;
  views?: CalendarViewMode[];
}

const CalendarViewSwitcher: React.FC<CalendarViewViewSwitcherProps> = ({
  className,
  views = ['day', 'week', 'month', 'agenda'],
}) => {
  const { view, setView, labels } = useCalendarViewContext();

  const viewLabels: Record<CalendarViewMode, string> = {
    day: labels.day,
    week: labels.week,
    month: labels.month,
    agenda: labels.agenda,
  };

  return (
    <ToggleGroup.Root
      className={className}
      value={view}
      onValueChange={(v: string) => setView(v as CalendarViewMode)}
      size="sm"
      aria-label={labels.calendarView}
    >
      {views.map((v) => (
        <ToggleGroup.Item key={v} value={v}>
          {viewLabels[v]}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
CalendarViewSwitcher.displayName = 'CalendarView.ViewSwitcher';

// ============================================================================
// Body
// ============================================================================

export interface CalendarViewBodyProps {
  className?: string;
  style?: React.CSSProperties;
}

const CalendarViewBody: React.FC<CalendarViewBodyProps> = ({
  className,
  style,
}) => {
  const {
    view,
    date,
    events,
    locale,
    weekStartsOn,
    startHour,
    endHour,
    slotHeight,
    slotInterval,
    maxEventsPerCell,
    renderEvent,
    onEventClick,
    onSlotClick,
    onDayClick,
    onAllDayClick,
    showAllDay,
    labels,
    setDate,
    setView,
  } = useCalendarViewContext();

  const handleDayClick = React.useCallback(
    (clickedDate: Date, e: React.MouseEvent) => {
      onDayClick?.(clickedDate, e);
      setDate(clickedDate);
      setView('day');
    },
    [onDayClick, setDate, setView]
  );

  return (
    <div className={`${styles.body} ${className ?? ''}`} style={style}>
      {view === 'day' && (
        <DayView
          date={date}
          events={events}
          locale={locale}
          startHour={startHour}
          endHour={endHour}
          slotHeight={slotHeight}
          slotInterval={slotInterval}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
          onAllDayClick={onAllDayClick}
          showAllDay={showAllDay}
          allDayLabel={labels.allDay}
        />
      )}
      {view === 'week' && (
        <WeekView
          date={date}
          events={events}
          locale={locale}
          weekStartsOn={weekStartsOn}
          startHour={startHour}
          endHour={endHour}
          slotHeight={slotHeight}
          slotInterval={slotInterval}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
          onAllDayClick={onAllDayClick}
          showAllDay={showAllDay}
          allDayLabel={labels.allDay}
        />
      )}
      {view === 'month' && (
        <MonthView
          date={date}
          events={events}
          locale={locale}
          weekStartsOn={weekStartsOn}
          maxEventsPerCell={maxEventsPerCell}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          onDayClick={handleDayClick}
          moreLabel={labels.more}
        />
      )}
      {view === 'agenda' && (
        <AgendaView
          startDate={date}
          events={events}
          locale={locale}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          noEventsLabel={labels.noEvents}
        />
      )}
    </div>
  );
};
CalendarViewBody.displayName = 'CalendarView.Body';

// ============================================================================
// Export
// ============================================================================

export const CalendarView = {
  Root: CalendarViewRoot,
  Header: CalendarViewHeader,
  Nav: CalendarViewNav,
  Title: CalendarViewTitle,
  Today: CalendarViewToday,
  ViewSwitcher: CalendarViewSwitcher,
  Body: CalendarViewBody,
};
