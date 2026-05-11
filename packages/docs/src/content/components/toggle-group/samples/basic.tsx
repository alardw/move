import { useState } from 'react';
import { Icon, Stack, Text, ToggleGroup } from 'move';

export default function BasicSample() {
  const [view, setView] = useState('grid');
  const [formats, setFormats] = useState<string[]>(['bold']);

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Single-select (radio)</Text>
        <ToggleGroup.Root type="single" value={view} onValueChange={(v: string) => v && setView(v)}>
          <ToggleGroup.Item value="grid"><Icon name="grid-3x3" /> Grid</ToggleGroup.Item>
          <ToggleGroup.Item value="list"><Icon name="list" /> List</ToggleGroup.Item>
          <ToggleGroup.Item value="kanban"><Icon name="columns-3" /> Kanban</ToggleGroup.Item>
        </ToggleGroup.Root>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Multi-select</Text>
        <ToggleGroup.Root type="multiple" value={formats} onValueChange={setFormats}>
          <ToggleGroup.Item value="bold" aria-label="Bold"><Icon name="bold" /></ToggleGroup.Item>
          <ToggleGroup.Item value="italic" aria-label="Italic"><Icon name="italic" /></ToggleGroup.Item>
          <ToggleGroup.Item value="underline" aria-label="Underline"><Icon name="underline" /></ToggleGroup.Item>
        </ToggleGroup.Root>
      </Stack>
    </Stack>
  );
}
