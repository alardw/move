import { useState } from 'react';
import { Stack, Text, TimeField } from 'move';

export default function BasicSample() {
  const [time, setTime] = useState('09:30');
  return (
    <Stack gap="sm" align="start">
      <TimeField value={time} onValueChange={setTime} />
      <Text size="sm" color="muted">value: {time}</Text>
    </Stack>
  );
}
