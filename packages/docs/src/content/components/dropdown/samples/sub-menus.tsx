import { Button, Dropdown, Icon } from 'move';

export default function SubMenusSample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">
          Edit <Icon name="chevron-down" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Undo</Dropdown.Item>
        <Dropdown.Item>Redo</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Sub>
          <Dropdown.SubTrigger>Convert to…</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item>Text frame</Dropdown.Item>
            <Dropdown.Item>Group</Dropdown.Item>
            <Dropdown.Item>Component</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
        <Dropdown.Sub>
          <Dropdown.SubTrigger>Send to…</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item>Front</Dropdown.Item>
            <Dropdown.Item>Back</Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item>One layer up</Dropdown.Item>
            <Dropdown.Item>One layer down</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
