import { Illustration } from 'move';
import Tiger from '../art/tiger';

export default function OwnColoursSample() {
  return (
    <Illustration
      title="A stylised tiger"
      desc="A tiger's head in three-quarter view, rendered in oranges and deep blues with heavy shading."
      caption="Artwork with its own palette keeps it — 345 fills and two gradients have no accent to swap. It still takes the frame: a name, a caption, and a size."
      size="sm"
    >
      <Tiger />
    </Illustration>
  );
}
