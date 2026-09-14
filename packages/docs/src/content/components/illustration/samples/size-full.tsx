import { Illustration, Link, Stack, Text } from 'move';
import PeepSitting from '../art/peep-sitting';

export default function SizeFullSample() {
  return (
    <Stack gap="xs" align="stretch">
      <Illustration title="A person sitting cross-legged, reading" size="full">
        <PeepSitting />
      </Illustration>
      <Text size="xs" color="subtle">
        Fills whatever it is given — the container, never the viewport. Open Peeps by{' '}
        <Link href="https://www.openpeeps.com" target="_blank" rel="noreferrer">
          Pablo Stanley
        </Link>{' '}
        (CC0)
      </Text>
    </Stack>
  );
}
