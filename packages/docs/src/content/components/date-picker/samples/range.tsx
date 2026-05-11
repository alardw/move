import { useState } from 'react';
import { DatePicker, Stack, Text } from 'move';

export default function RangeSample() {
  const [value, setValue] = useState<{ from: Date; to: Date } | undefined>(undefined);
  return (
    <Stack gap="sm" align="start">
      <DatePicker.Root mode="range" value={value} onValueChange={(d) => setValue(d as { from: Date; to: Date })}>
        <DatePicker.Trigger>
          <DatePicker.Input />
        </DatePicker.Trigger>
        <DatePicker.Content />
      </DatePicker.Root>
      <Text size="sm" color="muted">
        {value?.from && value?.to
          ? `Range: ${value.from.toLocaleDateString()} – ${value.to.toLocaleDateString()}`
          : 'Pick a start, then an end.'}
      </Text>
    </Stack>
  );
}
