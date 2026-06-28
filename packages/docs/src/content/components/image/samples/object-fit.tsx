import { Image, Stack, Text } from 'move';

const fits = ['cover', 'contain', 'fill', 'none'] as const;

export default function ObjectFitSample() {
  return (
    <Stack direction="row" gap="md" wrap>
      {fits.map((fit) => (
        <Stack key={fit} gap="xs" align="center">
          <Text size="sm" weight="medium">{fit}</Text>
          <Image
            // Tall portrait source into a wide landscape box so the four
            // fits are clearly distinct: cover crops vertically, contain
            // letterboxes with bars on the sides, fill squishes, none
            // renders the source at its native size and gets clipped.
            src="https://picsum.photos/id/1015/300/600"
            alt={`${fit} fit`}
            width={200}
            height={140}
            fit={fit}
            radius="md"
            // recipe-purity-ignore: muted backdrop behind contain/none letterboxing; no Move background prop on Image
            style={{ background: 'var(--move-bg-muted)' }}
          />
        </Stack>
      ))}
    </Stack>
  );
}
