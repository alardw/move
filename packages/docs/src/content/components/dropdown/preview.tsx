import { Button, Dropdown, Icon } from 'move';
import { StagedOverlay } from '../../../components';

/** Card-only preview: the menu staged open and inert; the trigger anchors it. */
export default function DropdownPreview() {
  return (
    <StagedOverlay align="start">
      {({ container, root, content }) => (
        <Dropdown.Root {...root} animations={false}>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              Actions <Icon name="chevron-down" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content container={container} {...content}>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Item>Duplicate</Dropdown.Item>
            <Dropdown.Item>Share</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      )}
    </StagedOverlay>
  );
}
