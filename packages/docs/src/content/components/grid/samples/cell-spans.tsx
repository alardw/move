import { Grid } from 'move';
import { Tile } from './_tile';

export default function CellSpansSample() {
  return (
    <Grid cols={4} gap="md">
      <Grid.Cell colSpan={2}><Tile index={0}>colSpan=2</Tile></Grid.Cell>
      <Grid.Cell><Tile index={1}>1</Tile></Grid.Cell>
      <Grid.Cell><Tile index={2}>1</Tile></Grid.Cell>
      <Grid.Cell><Tile index={3}>1</Tile></Grid.Cell>
      <Grid.Cell colSpan={3}><Tile index={4}>colSpan=3</Tile></Grid.Cell>
      <Grid.Cell><Tile index={5}>1</Tile></Grid.Cell>
      <Grid.Cell colSpan={4}><Tile index={6}>colSpan=4 (full width)</Tile></Grid.Cell>
    </Grid>
  );
}
