import { Button, Stack, Text } from 'move';

/**
 * `Button.Group` is a `role="group"` flex row with consistent gap.
 * Use it for dialog footers, segmented action sets, anywhere a small
 * cluster of buttons needs to read as one unit instead of three loose
 * controls in a row.
 */
export default function GroupSample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Dialog footer</Text>
        <Button.Group>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </Button.Group>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Destructive confirm</Text>
        <Button.Group>
          <Button variant="ghost">Keep</Button>
          <Button variant="danger">Delete forever</Button>
        </Button.Group>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Toolbar cluster</Text>
        <Button.Group>
          <Button size="sm" variant="secondary">Bold</Button>
          <Button size="sm" variant="secondary">Italic</Button>
          <Button size="sm" variant="secondary">Underline</Button>
        </Button.Group>
      </Stack>
    </Stack>
  );
}
