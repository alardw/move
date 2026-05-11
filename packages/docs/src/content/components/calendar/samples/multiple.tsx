import { useState } from 'react';
import { Calendar, Stack, Text } from 'move';

export default function MultipleSample() {
  const [value, setValue] = useState<Date[]>([]);
  return (
    <Stack gap="sm" align="start">
      <Calendar.Root
        mode="multiple"
        value={value}
        onValueChange={(d) => setValue(d as Date[])}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <Text size="sm" color="muted">
        {value.length === 0
          ? 'Click days to toggle them on. Click again to remove.'
          : `${value.length} date${value.length === 1 ? '' : 's'} selected.`}
      </Text>
    </Stack>
  );
}
