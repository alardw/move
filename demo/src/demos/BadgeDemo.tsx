import { Badge, MoveProvider } from 'move';
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

function PassThroughExample() {
  return (
    <MoveProvider pt={{ Badge: { root: { style: { fontWeight: 'bold', letterSpacing: '0.05em' } } } }}>
      <Stack gap="md" wrap align="center">
        <Badge variant="primary">Global Style</Badge>
        <Badge variant="success" pt={{ root: { style: { borderRadius: '4px' } } }}>Instance Style</Badge>
        <Badge variant="outline" pt={{ root: { className: 'custom-badge' } }}>Custom Class</Badge>
      </Stack>
    </MoveProvider>
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
  {
    id: 'passthrough',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per badge',
    component: <PassThroughExample />,
    code: `<MoveProvider pt={{
  Badge: { root: { style: { fontWeight: 'bold', letterSpacing: '0.05em' } } }
}}>
  <Badge variant="primary">Global Style</Badge>
  <Badge variant="success" pt={{ root: { style: { borderRadius: '4px' } } }}>
    Instance Style
  </Badge>
  <Badge variant="outline" pt={{ root: { className: 'custom-badge' } }}>
    Custom Class
  </Badge>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
