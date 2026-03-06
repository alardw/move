// Generated from Grid.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Grid } from 'move';
import type { DemoDefinition } from '../types';

const cellStyle = {
  background: 'var(--move-bg-subtle)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-sm)',
  padding: 'var(--move-spacing-sm)',
  textAlign: 'center' as const,
  fontSize: 'var(--move-size-sm)',
};

export const demo: DemoDefinition = {
  id: 'core:Grid',
  name: 'Grid',
  category: 'core',
  description: 'CSS grid layout container with equal-column, span-based, and auto-fit modes plus a Cell sub-component for placement control',
  controls: [
    {
      name: 'cols',
      kind: 'number',
      defaultValue: 3,
    },
    {
      name: 'gap',
      kind: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    {
      name: 'rows',
      kind: 'number',
    },
    {
      name: 'minChildWidth',
      kind: 'text',
    },
  ],
  initialProps: {
    cols: 3,
    gap: 'md',
  },
  render: (props) => (
    <Grid
      cols={props.cols as number | undefined}
      rows={props.rows as number | undefined}
      gap={props.gap as string | undefined}
      minChildWidth={props.minChildWidth as string | undefined}
    >
      <Grid.Cell style={cellStyle}>Cell 1</Grid.Cell>
      <Grid.Cell style={cellStyle}>Cell 2</Grid.Cell>
      <Grid.Cell style={cellStyle}>Cell 3</Grid.Cell>
      <Grid.Cell span={2} style={cellStyle}>Cell 4 (span 2)</Grid.Cell>
      <Grid.Cell style={cellStyle}>Cell 5</Grid.Cell>
      <Grid.Cell style={cellStyle}>Cell 6</Grid.Cell>
      <Grid.Cell style={cellStyle}>Cell 7</Grid.Cell>
      <Grid.Cell style={cellStyle}>Cell 8</Grid.Cell>
      <Grid.Cell span={3} style={cellStyle}>Cell 9 (span 3)</Grid.Cell>
    </Grid>
  ),
};
