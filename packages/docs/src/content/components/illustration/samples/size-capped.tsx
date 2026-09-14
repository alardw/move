import { Illustration, Link, Stack, Text } from 'move';
import LocationReviewPana from '../art/location-review-pana';

export default function SizeCappedSample() {
  return (
    <Stack gap="xs" align="stretch">
      <Illustration title="A person leaving a review beside a map pin" size="sm">
        <LocationReviewPana />
      </Illustration>
      <Text size="xs" color="subtle">
        A named step caps the width and the drawing fills it — `sm` is 24rem. Applied as min(token,
        100%), so the container can still overrule it. “Location review” (pana) by{' '}
        <Link href="https://storyset.com" target="_blank" rel="noreferrer">
          Storyset
        </Link>
      </Text>
    </Stack>
  );
}
