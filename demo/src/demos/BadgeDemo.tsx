import { Badge, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <Badge>New</Badge>;
}

function VariantsExample() {
  return (
    <Stack gap="md" wrap align="center">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="md" wrap align="center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { Badge } from 'move';\n\n<Badge>New</Badge>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'A color for every occasion',
    component: <VariantsExample />,
    code: `<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From subtle to bold',
    component: <SizesExample />,
    code: `<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`,
  },
];

export function BadgeDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Badge"
        description="Tiny labels for status, tags, and counts."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Badge"
        properties={[
          { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'", default: "'primary'", description: 'Visual style of the badge.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the badge.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />
    </DocPage.Root>
  );
}
