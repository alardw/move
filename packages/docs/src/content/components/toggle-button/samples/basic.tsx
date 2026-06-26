import { useState } from 'react';
import { Icon, Stack, ToggleButton } from 'move';

export default function BasicSample() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strike, setStrike] = useState(false);
  const [code, setCode] = useState(false);
  const [starred, setStarred] = useState(true);

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" wrap>
        <ToggleButton pressed={bold} onPressedChange={setBold} aria-label="Bold">
          <Icon name="bold" />
        </ToggleButton>
        <ToggleButton pressed={italic} onPressedChange={setItalic} aria-label="Italic">
          <Icon name="italic" />
        </ToggleButton>
        <ToggleButton pressed={underline} onPressedChange={setUnderline} aria-label="Underline">
          <Icon name="underline" />
        </ToggleButton>
        <ToggleButton pressed={strike} onPressedChange={setStrike} aria-label="Strikethrough">
          <Icon name="strikethrough" />
        </ToggleButton>
        <ToggleButton pressed={code} onPressedChange={setCode} aria-label="Code">
          <Icon name="code" />
        </ToggleButton>
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <ToggleButton pressed={starred} onPressedChange={setStarred}>
          <Icon name="star" />
          Starred
        </ToggleButton>
      </Stack>
    </Stack>
  );
}
