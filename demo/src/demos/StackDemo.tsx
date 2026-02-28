import { Stack as MoveStack, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { DemoSample, Stack } from '../components';

const box = (label: string, bg = 'var(--move-bg-elevated)') => (
  <div
    style={{
      padding: 'var(--move-spacing-md) var(--move-spacing-lg)',
      background: bg,
      borderRadius: 'var(--move-rounded-md)',
      border: '1px solid var(--move-border-base)',
      fontSize: 'var(--move-size-sm)',
      color: 'var(--move-fg-base)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Column (default)">
        <MoveStack gap="md">
          {box('Item 1')}
          {box('Item 2')}
          {box('Item 3')}
        </MoveStack>
      </DemoSample>

      <DemoSample label="Row">
        <MoveStack direction="row" gap="md">
          {box('Item 1')}
          {box('Item 2')}
          {box('Item 3')}
        </MoveStack>
      </DemoSample>
    </Stack>
  );
}

function GapExample() {
  return (
    <Stack direction="column" gap="xl">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <DemoSample key={gap} label={`gap="${gap}"`}>
          <MoveStack direction="row" gap={gap}>
            {box('A')}
            {box('B')}
            {box('C')}
          </MoveStack>
        </DemoSample>
      ))}
    </Stack>
  );
}

function AlignJustifyExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="align center">
        <MoveStack direction="row" gap="md" align="center" style={{ height: '100px', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
          <div style={{ padding: 'var(--move-spacing-xs) var(--move-spacing-md)', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)', height: '30px' }}>Short</div>
          <div style={{ padding: 'var(--move-spacing-xs) var(--move-spacing-md)', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)', height: '60px' }}>Tall</div>
          <div style={{ padding: 'var(--move-spacing-xs) var(--move-spacing-md)', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)', height: '40px' }}>Medium</div>
        </MoveStack>
      </DemoSample>

      <DemoSample label="justify between">
        <MoveStack direction="row" gap="md" justify="between" style={{ width: '100%' }}>
          {box('Left')}
          {box('Right')}
        </MoveStack>
      </DemoSample>

      <DemoSample label="justify center">
        <MoveStack direction="row" gap="md" justify="center" style={{ width: '100%' }}>
          {box('A')}
          {box('B')}
          {box('C')}
        </MoveStack>
      </DemoSample>
    </Stack>
  );
}

function WrapExample() {
  return (
    <DemoSample label="Wrap">
      <MoveStack direction="row" gap="sm" wrap style={{ maxWidth: '300px' }}>
        {box('Tag 1')}
        {box('Tag 2')}
        {box('Tag 3')}
        {box('Tag 4')}
        {box('Tag 5')}
        {box('Tag 6')}
      </MoveStack>
    </DemoSample>
  );
}

function CollapseBelowExample() {
  return (
    <DemoSample label="Resize the container below 500px to see collapse">
      <div style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed var(--move-border-base)', padding: 'var(--move-spacing-md)', borderRadius: 'var(--move-rounded-md)', width: '100%', minWidth: '200px' }}>
        <MoveStack direction="row" gap="md" collapseBelow="500">
          {box('Sidebar', 'var(--move-bg-elevated)')}
          {box('Main Content', 'var(--move-bg-elevated)')}
          {box('Aside', 'var(--move-bg-elevated)')}
        </MoveStack>
      </div>
    </DemoSample>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Flex container for vertical or horizontal layouts.',
    component: <UsageExample />,
    code: `import { Stack } from 'move';

{/* Column (default) */}
<Stack gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

{/* Row */}
<Stack direction="row" gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>`,
  },
  {
    id: 'gap',
    name: 'Gap',
    description: 'Control spacing between children.',
    component: <GapExample />,
    code: `<Stack direction="row" gap="none">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</Stack>

<Stack direction="row" gap="sm">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</Stack>

<Stack direction="row" gap="md">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</Stack>

<Stack direction="row" gap="xl">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</Stack>`,
  },
  {
    id: 'align-justify',
    name: 'Align & Justify',
    description: 'Control alignment and distribution of children.',
    component: <AlignJustifyExample />,
    code: `{/* Vertically center items of different heights */}
<Stack direction="row" gap="md" align="center">
  <div style={{ height: 30 }}>Short</div>
  <div style={{ height: 60 }}>Tall</div>
</Stack>

{/* Push items to edges */}
<Stack direction="row" justify="between">
  <div>Left</div>
  <div>Right</div>
</Stack>

{/* Center items */}
<Stack direction="row" gap="md" justify="center">
  <div>A</div>
  <div>B</div>
</Stack>`,
  },
  {
    id: 'wrap',
    name: 'Wrap',
    description: 'Allow children to wrap onto the next line.',
    component: <WrapExample />,
    code: `<Stack direction="row" gap="sm" wrap>
  <div>Tag 1</div>
  <div>Tag 2</div>
  <div>Tag 3</div>
  <div>Tag 4</div>
</Stack>`,
  },
  {
    id: 'collapse',
    name: 'Responsive Collapse',
    description: 'Collapse a row layout to column when the container is narrower than a threshold.',
    component: <CollapseBelowExample />,
    code: `{/* Collapses to column when container < 500px */}
<Stack direction="row" gap="md" collapseBelow="500">
  <div>Sidebar</div>
  <div>Main Content</div>
  <div>Aside</div>
</Stack>`,
  },
];

export function StackDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Stack"
        description="Flex container for vertical or horizontal layouts with gap, alignment, and responsive collapse."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Stack"
        properties={[
          { name: 'direction', type: "'row' | 'column'", default: "'column'", description: 'Layout direction.' },
          { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", default: "'md'", description: 'Spacing between children.' },
          { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'Cross-axis alignment.' },
          { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'evenly'", default: "'start'", description: 'Main-axis distribution.' },
          { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow children to wrap to new lines.' },
          { name: 'collapseBelow', type: 'string', description: 'Container width (in pixels) below which a row collapses to a column.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for the root element.' },
        ]}
      />
    </DocPage.Root>
  );
}
