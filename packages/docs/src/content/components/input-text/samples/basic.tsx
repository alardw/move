import { Icon, InputText, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <InputText placeholder="Default outlined input" />
      <InputText variant="filled" placeholder="Filled variant" />
      <InputText placeholder="With a leading icon" iconLeft={<Icon name="search" />} />
      <InputText placeholder="With a trailing icon" iconRight={<Icon name="x" />} />
      <Text size="sm" color="muted">All four are real `&lt;input&gt;`s — paste, type, tab through them like normal.</Text>
    </Stack>
  );
}
