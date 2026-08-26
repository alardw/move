import { Button, Icon, Stack, Tooltip } from 'move';

export default function BasicSample() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Tooltip label="Save (Cmd+S)">
        <Button variant="secondary" aria-label="Save"><Icon name="save" /></Button>
      </Tooltip>
      <Tooltip label="Delete this item">
        <Button variant="danger" aria-label="Delete"><Icon name="trash-2" /></Button>
      </Tooltip>
      <Tooltip label="Open in new tab">
        <Button variant="ghost" aria-label="Open in new tab"><Icon name="external-link" /></Button>
      </Tooltip>
    </Stack>
  );
}
