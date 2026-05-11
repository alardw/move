import { Link, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <Text>
        Read more in the <Link href="#installation">installation guide</Link>, or jump straight to the{' '}
        <Link href="#components" variant="muted">component overview</Link>.
      </Text>
      <Text>
        Visit the <Link href="https://github.com" external>GitHub repo</Link> for the source.
      </Text>
    </Stack>
  );
}
