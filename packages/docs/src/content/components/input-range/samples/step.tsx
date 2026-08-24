import { useState } from 'react';
import { FormField, InputRange, Label, Stack } from 'move';

export default function StepSample() {
  const [vol, setVol] = useState(0.5);
  const [hour, setHour] = useState(12);
  return (
    <Stack gap="lg">
      <FormField.Root>
        <FormField.Label>
          <Label>Volume</Label>
        </FormField.Label>
        <FormField.Field>
          <InputRange
            min={0}
            max={1}
            step={0.05}
            value={vol}
            onValueChange={(v) => setVol(v[0])}
            showValue
          />
        </FormField.Field>
        <FormField.Description>step 0.05</FormField.Description>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>
          <Label>Hour</Label>
        </FormField.Label>
        <FormField.Field>
          <InputRange
            min={0}
            max={23}
            step={1}
            value={hour}
            onValueChange={(v) => setHour(v[0])}
            showValue
          />
        </FormField.Field>
        <FormField.Description>step 1, min 0, max 23</FormField.Description>
      </FormField.Root>
    </Stack>
  );
}
