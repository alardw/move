import { Grid } from 'move';
import { Tile } from './_tile';

export default function CellSpansSample() {
  return (
    <Grid cols={4} gap="md">
      <Grid.Cell span={2}><Tile index={0}>span=2</Tile></Grid.Cell>
      <Grid.Cell><Tile index={1}>1</Tile></Grid.Cell>
      <Grid.Cell><Tile index={2}>1</Tile></Grid.Cell>
      <Grid.Cell><Tile index={3}>1</Tile></Grid.Cell>
      <Grid.Cell span={3}><Tile index={4}>span=3</Tile></Grid.Cell>
      <Grid.Cell><Tile index={5}>1</Tile></Grid.Cell>
      <Grid.Cell span={4}><Tile index={6}>span=4 (full width)</Tile></Grid.Cell>
    </Grid>
  );
}
