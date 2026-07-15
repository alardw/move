import { useState } from 'react';
import { NumberInput, Stack, Text } from 'move';

export default function BasicSample() {
  const [qty, setQty] = useState(1);
  return (
    <Stack gap="sm" align="start">
      <NumberInput aria-label="Quantity" value={qty} onValueChange={(n) => setQty(n ?? 0)} min={0} max={99} />
      <Text size="sm" color="muted">value: {qty}</Text>
    </Stack>
  );
}
