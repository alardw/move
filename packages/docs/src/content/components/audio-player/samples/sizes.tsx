import { AudioPlayer, Stack, Text } from 'move';

const SAMPLE_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

const sizes = ['sm', 'md', 'lg'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  sm: 'Compact bar — good inline alongside chat messages or list rows.',
  md: 'The default. Page-level players, podcast pages, sample previews.',
  lg: 'Roomy controls and a taller scrubber — feature pages, hero embeds.',
};

export default function SizesSample() {
  return (
    <Stack gap="lg">
      {sizes.map((size) => (
        <Stack key={size} gap="xs">
          <Text size="sm" weight="medium">size="{size}"</Text>
          <Text size="sm" color="muted">{descriptions[size]}</Text>
          <AudioPlayer src={SAMPLE_SRC} size={size} radius="md" />
        </Stack>
      ))}
    </Stack>
  );
}
