import { Button, Dropdown, Icon } from 'move';

export default function GroupedSample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">
          File <Icon name="chevron-down" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.Label>Document</Dropdown.Label>
          <Dropdown.Item>New</Dropdown.Item>
          <Dropdown.Item>Open…</Dropdown.Item>
          <Dropdown.Item>Save</Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Label>Export</Dropdown.Label>
          <Dropdown.Item>Export as PDF</Dropdown.Item>
          <Dropdown.Item>Export as PNG</Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
