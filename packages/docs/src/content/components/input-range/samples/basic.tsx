import { useState } from 'react';
import { InputRange, Stack, Text } from 'move';

export default function BasicSample() {
  const [single, setSingle] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 80]);
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Single thumb</Text>
        <InputRange value={single} onValueChange={setSingle} showValue />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Dual-thumb range</Text>
        <InputRange value={range} onValueChange={setRange} showValue />
      </Stack>
    </Stack>
  );
}
