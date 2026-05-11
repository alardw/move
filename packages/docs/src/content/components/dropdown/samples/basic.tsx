import { Button, Dropdown, Icon } from 'move';

export default function BasicSample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">
          Actions <Icon name="chevron-down" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Item>Share</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item disabled>Archive</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
