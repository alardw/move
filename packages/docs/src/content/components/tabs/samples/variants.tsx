import { Stack, Tabs, Text } from 'move';

const variants = ['underline', 'pill'] as const;

export default function VariantsSample() {
  return (
    <Stack gap="lg">
      {variants.map((v) => (
        <Stack key={v} gap="xs">
          <Text size="sm" weight="medium">variant="{v}"</Text>
          <Tabs.Root defaultValue="day" variant={v}>
            <Tabs.List>
              <Tabs.Trigger value="day">Day</Tabs.Trigger>
              <Tabs.Trigger value="week">Week</Tabs.Trigger>
              <Tabs.Trigger value="month">Month</Tabs.Trigger>
              <Tabs.Trigger value="year">Year</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="day">
              <Text size="sm" color="muted" style={{ padding: 'var(--move-spacing-md)' }}>Daily view content</Text>
            </Tabs.Content>
            <Tabs.Content value="week">
              <Text size="sm" color="muted" style={{ padding: 'var(--move-spacing-md)' }}>Weekly view content</Text>
            </Tabs.Content>
            <Tabs.Content value="month">
              <Text size="sm" color="muted" style={{ padding: 'var(--move-spacing-md)' }}>Monthly view content</Text>
            </Tabs.Content>
            <Tabs.Content value="year">
              <Text size="sm" color="muted" style={{ padding: 'var(--move-spacing-md)' }}>Yearly view content</Text>
            </Tabs.Content>
          </Tabs.Root>
        </Stack>
      ))}
    </Stack>
  );
}
