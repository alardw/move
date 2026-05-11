import { Image, Stack } from 'move';

export default function FallbackSample() {
  return (
    <Stack direction="row" gap="md" wrap>
      <Image src="https://does-not-exist.example/missing.jpg" alt="Missing" width={200} aspectRatio="1" radius="md" />
      <Image
        src="https://does-not-exist.example/also-missing.jpg"
        fallbackSrc="https://picsum.photos/id/237/200/200"
        alt="Falls back to a real image"
        width={200}
        aspectRatio="1"
        radius="md"
      />
    </Stack>
  );
}
