import { useState } from 'react';
import { Calendar, Stack, Text } from 'move';

const today = new Date();
const sameMonth = (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

const events = [
  { id: '1', title: 'Design review', start: sameMonth(0), color: 'primary' as const },
  { id: '2', title: 'Quarterly planning', start: sameMonth(2), color: 'success' as const },
  { id: '3', title: '1:1 with Mira', start: sameMonth(2), color: 'warning' as const },
  { id: '4', title: 'Customer interview', start: sameMonth(5), color: 'info' as const },
  { id: '5', title: 'Release window', start: sameMonth(7), end: sameMonth(8), color: 'danger' as const },
];

export default function WithEventsSample() {
  const [value, setValue] = useState<Date | undefined>(today);
  return (
    <Stack gap="sm" align="start">
      <Calendar.Root
        mode="single"
        value={value}
        onValueChange={(d) => setValue(d as Date)}
        events={events}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <Text size="sm" color="muted">
        Days with events show a coloured dot — pass `renderEvent` to take over the rendering.
      </Text>
    </Stack>
  );
}
