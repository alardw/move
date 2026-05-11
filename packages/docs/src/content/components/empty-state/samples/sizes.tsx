import { Button, EmptyState, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="lg">
      {sizes.map((size) => (
        <Stack key={size} gap="xs">
          <Text size="sm" weight="medium">size="{size}"</Text>
          <EmptyState
            size={size}
            icon="search-x"
            title="No results for that filter"
            description="Loosen the filters and try again, or clear them all to start over."
            action={<Button size="sm" variant="secondary">Clear filters</Button>}
          />
        </Stack>
      ))}
    </Stack>
  );
}
