import { Button, Icon, Stack, Tooltip } from 'move';

export default function BasicSample() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Tooltip label="Save (Cmd+S)">
        <Button variant="secondary"><Icon name="save" /></Button>
      </Tooltip>
      <Tooltip label="Delete this item">
        <Button variant="danger"><Icon name="trash-2" /></Button>
      </Tooltip>
      <Tooltip label="Open in new tab">
        <Button variant="ghost"><Icon name="external-link" /></Button>
      </Tooltip>
    </Stack>
  );
}
