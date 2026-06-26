import { Image } from 'move';

export default function BasicSample() {
  return (
    <Image
      src="https://picsum.photos/id/1015/600/400"
      alt="River and mountains"
      width={320}
      aspectRatio="3/2"
      radius="md"
    />
  );
}
