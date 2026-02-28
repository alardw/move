import { Align, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

const tag = (label: string, bg = 'var(--move-bg-elevated)') => (
  <div
    style={{
      padding: 'var(--move-spacing-xs) var(--move-spacing-md)',
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
      <DemoSample label="All three sections">
        <Align gap="md" style={{ width: '100%', padding: 'var(--move-spacing-md)', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
          <Align.Start>{tag('Logo')}</Align.Start>
          <Align.Center>{tag('Title')}</Align.Center>
          <Align.End>{tag('Action')}</Align.End>
        </Align>
      </DemoSample>

      <DemoSample label="Start and End only">
        <Align gap="md" style={{ width: '100%', padding: 'var(--move-spacing-md)', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
          <Align.Start>{tag('Back')}</Align.Start>
          <Align.End>
            {tag('Save')}
            {tag('Cancel')}
          </Align.End>
        </Align>
      </DemoSample>

      <DemoSample label="Center only">
        <Align gap="md" style={{ width: '100%', padding: 'var(--move-spacing-md)', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
          <Align.Center>{tag('Centered Content')}</Align.Center>
        </Align>
      </DemoSample>
    </Stack>
  );
}

function TrueCenterExample() {
  return (
    <DemoSample label="Center stays centered regardless of start/end width">
      <Stack direction="column" gap="md">
        <Align gap="sm" style={{ width: '100%', padding: 'var(--move-spacing-sm)', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
          <Align.Start>{tag('Short')}</Align.Start>
          <Align.Center>{tag('Center')}</Align.Center>
          <Align.End>{tag('Very Long Label Here')}</Align.End>
        </Align>
        <Align gap="sm" style={{ width: '100%', padding: 'var(--move-spacing-sm)', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
          <Align.Start>{tag('Very Long Label Here')}</Align.Start>
          <Align.Center>{tag('Center')}</Align.Center>
          <Align.End>{tag('Short')}</Align.End>
        </Align>
      </Stack>
    </DemoSample>
  );
}

function VerticalAlignExample() {
  return (
    <Stack direction="column" gap="xl">
      {(['start', 'center', 'end', 'baseline'] as const).map((align) => (
        <DemoSample key={align} label={`align="${align}"`}>
          <Align align={align} gap="md" style={{ width: '100%', padding: 'var(--move-spacing-md)', background: 'var(--move-bg-base)', borderRadius: 'var(--move-rounded-md)' }}>
            <Align.Start>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center', padding: '0 var(--move-spacing-md)', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)' }}>Small</div>
            </Align.Start>
            <Align.Center>
              <div style={{ height: '60px', display: 'flex', alignItems: 'center', padding: '0 var(--move-spacing-md)', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)' }}>Tall</div>
            </Align.Center>
            <Align.End>
              <div style={{ height: '40px', display: 'flex', alignItems: 'center', padding: '0 var(--move-spacing-md)', background: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-sm)' }}>Medium</div>
            </Align.End>
          </Align>
        </DemoSample>
      ))}
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Distribute content into left, center, and right sections.',
    component: <UsageExample />,
    code: `import { Align } from 'move';

{/* Three sections */}
<Align gap="md">
  <Align.Start>Logo</Align.Start>
  <Align.Center>Title</Align.Center>
  <Align.End>Action</Align.End>
</Align>

{/* Start and End only */}
<Align gap="md">
  <Align.Start>Back</Align.Start>
  <Align.End>
    <span>Save</span>
    <span>Cancel</span>
  </Align.End>
</Align>

{/* Center only */}
<Align>
  <Align.Center>Centered Content</Align.Center>
</Align>`,
  },
  {
    id: 'true-center',
    name: 'True Centering',
    description: 'The center section stays perfectly centered regardless of how wide the start or end sections are.',
    component: <TrueCenterExample />,
    code: `{/* Center stays centered even with unequal sides */}
<Align gap="sm">
  <Align.Start>Short</Align.Start>
  <Align.Center>Center</Align.Center>
  <Align.End>Very Long Label Here</Align.End>
</Align>`,
  },
  {
    id: 'vertical',
    name: 'Vertical Alignment',
    description: 'Control cross-axis alignment of sections.',
    component: <VerticalAlignExample />,
    code: `<Align align="start">
  <Align.Start>Small</Align.Start>
  <Align.Center>Tall</Align.Center>
  <Align.End>Medium</Align.End>
</Align>

<Align align="center">
  <Align.Start>Small</Align.Start>
  <Align.Center>Tall</Align.Center>
  <Align.End>Medium</Align.End>
</Align>

<Align align="end">
  <Align.Start>Small</Align.Start>
  <Align.Center>Tall</Align.Center>
  <Align.End>Medium</Align.End>
</Align>`,
  },
];

export function AlignDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Align"
        description="Horizontal bar with left, center, and right sections. Uses CSS grid for true centering."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Align"
        properties={[
          { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", default: "'md'", description: 'Spacing within each section.' },
          { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'center'", description: 'Vertical alignment of sections.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for the root element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Align.Start / Align.Center / Align.End"
        properties={[
          { name: 'children', type: 'ReactNode', description: 'Content for this section.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for the section element.' },
        ]}
      />
    </DocPage.Root>
  );
}
