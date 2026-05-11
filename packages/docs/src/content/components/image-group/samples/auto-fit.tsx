import { Image, ImageGroup } from 'move';

const photos = [237, 433, 1024, 1041, 1059, 1067];

/**
 * `minColWidth` lets the grid auto-fit columns based on available
 * width — no media queries required.
 */
export default function AutoFitSample() {
  return (
    <ImageGroup minColWidth="10rem" gap="sm">
      {photos.map((id) => (
        <Image key={id} src={`https://picsum.photos/id/${id}/300/300`} alt="" aspectRatio="1" radius="md" />
      ))}
    </ImageGroup>
  );
}
