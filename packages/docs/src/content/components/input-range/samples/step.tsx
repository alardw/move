import { useState } from 'react';
import { InputRange, Stack, Text } from 'move';

export default function StepSample() {
  const [vol, setVol] = useState(0.5);
  const [hour, setHour] = useState(12);
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Volume — step 0.05</Text>
        <InputRange min={0} max={1} step={0.05} value={vol} onValueChange={(v) => setVol(v[0])} showValue />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Hour — step 1, min 0, max 23</Text>
        <InputRange min={0} max={23} step={1} value={hour} onValueChange={(v) => setHour(v[0])} showValue />
      </Stack>
    </Stack>
  );
}
