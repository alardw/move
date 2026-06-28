import { useState } from 'react';
import { Card, ColorPicker, Stack, Text } from 'move';

/**
 * `ColorPicker` ships chromeless on purpose — it’s designed to live inside
 * a popover (`ColorInput` provides one), so the surrounding container is
 * yours to style. For the docs we wrap it in a Card so it reads as a
 * self-contained widget.
 */
export default function BasicSample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <Stack gap="sm" align="start">
      <Card.Root>
        <Card.Body>
          <ColorPicker value={value} onValueChange={setValue} />
        </Card.Body>
      </Card.Root>
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
