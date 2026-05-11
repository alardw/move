import { CalendarView } from 'move';
import { sampleEvents, sampleStartDate } from './_events';

/**
 * Agenda view collapses the grid into a chronological list — perfect
 * for narrow screens, sidebars, and "what’s next" summaries.
 */
export default function AgendaSample() {
  return (
    <CalendarView.Root defaultView="agenda" defaultDate={sampleStartDate} events={sampleEvents}>
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
        <CalendarView.ViewSwitcher />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  );
}
