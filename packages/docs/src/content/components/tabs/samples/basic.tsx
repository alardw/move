import { Stack, Tabs, Text } from 'move';

export default function BasicSample() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <Stack gap="sm" padding="md">
          <Text weight="medium">Overview</Text>
          <Text size="sm" color="muted">High-level summary of this project — recent activity, open issues, owners.</Text>
        </Stack>
      </Tabs.Content>
      <Tabs.Content value="activity">
        <Stack gap="sm" padding="md">
          <Text weight="medium">Activity</Text>
          <Text size="sm" color="muted">A timeline of pushes, comments, and merges.</Text>
        </Stack>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <Stack gap="sm" padding="md">
          <Text weight="medium">Settings</Text>
          <Text size="sm" color="muted">Permissions, integrations, and webhook URLs.</Text>
        </Stack>
      </Tabs.Content>
    </Tabs.Root>
  );
}
