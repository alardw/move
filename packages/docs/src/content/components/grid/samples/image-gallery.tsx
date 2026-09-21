import { Grid, Image } from 'move';

// A gallery is just a staggered grid of images — `<Grid stagger>` reveals the
// cells in sequence on load. Each image fills its 4:3 cell with fit="cover".
//
// Enough cells to show what the stagger actually does at length: the gap starts
// at the full delay and closes as it goes, so the reveal reads as one sweep
// instead of a queue that grows with the list. A handful of cells never gets far
// enough into that to show it.
const photos = Array.from({ length: 24 }, (_, i) => `move-gallery-${i}`);

export default function ImageGallerySample() {
  return (
    <Grid cols={6} gap="md" stagger>
      {photos.map((seed) => (
        <Image
          key={seed}
          src={`https://picsum.photos/seed/${seed}/400/300`}
          alt=""
          aspectRatio="4 / 3"
          fit="cover"
          radius="md"
        />
      ))}
    </Grid>
  );
}
