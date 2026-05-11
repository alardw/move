import { Image, ImageGroup } from 'move';

// Stable, cached image set with explicit small dimensions so the
// gallery doesn't reflow as the photos arrive.
const photos = [1015, 1018, 1025, 1043, 1059, 1062];

export default function BasicSample() {
  return (
    <ImageGroup cols={3} gap="md">
      {photos.map((id) => (
        <Image
          key={id}
          src={`https://picsum.photos/id/${id}/280/210`}
          alt=""
          aspectRatio="4/3"
          radius="md"
          loading="lazy"
        />
      ))}
    </ImageGroup>
  );
}
