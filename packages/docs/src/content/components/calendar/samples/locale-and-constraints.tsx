import { useState } from 'react';
import { Calendar, Stack, Text } from 'move';

const today = new Date();
const min = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const max = new Date(today.getFullYear(), today.getMonth() + 2, 0);

/**
 * `locale` flips day/month names and the week start; `constraints`
 * disable past dates, weekends, and any specific blackout dates so
 * users can only pick a valid day.
 */
export default function LocaleAndConstraintsSample() {
  const [value, setValue] = useState<Date | undefined>(undefined);
  return (
    <Stack gap="sm" align="start">
      <Calendar.Root
        mode="single"
        locale="nl-NL"
        weekStartsOn={1}
        value={value}
        onValueChange={(d) => setValue(d as Date)}
        constraints={{
          min,
          max,
          disabledDaysOfWeek: [0, 6],
        }}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <Text size="sm" color="muted">
        Dutch locale, week starts on Monday, weekends and dates outside today–end-of-month-after-next are disabled.
      </Text>
    </Stack>
  );
}
