import { Icon, InputText, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <InputText aria-label="Default outlined input" placeholder="Default outlined input" />
      <InputText aria-label="Filled variant" variant="filled" placeholder="Filled variant" />
      <InputText aria-label="With a leading icon" placeholder="With a leading icon" iconLeft={<Icon name="search" />} />
      <InputText aria-label="With a trailing icon" placeholder="With a trailing icon" iconRight={<Icon name="x" />} />
      <Text size="sm" color="muted">All four are real `&lt;input&gt;`s — paste, type, tab through them like normal.</Text>
    </Stack>
  );
}
