import { useState } from 'react';
import { Button, CalendarView, Stack, Text } from 'move';
import { sampleEvents, sampleStartDate } from './_events';

type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda';

/**
 * Controlled `view` and `date` let outside controls drive the calendar.
 * Useful when a route param picks the view, or when an "Open in week"
 * button on a detail page needs to jump straight to a specific day.
 */
export default function ControlledSample() {
  const [view, setView] = useState<CalendarViewMode>('week');
  const [date, setDate] = useState<Date>(sampleStartDate);

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center" wrap>
        <Button size="sm" variant="secondary" onClick={() => setView('day')}>Day</Button>
        <Button size="sm" variant="secondary" onClick={() => setView('week')}>Week</Button>
        <Button size="sm" variant="secondary" onClick={() => setView('month')}>Month</Button>
        <Button size="sm" variant="secondary" onClick={() => setView('agenda')}>Agenda</Button>
        <Text size="sm" color="muted">Current: {view} · {date.toLocaleDateString()}</Text>
      </Stack>
      <CalendarView.Root
        view={view}
        onViewChange={setView}
        date={date}
        onDateChange={setDate}
        events={sampleEvents}
      >
        <CalendarView.Header>
          <CalendarView.Nav />
          <CalendarView.Title />
          <CalendarView.Today />
        </CalendarView.Header>
        <CalendarView.Body />
      </CalendarView.Root>
    </Stack>
  );
}
