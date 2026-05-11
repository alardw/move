import { useState } from 'react';
import { NumberInput, Stack, Text } from 'move';

export default function FormatSample() {
  const [usd, setUsd] = useState(49.99);
  const [pct, setPct] = useState(0.15);

  // Round on every commit so we don't accumulate floating-point error
  // (49.99 - 0.01 - 0.01 = 49.97000000000001 in raw IEEE 754).
  const round2 = (n: number) => Math.round(n * 100) / 100;

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">USD currency</Text>
        <NumberInput
          value={usd}
          onValueChange={(n: number) => setUsd(round2(n))}
          min={0}
          step={0.01}
          format={(n: number) => `$${n.toFixed(2)}`}
          parse={(s: string) => Number(s.replace(/[^\d.-]/g, ''))}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Percentage</Text>
        <NumberInput
          value={pct}
          onValueChange={(n: number) => setPct(Math.round(n * 20) / 20)}
          min={0}
          max={1}
          step={0.05}
          format={(n: number) => `${Math.round(n * 100)}%`}
          parse={(s: string) => Number(s.replace('%', '')) / 100}
        />
      </Stack>
    </Stack>
  );
}
