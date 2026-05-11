import { AudioPlayer, Stack, Text } from 'move';

const SAMPLE_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3';

/**
 * Toggle individual control regions off when the surrounding context
 * makes them redundant — a chat bubble doesn’t need volume controls,
 * an inline preview doesn’t need a settings menu, a one-shot sample
 * doesn’t need a time readout.
 */
export default function MinimalSample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Play + scrubber only</Text>
        <AudioPlayer
          src={SAMPLE_SRC}
          radius="full"
          showVolume={false}
          showSettings={false}
          showTime={false}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Without settings menu</Text>
        <AudioPlayer src={SAMPLE_SRC} radius="md" showSettings={false} />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Without time readout</Text>
        <AudioPlayer src={SAMPLE_SRC} radius="md" showTime={false} />
      </Stack>
    </Stack>
  );
}
