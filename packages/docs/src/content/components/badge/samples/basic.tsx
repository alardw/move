import { Badge, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Badge>New</Badge>
      <Badge color="success">Active</Badge>
      <Badge color="warning">Trial</Badge>
      <Badge color="danger">Past due</Badge>
      <Badge color="info">Beta</Badge>
    </Stack>
  );
}
