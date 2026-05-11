import { useState } from 'react';
import { DatePicker, Stack, Text } from 'move';

/**
 * `showTime` integrates a `TimeField` into the popover. Pass `true` for
 * the default 24-hour clock, or `{ hourCycle: 12 }` to get an AM/PM
 * toggle next to the hour and minute inputs. `closeOnSelect={false}`
 * keeps the popover open while the time is set.
 */
export default function WithTimeSample() {
  const [date24, setDate24] = useState<Date | undefined>(undefined);
  const [date12, setDate12] = useState<Date | undefined>(undefined);

  return (
    <Stack gap="lg">
      <Stack gap="xs" align="start">
        <Text size="sm" weight="medium">24-hour clock (default)</Text>
        <DatePicker.Root
          mode="single"
          showTime
          value={date24}
          onValueChange={(d) => setDate24(d as Date)}
          closeOnSelect={false}
        >
          <DatePicker.Trigger>
            <DatePicker.Input placeholder="Pick a date and time" />
          </DatePicker.Trigger>
          <DatePicker.Content />
        </DatePicker.Root>
        <Text size="sm" color="muted">
          {date24 ? `Selected: ${date24.toLocaleString()}` : 'Hour and minute number fields, no AM/PM.'}
        </Text>
      </Stack>
      <Stack gap="xs" align="start">
        <Text size="sm" weight="medium">12-hour clock with AM/PM</Text>
        <DatePicker.Root
          mode="single"
          showTime={{ hourCycle: 12 }}
          value={date12}
          onValueChange={(d) => setDate12(d as Date)}
          closeOnSelect={false}
        >
          <DatePicker.Trigger>
            <DatePicker.Input placeholder="Pick a date and time" />
          </DatePicker.Trigger>
          <DatePicker.Content />
        </DatePicker.Root>
        <Text size="sm" color="muted">
          {date12 ? `Selected: ${date12.toLocaleString()}` : 'Adds an AM/PM toggle to the right of the time fields.'}
        </Text>
      </Stack>
    </Stack>
  );
}
