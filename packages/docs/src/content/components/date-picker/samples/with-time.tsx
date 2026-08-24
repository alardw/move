import { useState } from 'react';
import { DatePicker, FormField, Label, Stack } from 'move';

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
      <FormField.Root>
        <FormField.Label>
          <Label>24-hour clock (default)</Label>
        </FormField.Label>
        <FormField.Field>
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
        </FormField.Field>
        <FormField.Description>
          {date24
            ? `Selected: ${date24.toLocaleString()}`
            : 'Hour and minute number fields, no AM/PM.'}
        </FormField.Description>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>12-hour clock with AM/PM</Label>
        </FormField.Label>
        <FormField.Field>
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
        </FormField.Field>
        <FormField.Description>
          {date12
            ? `Selected: ${date12.toLocaleString()}`
            : 'Adds an AM/PM toggle to the right of the time fields.'}
        </FormField.Description>
      </FormField.Root>
    </Stack>
  );
}
