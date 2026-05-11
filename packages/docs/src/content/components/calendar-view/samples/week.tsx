import { CalendarView } from 'move';
import { sampleEvents, sampleStartDate } from './_events';

export default function WeekSample() {
  return (
    <CalendarView.Root
      defaultView="week"
      defaultDate={sampleStartDate}
      events={sampleEvents}
      startHour={7}
      endHour={20}
      showAllDay
    >
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
