import { useState } from 'react';
import { Icon, Stack, Text, ToggleGroup } from 'move';

const variants = ['pills', 'underline'] as const;

export default function VariantsSample() {
  const [value, setValue] = useState<Record<string, string>>({
    pills: 'grid',
    underline: 'grid',
  });

  return (
    <Stack gap="lg">
      {variants.map((v) => (
        <Stack key={v} gap="xs">
          <Text size="sm" weight="medium">variant="{v}"</Text>
          <ToggleGroup.Root
            variant={v}
            value={value[v]}
            onValueChange={(next: string) =>
              next && setValue((s) => ({ ...s, [v]: next }))
            }
          >
            <ToggleGroup.Item value="grid"><Icon name="grid-3x3" /> Grid</ToggleGroup.Item>
            <ToggleGroup.Item value="list"><Icon name="list" /> List</ToggleGroup.Item>
            <ToggleGroup.Item value="kanban"><Icon name="columns-3" /> Kanban</ToggleGroup.Item>
          </ToggleGroup.Root>
        </Stack>
      ))}
    </Stack>
  );
}
