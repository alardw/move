import { CalendarView } from 'move';
import { sampleEvents, sampleStartDate } from './_events';

export default function MonthSample() {
  return (
    <CalendarView.Root defaultView="month" defaultDate={sampleStartDate} events={sampleEvents} showAllDay>
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
