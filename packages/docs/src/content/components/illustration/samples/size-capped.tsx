import { Illustration, Link, Stack, Text } from 'move';
import SitStandWalk from '../art/sit-stand-walk';

export default function SizeCappedSample() {
  return (
    <Stack gap="xs" align="stretch">
      <Illustration title="Three people: one seated, one standing, one walking" size="sm">
        <SitStandWalk />
      </Illustration>
      <Text size="xs" color="subtle">
        A named step caps the width and the drawing fills it — `sm` is 24rem. Applied as min(token,
        100%), so the container can still overrule it. Open Peeps by{' '}
        <Link href="https://www.openpeeps.com" target="_blank" rel="noreferrer">
          Pablo Stanley
        </Link>{' '}
        (CC0)
      </Text>
    </Stack>
  );
}
