import { AudioPlayer, Stack, Text } from 'move';

const SAMPLE_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

const radii = ['none', 'sm', 'md', 'lg', 'full'] as const;
const descriptions: Record<typeof radii[number], string> = {
  none: 'Sharp corners — the player reads as part of a frame.',
  sm: 'A whisper of rounding, for cards that already have soft corners.',
  md: 'The default page-level look.',
  lg: 'Pillowy, friendly. Pairs well with marketing pages.',
  full: 'Pill-shaped — instantly reads as a player, especially on a clean background.',
};

export default function RadiusSample() {
  return (
    <Stack gap="lg">
      {radii.map((r) => (
        <Stack key={r} gap="xs">
          <Text size="sm" weight="medium">radius="{r}"</Text>
          <Text size="sm" color="muted">{descriptions[r]}</Text>
          <AudioPlayer src={SAMPLE_SRC} radius={r} />
        </Stack>
      ))}
    </Stack>
  );
}
