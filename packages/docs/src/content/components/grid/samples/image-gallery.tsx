import { Grid, Image } from 'move';

// A gallery is just a staggered grid of images — `<Grid stagger>` reveals the
// cells in sequence on load. Each image fills its 4:3 cell with fit="cover".
const photos = [
  { id: 1015, w: 400, h: 240 },
  { id: 1018, w: 220, h: 320 },
  { id: 1016, w: 400, h: 200 },
  { id: 1043, w: 300, h: 300 },
  { id: 10, w: 200, h: 300 },
  { id: 29, w: 400, h: 260 },
];

export default function ImageGallerySample() {
  return (
    <Grid cols={3} gap="md" stagger>
      {photos.map((p) => (
        <Image
          key={p.id}
          src={`https://picsum.photos/id/${p.id}/${p.w}/${p.h}`}
          alt=""
          aspectRatio="4 / 3"
          fit="cover"
          radius="md"
        />
      ))}
    </Grid>
  );
}
