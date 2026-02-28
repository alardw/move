import { Breadcrumb, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

function CustomSeparatorExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Slash">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Library</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Data</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>
      </DemoSample>

      <DemoSample label="Dash">
        <Breadcrumb separator="–">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Profile</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>
      </DemoSample>
    </Stack>
  );
}

function CollapsingExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="maxItems={3}">
        <Breadcrumb maxItems={3}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Documents</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">2024</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Report</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>
      </DemoSample>

      <DemoSample label="Before=2, After=2">
        <Breadcrumb maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Users</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Admin</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">Permissions</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Roles</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <DemoSample key={size} label={size}>
          <Breadcrumb size={size}>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb>
        </DemoSample>
      ))}
    </Stack>
  );
}

function AsChildExample() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Breadcrumb.Link asChild>
          <button type="button" onClick={() => alert('Navigate to Home')}>Home</button>
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link asChild>
          <button type="button" onClick={() => alert('Navigate to Docs')}>Docs</button>
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Current</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Basic breadcrumb with links and a current page.',
    component: <UsageExample />,
    code: `import { Breadcrumb } from 'move';

<Breadcrumb>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb>`,
  },
  {
    id: 'custom-separator',
    name: 'Custom Separator',
    description: 'Override the default chevron separator with any text or node.',
    component: <CustomSeparatorExample />,
    code: `<Breadcrumb separator="/">
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Library</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Page>Data</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb>`,
  },
  {
    id: 'collapsing',
    name: 'Collapsing',
    description: 'Automatically collapse long trails with maxItems and an ellipsis.',
    component: <CollapsingExample />,
    code: `<Breadcrumb maxItems={3}>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Documents</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">2024</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Page>Report</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Three size variants: sm, md (default), and lg.',
    component: <SizesExample />,
    code: `<Breadcrumb size="sm">…</Breadcrumb>
<Breadcrumb size="md">…</Breadcrumb>
<Breadcrumb size="lg">…</Breadcrumb>`,
  },
  {
    id: 'aschild',
    name: 'With Routing',
    description: 'Use asChild on Breadcrumb.Link to compose with router links or buttons.',
    component: <AsChildExample />,
    code: `<Breadcrumb>
  <Breadcrumb.Item>
    <Breadcrumb.Link asChild>
      <RouterLink to="/">Home</RouterLink>
    </Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link asChild>
      <RouterLink to="/docs">Docs</RouterLink>
    </Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Page>Current</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb>`,
  },
];

export function BreadcrumbDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Breadcrumb"
        description="Navigation breadcrumbs showing the current page's location within a hierarchy."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Breadcrumb"
        properties={[
          { name: 'separator', type: 'ReactNode', description: 'Custom separator between items. Default: chevron-right icon.' },
          { name: 'maxItems', type: 'number', description: 'Maximum items to show before collapsing with an ellipsis.' },
          { name: 'itemsBeforeCollapse', type: 'number', default: '1', description: 'Number of items to show before the ellipsis.' },
          { name: 'itemsAfterCollapse', type: 'number', default: '1', description: 'Number of items to show after the ellipsis.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant affecting font size and spacing.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, list.' },
        ]}
      />

      <DocPage.ApiSection
        title="Breadcrumb.Link"
        properties={[
          { name: 'asChild', type: 'boolean', default: 'false', description: 'Merge link styles onto the child element for router link composition.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the link element.' },
        ]}
      />
    </DocPage.Root>
  );
}
