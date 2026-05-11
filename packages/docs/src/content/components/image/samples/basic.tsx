import { Image, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack direction="row" gap="md" wrap>
      <Image src="https://picsum.photos/id/1015/600/400" alt="River and mountains" width={240} aspectRatio="3/2" radius="md" />
      <Image src="https://picsum.photos/id/1025/400/400" alt="Pug puppy" width={240} aspectRatio="1" radius="lg" />
      <Image src="https://picsum.photos/id/1043/600/400" alt="Sunny cliffs" width={240} aspectRatio="3/2" radius="md" />
    </Stack>
  );
}
