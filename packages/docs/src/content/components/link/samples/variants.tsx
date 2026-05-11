import { Link, Stack, Text } from 'move';

export default function VariantsSample() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" weight="medium">underline="always"</Text>
        <Text>The <Link href="#" underline="always">link</Link> stays underlined.</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">underline="hover" (default)</Text>
        <Text>The <Link href="#">link</Link> underlines on hover.</Text>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">underline="none"</Text>
        <Text>The <Link href="#" underline="none">link</Link> never underlines.</Text>
      </Stack>
    </Stack>
  );
}
