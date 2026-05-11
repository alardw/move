import { useState } from 'react';
import { Icon, Stack, ToggleButton } from 'move';

export default function BasicSample() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  return (
    <Stack direction="row" gap="sm">
      <ToggleButton pressed={bold} onPressedChange={setBold} aria-label="Bold">
        <Icon name="bold" />
      </ToggleButton>
      <ToggleButton pressed={italic} onPressedChange={setItalic} aria-label="Italic">
        <Icon name="italic" />
      </ToggleButton>
    </Stack>
  );
}
