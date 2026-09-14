import { Illustration, Link, Stack, Text } from 'move';
import LocationReviewBro from '../art/location-review-bro';

export default function SizeAutoSample() {
  return (
    <Stack gap="xs" align="stretch">
      <Illustration title="A person reviewing a location on a map">
        <LocationReviewBro />
      </Illustration>
      <Text size="xs" color="subtle">
        The default. The drawing renders at the size it was drawn, and scales down only when the
        parent is narrower. “Location review” (bro) by{' '}
        <Link href="https://storyset.com" target="_blank" rel="noreferrer">
          Storyset
        </Link>
      </Text>
    </Stack>
  );
}
