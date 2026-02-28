import { Spinner, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <Spinner />;
}

function SizesExample() {
  return (
    <Stack gap="lg" align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  );
}

function StrokeWidthExample() {
  return (
    <Stack gap="lg" align="center">
      <Spinner strokeWidth={2} />
      <Spinner strokeWidth={4} />
      <Spinner strokeWidth={6} />
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack gap="lg" align="center">
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>default</p>
        <Spinner variant="default" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>secondary</p>
        <Spinner variant="secondary" />
      </div>
      <div style={{ textAlign: 'center', color: 'var(--move-success)' }}>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>current</p>
        <Spinner variant="current" />
      </div>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { Spinner } from 'move';

<Spinner />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From subtle to unmissable',
    component: <SizesExample />,
    code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,
  },
  {
    id: 'stroke-width',
    name: 'Stroke Width',
    description: 'Thin or thick, your call',
    component: <StrokeWidthExample />,
    code: `<Spinner strokeWidth={2} />
<Spinner strokeWidth={4} />
<Spinner strokeWidth={6} />`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Color variants for different contexts',
    component: <VariantsExample />,
    code: `<Spinner variant="default" />
<Spinner variant="secondary" />
<div style={{ color: 'var(--move-success)' }}>
  <Spinner variant="current" />
</div>`,
  },
];

export function SpinnerDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Spinner"
        description="A spinning indicator for loading states."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Spinner"
        properties={[
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the spinner.' },
          { name: 'strokeWidth', type: 'number', default: '3', description: 'Thickness of the spinner stroke.' },
          { name: 'variant', type: "'default' | 'secondary' | 'current'", default: "'default'", description: 'Color variant of the spinner stroke.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, svg, circle.' },
        ]}
      />
    </DocPage.Root>
  );
}
