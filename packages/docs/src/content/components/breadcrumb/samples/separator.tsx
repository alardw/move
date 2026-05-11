import { Breadcrumb, Icon, Stack, Text } from 'move';

export default function SeparatorSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Default chevron</Text>
        <Breadcrumb>
          <Breadcrumb.Item><Breadcrumb.Link href="/">Settings</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Link href="/team">Team</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Page>Permissions</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Slash separator</Text>
        <Breadcrumb separator="/">
          <Breadcrumb.Item><Breadcrumb.Link href="/">Acme</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Page>Marketing site</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Custom icon</Text>
        <Breadcrumb separator={<Icon name="chevrons-right" />}>
          <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Link href="/library">Library</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Page>Audio</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb>
      </Stack>
    </Stack>
  );
}
