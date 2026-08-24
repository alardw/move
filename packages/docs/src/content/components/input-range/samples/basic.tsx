import { useState } from 'react';
import { FormField, InputRange, Label, Stack } from 'move';

export default function BasicSample() {
  const [single, setSingle] = useState(40);
  const [range, setRange] = useState<number[]>([20, 80]);
  return (
    <Stack gap="lg">
      <FormField.Root>
        <FormField.Label>
          <Label>Single thumb</Label>
        </FormField.Label>
        <FormField.Field>
          <InputRange value={single} onValueChange={(v) => setSingle(v[0])} showValue />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Dual-thumb range</Label>
        </FormField.Label>
        <FormField.Field>
          <InputRange value={range} onValueChange={setRange} showValue />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
