import { CalendarView } from 'move';
import { sampleEvents, sampleStartDate } from './_events';

export default function DaySample() {
  return (
    <CalendarView.Root
      defaultView="day"
      defaultDate={sampleStartDate}
      events={sampleEvents}
      startHour={6}
      endHour={22}
      slotInterval={30}
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
