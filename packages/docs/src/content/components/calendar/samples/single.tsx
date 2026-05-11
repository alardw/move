import { useState } from 'react';
import { Calendar, Stack, Text } from 'move';

export default function SingleSample() {
  const [value, setValue] = useState<Date | undefined>(undefined);
  return (
    <Stack gap="sm" align="start">
      <Calendar.Root mode="single" value={value} onValueChange={(d) => setValue(d as Date)}>
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <Text size="sm" color="muted">
        {value ? `Selected: ${value.toLocaleDateString()}` : 'No date selected.'}
      </Text>
    </Stack>
  );
}
