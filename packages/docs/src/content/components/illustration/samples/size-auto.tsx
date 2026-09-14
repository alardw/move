import { Illustration, Link, Stack, Text } from 'move';
import PeepStanding from '../art/peep-standing';

export default function SizeAutoSample() {
  return (
    <Stack gap="xs" align="stretch">
      <Illustration title="A person standing, hands in pockets">
        <PeepStanding />
      </Illustration>
      <Text size="xs" color="subtle">
        The default. The drawing renders at the size it was drawn — 255px wide here — and scales
        down only when the parent is narrower. Open Peeps by{' '}
        <Link href="https://www.openpeeps.com" target="_blank" rel="noreferrer">
          Pablo Stanley
        </Link>{' '}
        (CC0)
      </Text>
    </Stack>
  );
}
