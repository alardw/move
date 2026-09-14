import { Illustration, Link, Stack, Text } from 'move';
import LocationReviewRafiki from '../art/location-review-rafiki';

export default function SizeFullSample() {
  return (
    <Stack gap="xs" align="stretch">
      <Illustration title="A person marking a place on a large map" size="full">
        <LocationReviewRafiki />
      </Illustration>
      <Text size="xs" color="subtle">
        Fills whatever it is given — the container, never the viewport. “Location review” (rafiki)
        by{' '}
        <Link href="https://storyset.com" target="_blank" rel="noreferrer">
          Storyset
        </Link>
      </Text>
    </Stack>
  );
}
