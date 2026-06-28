import { Stack, Tabs, Text } from 'move';

const variants = ['underline', 'pills'] as const;

export default function VariantsSample() {
  return (
    <Stack gap="lg">
      {variants.map((v) => (
        <Stack key={v} gap="xs">
          <Text size="sm" weight="medium">variant="{v}"</Text>
          <Tabs.Root defaultValue="day">
            <Tabs.List variant={v}>
              <Tabs.Trigger value="day">Day</Tabs.Trigger>
              <Tabs.Trigger value="week">Week</Tabs.Trigger>
              <Tabs.Trigger value="month">Month</Tabs.Trigger>
              <Tabs.Trigger value="year">Year</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="day">
              <Stack padding="md"><Text size="sm" color="muted">Daily view content</Text></Stack>
            </Tabs.Content>
            <Tabs.Content value="week">
              <Stack padding="md"><Text size="sm" color="muted">Weekly view content</Text></Stack>
            </Tabs.Content>
            <Tabs.Content value="month">
              <Stack padding="md"><Text size="sm" color="muted">Monthly view content</Text></Stack>
            </Tabs.Content>
            <Tabs.Content value="year">
              <Stack padding="md"><Text size="sm" color="muted">Yearly view content</Text></Stack>
            </Tabs.Content>
          </Tabs.Root>
        </Stack>
      ))}
    </Stack>
  );
}
