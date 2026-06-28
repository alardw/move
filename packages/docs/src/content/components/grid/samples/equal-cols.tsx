import { Grid } from 'move';
import { Tile } from './_tile';

export default function EqualColsSample() {
  return (
    <Grid cols={4} gap="md" stagger>
      {Array.from({ length: 8 }).map((_, i) => <Tile key={i} index={i} />)}
    </Grid>
  );
}
