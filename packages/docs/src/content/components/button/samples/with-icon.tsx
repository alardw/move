import { Button, Icon, Stack } from 'move';

/**
 * Buttons accept any children, so a leading or trailing icon is just
 * an `<Icon />` next to the label inside a small flex row. The hover
 * spring scales the whole button, glyph included — no extra wiring.
 */
export default function WithIconSample() {
  return (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Button variant="primary">
        <Stack direction="row" gap="xs" align="center">
          <Icon name="plus" />
          New project
        </Stack>
      </Button>
      <Button variant="secondary">
        <Stack direction="row" gap="xs" align="center">
          Continue
          <Icon name="arrow-right" />
        </Stack>
      </Button>
      <Button variant="ghost">
        <Stack direction="row" gap="xs" align="center">
          <Icon name="download" />
          Export CSV
        </Stack>
      </Button>
      <Button variant="danger">
        <Stack direction="row" gap="xs" align="center">
          <Icon name="trash-2" />
          Delete
        </Stack>
      </Button>
    </Stack>
  );
}
