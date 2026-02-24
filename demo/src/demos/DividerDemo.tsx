import { Divider, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <div>
          <p>Section one content goes here.</p>
          <Divider />
          <p>Section two content goes here.</p>
        </div>
      </DemoSample>

      <DemoSample label="With content">
        <div>
          <p>Left content</p>
          <Divider>OR</Divider>
          <p>Right content</p>
        </div>
      </DemoSample>

      <DemoSample label="Border types">
        <div>
          <Divider />
          <Divider type="dashed" />
          <Divider type="dotted" />
        </div>
      </DemoSample>

      <DemoSample label="Content alignment">
        <div>
          <Divider align="left">Left</Divider>
          <Divider align="center">Center</Divider>
          <Divider align="right">Right</Divider>
        </div>
      </DemoSample>

      <DemoSample label="Vertical">
        <div style={{ display: 'flex', alignItems: 'center', height: '4rem' }}>
          <span>One</span>
          <Divider orientation="vertical" />
          <span>Two</span>
          <Divider orientation="vertical" />
          <span>Three</span>
        </div>
      </DemoSample>

      <DemoSample label="Vertical with content">
        <div style={{ display: 'flex', alignItems: 'center', height: '8rem' }}>
          <span>Left</span>
          <Divider orientation="vertical">#</Divider>
          <span>Right</span>
        </div>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A visual separator between content sections.',
    component: <UsageExample />,
    code: `import { Divider } from 'move';

{/* Basic */}
<Divider />

{/* With content */}
<Divider>OR</Divider>

{/* Border types */}
<Divider type="dashed" />
<Divider type="dotted" />

{/* Content alignment */}
<Divider align="left">Left</Divider>
<Divider align="center">Center</Divider>
<Divider align="right">Right</Divider>

{/* Vertical */}
<div style={{ display: 'flex', alignItems: 'center', height: '4rem' }}>
  <span>One</span>
  <Divider orientation="vertical" />
  <span>Two</span>
</div>

{/* Vertical with content */}
<div style={{ display: 'flex', alignItems: 'center', height: '8rem' }}>
  <span>Left</span>
  <Divider orientation="vertical">#</Divider>
  <span>Right</span>
</div>`,
  },
];

export function DividerDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Divider"
        description="A visual separator between content sections."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Divider"
        properties={[
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the divider line.' },
          { name: 'type', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'Border style of the divider.' },
          { name: 'align', type: "'left' | 'center' | 'right' | 'top' | 'bottom'", default: "'center'", description: 'Alignment of the label content within the divider.' },
        ]}
      />
    </DocPage.Root>
  );
}
