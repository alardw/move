import { Image, Stack, Text } from 'move';

// A portrait source dropped into a wide landscape box: with `fit="contain"`
// it letterboxes, leaving dead bands. `backdrop` fills those bands with a
// blurred, scaled-up copy of the same image — no per-image work needed.
const SRC = 'https://picsum.photos/id/1016/400/600';

export default function BackdropSample() {
  return (
    <Stack direction="row" gap="lg" wrap>
      <Stack gap="xs" align="center">
        <Text size="sm" weight="medium">contain</Text>
        <Image src={SRC} alt="Without backdrop" width={220} height={150} fit="contain" radius="md" />
      </Stack>
      <Stack gap="xs" align="center">
        <Text size="sm" weight="medium">contain + backdrop</Text>
        <Image src={SRC} alt="With blurred backdrop" width={220} height={150} fit="contain" backdrop radius="md" />
      </Stack>
    </Stack>
  );
}
