import { useState } from 'react';
import { ColorInput, Stack, Text } from 'move';

export default function BasicSample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <Stack gap="sm" align="start">
      <ColorInput aria-label="Colour" value={value} onValueChange={setValue} />
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
