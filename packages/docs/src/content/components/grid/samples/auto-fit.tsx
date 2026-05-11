import { Grid } from 'move';
import { Tile } from './_tile';

/**
 * `minColWidth` lets the grid auto-fit columns based on available
 * width — wider viewport, more columns, no media queries needed.
 * Resize the preview to see the layout reflow.
 */
export default function AutoFitSample() {
  return (
    <Grid minColWidth="14rem" gap="md">
      {Array.from({ length: 6 }).map((_, i) => <Tile key={i} index={i} />)}
    </Grid>
  );
}
