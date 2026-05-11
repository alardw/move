// Shared events for CalendarView samples — anchored on the current week
// so the previews always have something to show.

const today = new Date();
const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const dayInWeek = (offset: number, hour: number, minute = 0) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset, hour, minute);

export const sampleEvents = [
  { id: '1', title: 'Team standup', start: dayInWeek(0, 9, 0), end: dayInWeek(0, 9, 30), color: 'primary' as const },
  { id: '2', title: 'Design review', start: dayInWeek(0, 14, 0), end: dayInWeek(0, 15, 0), color: 'violet' as const },
  { id: '3', title: 'Sprint planning', start: dayInWeek(1, 10, 0), end: dayInWeek(1, 11, 30), color: 'success' as const },
  { id: '4', title: 'Company all-hands', start: dayInWeek(2, 0, 0), allDay: true, color: 'warning' as const },
  { id: '5', title: 'Lunch & learn', start: dayInWeek(3, 12, 0), end: dayInWeek(3, 13, 0), color: 'danger' as const },
  { id: '6', title: 'Code freeze', start: dayInWeek(4, 17, 0), end: dayInWeek(4, 17, 30), color: 'indigo' as const },
];

export const sampleStartDate = start;
