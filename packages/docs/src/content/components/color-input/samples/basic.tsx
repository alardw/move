import { useState } from 'react';
import { ColorInput, FormField, Label } from 'move';

export default function BasicSample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <FormField.Root>
      <FormField.Label>
        <Label>Colour</Label>
      </FormField.Label>
      <FormField.Field>
        <ColorInput value={value} onValueChange={setValue} />
      </FormField.Field>
      <FormField.Description>value: {value}</FormField.Description>
    </FormField.Root>
  );
}
