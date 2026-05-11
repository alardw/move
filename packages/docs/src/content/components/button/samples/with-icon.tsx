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
          <span>New project</span>
        </Stack>
      </Button>
      <Button variant="secondary">
        <Stack direction="row" gap="xs" align="center">
          <span>Continue</span>
          <Icon name="arrow-right" />
        </Stack>
      </Button>
      <Button variant="ghost">
        <Stack direction="row" gap="xs" align="center">
          <Icon name="download" />
          <span>Export CSV</span>
        </Stack>
      </Button>
      <Button variant="danger">
        <Stack direction="row" gap="xs" align="center">
          <Icon name="trash-2" />
          <span>Delete</span>
        </Stack>
      </Button>
    </Stack>
  );
}
