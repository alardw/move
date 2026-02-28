import { Grid, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

const cell = (label: string, bg = 'var(--move-bg-elevated)') => (
  <div
    style={{
      padding: 'var(--move-spacing-md)',
      background: bg,
      borderRadius: 'var(--move-rounded-md)',
      border: '1px solid var(--move-border-base)',
      fontSize: 'var(--move-size-sm)',
      color: 'var(--move-fg-base)',
      textAlign: 'center',
    }}
  >
    {label}
  </div>
);

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Equal columns">
        <Grid cols={3} gap="md" style={{ width: '100%' }}>
          {cell('1')}
          {cell('2')}
          {cell('3')}
          {cell('4')}
          {cell('5')}
          {cell('6')}
        </Grid>
      </DemoSample>

      <DemoSample label="4 columns">
        <Grid cols={4} gap="md" style={{ width: '100%' }}>
          {cell('1')}
          {cell('2')}
          {cell('3')}
          {cell('4')}
        </Grid>
      </DemoSample>
    </Stack>
  );
}

function SpanExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="12-column grid with spans">
        <Grid gap="md" style={{ width: '100%' }}>
          <Grid.Cell span={8}>{cell('span 8')}</Grid.Cell>
          <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
          <Grid.Cell span={6}>{cell('span 6')}</Grid.Cell>
          <Grid.Cell span={6}>{cell('span 6')}</Grid.Cell>
          <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
          <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
          <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
        </Grid>
      </DemoSample>

      <DemoSample label="Offset">
        <Grid gap="md" style={{ width: '100%' }}>
          <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
          <Grid.Cell span={4} offset={4}>{cell('span 4, offset 4')}</Grid.Cell>
        </Grid>
      </DemoSample>
    </Stack>
  );
}

function AutoFillExample() {
  return (
    <DemoSample label="Auto-fill with minimum 150px per child">
      <Grid minChildWidth="150px" gap="md" style={{ width: '100%' }}>
        {cell('A')}
        {cell('B')}
        {cell('C')}
        {cell('D')}
        {cell('E')}
        {cell('F')}
      </Grid>
    </DemoSample>
  );
}

function RowsExample() {
  return (
    <DemoSample label="Fixed rows">
      <Grid cols={3} rows={2} gap="md" style={{ width: '100%', height: '200px' }}>
        {cell('1')}
        {cell('2')}
        {cell('3')}
        {cell('4')}
        {cell('5')}
        {cell('6')}
      </Grid>
    </DemoSample>
  );
}

function CollapseBelowExample() {
  return (
    <DemoSample label="Resize the container below 500px to see collapse">
      <div style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed var(--move-border-base)', padding: 'var(--move-spacing-md)', borderRadius: 'var(--move-rounded-md)', width: '100%', minWidth: '200px' }}>
        <Grid cols={3} gap="md">
          {cell('1', 'var(--move-bg-elevated)')}
          {cell('2', 'var(--move-bg-elevated)')}
          {cell('3', 'var(--move-bg-elevated)')}
        </Grid>
      </div>
    </DemoSample>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'CSS grid layout with equal columns or span-based placement.',
    component: <UsageExample />,
    code: `import { Grid } from 'move';

{/* Equal columns */}
<Grid cols={3} gap="md">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>

{/* 4 columns */}
<Grid cols={4} gap="md">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</Grid>`,
  },
  {
    id: 'spans',
    name: 'Spans & Offset',
    description: 'Use Grid.Cell for column spans and offsets within a 12-column grid.',
    component: <SpanExample />,
    code: `import { Grid } from 'move';

{/* 12-column grid (default) */}
<Grid gap="md">
  <Grid.Cell span={8}>span 8</Grid.Cell>
  <Grid.Cell span={4}>span 4</Grid.Cell>
  <Grid.Cell span={6}>span 6</Grid.Cell>
  <Grid.Cell span={6}>span 6</Grid.Cell>
</Grid>

{/* Offset */}
<Grid gap="md">
  <Grid.Cell span={4}>span 4</Grid.Cell>
  <Grid.Cell span={4} offset={4}>span 4, offset 4</Grid.Cell>
</Grid>`,
  },
  {
    id: 'auto-fill',
    name: 'Auto Fill',
    description: 'Automatically fill columns with a minimum child width.',
    component: <AutoFillExample />,
    code: `<Grid minChildWidth="150px" gap="md">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</Grid>`,
  },
  {
    id: 'rows',
    name: 'Rows',
    description: 'Define equal-height rows.',
    component: <RowsExample />,
    code: `<Grid cols={3} rows={2} gap="md" style={{ height: '200px' }}>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</Grid>`,
  },
  {
    id: 'collapse',
    name: 'Responsive Collapse',
    description: 'Collapse to a single column when the container is narrower than a threshold.',
    component: <CollapseBelowExample />,
    code: `{/* Collapses to 1 column when container < 500px */}
<Grid cols={3} gap="md" collapseBelow="500">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>`,
  },
];

export function GridDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Grid"
        description="CSS grid layout with equal columns, span-based placement, auto-fill, and responsive collapse."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Grid"
        properties={[
          { name: 'cols', type: 'number', description: 'Number of equal-width columns.' },
          { name: 'rows', type: 'number', description: 'Number of equal-height rows.' },
          { name: 'columns', type: 'number', default: '12', description: 'Total column count for span-based mode.' },
          { name: 'minChildWidth', type: 'string', description: 'Minimum child width for auto-fill mode (e.g. "150px").' },
          { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", default: "'md'", description: 'Spacing between cells.' },
          { name: 'rowGap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", description: 'Vertical gap override.' },
          { name: 'columnGap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", description: 'Horizontal gap override.' },
          { name: 'collapseBelow', type: 'string', description: 'Container width (in pixels) below which grid collapses to 1 column.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for the root element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Grid.Cell"
        properties={[
          { name: 'span', type: 'number', description: 'Number of columns this cell spans.' },
          { name: 'rowSpan', type: 'number', description: 'Number of rows this cell spans.' },
          { name: 'offset', type: 'number', description: 'Number of columns to skip before this cell.' },
          { name: 'order', type: 'number', description: 'Visual ordering of the cell.' },
          { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", description: 'Self-alignment within the cell.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for the cell element.' },
        ]}
      />
    </DocPage.Root>
  );
}
