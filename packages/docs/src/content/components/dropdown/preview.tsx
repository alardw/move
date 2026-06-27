import { Button, Dropdown, Icon } from 'move';
import { StagedOverlay } from '../../../components';

/** Card-only preview: the menu staged open and inert; the trigger anchors it. */
export default function DropdownPreview() {
  return (
    <StagedOverlay>
      {({ container, root, content }) => (
        <Dropdown.Root {...root}>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              Actions <Icon name="chevron-down" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content container={container} {...content}>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Item>Duplicate</Dropdown.Item>
            <Dropdown.Item>Share</Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item disabled>Archive</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      )}
    </StagedOverlay>
  );
}
