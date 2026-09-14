import { Illustration, Link, Stack, Text } from 'move';
import LocationReviewBro from '../art/location-review-bro';
import LocationReviewPana from '../art/location-review-pana';
import LocationReviewRafiki from '../art/location-review-rafiki';

/** The Freepik License asks for attribution wherever the artwork appears. */
function Credit({ variant }: { variant: string }) {
  return (
    <Text size="xs" color="subtle">
      “Location review” ({variant}) by{' '}
      <Link href="https://storyset.com" target="_blank" rel="noreferrer">
        Storyset
      </Link>
    </Text>
  );
}

export default function WidthsSample() {
  return (
    <Stack gap="xl" align="stretch">
      <Stack gap="xs" align="stretch">
        <Text size="xs" color="subtle">
          size=&quot;auto&quot; — the size it was drawn at, scaled down only when the parent is
          narrower
        </Text>
        <Illustration title="A person reviewing a location on a map">
          <LocationReviewBro />
        </Illustration>
        <Credit variant="bro" />
      </Stack>

      <Stack gap="xs" align="stretch">
        <Text size="xs" color="subtle">
          size=&quot;sm&quot; — capped at 24rem, and the drawing fills the cap
        </Text>
        <Illustration title="A person leaving a review beside a map pin" size="sm">
          <LocationReviewPana />
        </Illustration>
        <Credit variant="pana" />
      </Stack>

      <Stack gap="xs" align="stretch">
        <Text size="xs" color="subtle">
          size=&quot;full&quot; — fills whatever it is given
        </Text>
        <Illustration title="A person marking a place on a large map" size="full">
          <LocationReviewRafiki />
        </Illustration>
        <Credit variant="rafiki" />
      </Stack>
    </Stack>
  );
}
