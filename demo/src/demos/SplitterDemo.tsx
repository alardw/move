import { Splitter, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

function UsageExample() {
  return (
    <div style={{ height: 200, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root>
        <Splitter.Panel>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)' }}>
            Panel 1
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)' }}>
            Panel 2
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

function VerticalExample() {
  return (
    <div style={{ height: 300, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root layout="vertical">
        <Splitter.Panel>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)' }}>
            Top Panel
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)' }}>
            Bottom Panel
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

function SizesExample() {
  return (
    <div style={{ height: 200, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root>
        <Splitter.Panel size={25} minSize={10}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)' }}>
            25% (min 10%)
          </div>
        </Splitter.Panel>
        <Splitter.Panel size={75}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)' }}>
            75%
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

function ThreePanelsExample() {
  return (
    <div style={{ height: 200, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root>
        <Splitter.Panel size={25}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)' }}>
            Left
          </div>
        </Splitter.Panel>
        <Splitter.Panel size={50}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)' }}>
            Center
          </div>
        </Splitter.Panel>
        <Splitter.Panel size={25}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)' }}>
            Right
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

function NestedExample() {
  return (
    <div style={{ height: 300, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root>
        <Splitter.Panel size={30}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)', height: '100%', boxSizing: 'border-box' }}>
            Sidebar
          </div>
        </Splitter.Panel>
        <Splitter.Panel size={70}>
          <Splitter.Root layout="vertical">
            <Splitter.Panel size={60}>
              <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)' }}>
                Main Content
              </div>
            </Splitter.Panel>
            <Splitter.Panel size={40}>
              <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-emphasis)' }}>
                Footer Panel
              </div>
            </Splitter.Panel>
          </Splitter.Root>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

function ResponsiveExample() {
  return (
    <div style={{ height: 200, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root collapseBelow={500}>
        <Splitter.Panel size={30}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)' }}>
            Sidebar
          </div>
        </Splitter.Panel>
        <Splitter.Panel size={70}>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)' }}>
            Main Content
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    fullWidth: true,
    component: <UsageExample />,
    code: `import { Splitter } from 'move';

<Splitter.Root>
  <Splitter.Panel>Panel 1</Splitter.Panel>
  <Splitter.Panel>Panel 2</Splitter.Panel>
</Splitter.Root>`,
  },
  {
    id: 'vertical',
    name: 'Vertical Layout',
    description: 'Stack panels top to bottom',
    fullWidth: true,
    component: <VerticalExample />,
    code: `<Splitter.Root layout="vertical">
  <Splitter.Panel>Top Panel</Splitter.Panel>
  <Splitter.Panel>Bottom Panel</Splitter.Panel>
</Splitter.Root>`,
  },
  {
    id: 'sizes',
    name: 'Initial Sizes',
    description: 'Set starting dimensions and minimums',
    fullWidth: true,
    component: <SizesExample />,
    code: `<Splitter.Root>
  <Splitter.Panel size={25} minSize={10}>25% (min 10%)</Splitter.Panel>
  <Splitter.Panel size={75}>75%</Splitter.Panel>
</Splitter.Root>`,
  },
  {
    id: 'three-panels',
    name: 'Three Panels',
    description: 'Add more panels for complex layouts',
    fullWidth: true,
    component: <ThreePanelsExample />,
    code: `<Splitter.Root>
  <Splitter.Panel size={25}>Left</Splitter.Panel>
  <Splitter.Panel size={50}>Center</Splitter.Panel>
  <Splitter.Panel size={25}>Right</Splitter.Panel>
</Splitter.Root>`,
  },
  {
    id: 'nested',
    name: 'Nested Splitters',
    description: 'Create IDE-style layouts by nesting',
    fullWidth: true,
    component: <NestedExample />,
    code: `<Splitter.Root>
  <Splitter.Panel size={30}>Sidebar</Splitter.Panel>
  <Splitter.Panel size={70}>
    <Splitter.Root layout="vertical">
      <Splitter.Panel size={60}>Main Content</Splitter.Panel>
      <Splitter.Panel size={40}>Footer Panel</Splitter.Panel>
    </Splitter.Root>
  </Splitter.Panel>
</Splitter.Root>`,
  },
  {
    id: 'responsive',
    name: 'Responsive',
    description: 'Stacks vertically when narrow',
    fullWidth: true,
    component: <ResponsiveExample />,
    code: `<Splitter.Root collapseBelow={500}>
  <Splitter.Panel size={30}>Sidebar</Splitter.Panel>
  <Splitter.Panel size={70}>Main Content</Splitter.Panel>
</Splitter.Root>`,
  },
];

export function SplitterDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Splitter"
        description="Resizable panels with draggable dividers."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Splitter.Root"
        properties={[
          { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction in which panels are arranged.' },
          { name: 'gutterSize', type: 'number', default: '4', description: 'Size of the draggable gutter in pixels.' },
          { name: 'collapseBelow', type: 'number', description: 'Container width in pixels below which horizontal layout collapses to vertical.' },
          { name: 'onResizeEnd', type: '(sizes: number[]) => void', description: 'Called with panel size percentages after a resize completes.' },
        ]}
      />

      <DocPage.ApiSection
        title="Splitter.Panel"
        properties={[
          { name: 'size', type: 'number', description: 'Initial size as a percentage of the container.' },
          { name: 'minSize', type: 'number', default: '5', description: 'Minimum size as a percentage.' },
        ]}
      />
    </DocPage.Root>
  );
}
