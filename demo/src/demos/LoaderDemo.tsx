import { Loader, Heading, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <Loader />;
}

function SizesExample() {
  return (
    <Stack gap="lg" align="center">
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" />
    </Stack>
  );
}

function ColorsExample() {
  return (
    <Stack gap="lg" align="center">
      <Loader color="primary" />
      <Loader color="secondary" />
      <div style={{ color: 'var(--move-danger)' }}>
        <Loader color="current" />
      </div>
    </Stack>
  );
}

function StrokeWidthExample() {
  return (
    <Stack gap="lg" align="center">
      <Loader strokeWidth={2} />
      <Loader strokeWidth={4} />
      <Loader strokeWidth={6} />
    </Stack>
  );
}

function DotsVariantExample() {
  return (
    <Stack gap="xl" align="center">
      <Loader variant="dots" />
    </Stack>
  );
}

function DotsSizesExample() {
  return (
    <Stack gap="xl" align="center">
      <Loader variant="dots" size="sm" />
      <Loader variant="dots" size="md" />
      <Loader variant="dots" size="lg" />
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider
      slotProps={{
        Loader: {
          root: { style: { '--move-loader-color': 'var(--move-success)' } as React.CSSProperties },
        },
      }}
    >
      <Stack gap="lg" align="center">
        <Loader />
        <Loader variant="dots" />
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A spinning indicator for loading states.',
    component: <UsageExample />,
    code: `import { Loader } from 'move';

<Loader />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From subtle to unmissable.',
    component: <SizesExample />,
    code: `<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />`,
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'Match your context with color presets.',
    component: <ColorsExample />,
    code: `<Loader color="primary" />
<Loader color="secondary" />
<Loader color="current" />`,
  },
  {
    id: 'stroke-width',
    name: 'Stroke Width',
    description: 'Thin or thick, your call.',
    component: <StrokeWidthExample />,
    code: `<Loader strokeWidth={2} />
<Loader strokeWidth={4} />
<Loader strokeWidth={6} />`,
  },
  {
    id: 'dots-variant',
    name: 'Dots',
    description: 'Bouncing dots with squish and shadow.',
    component: <DotsVariantExample />,
    code: `<Loader variant="dots" />`,
  },
  {
    id: 'dots-sizes',
    name: 'Dots Sizes',
    description: 'Scale the dots to fit your layout.',
    component: <DotsSizesExample />,
    code: `<Loader variant="dots" size="sm" />
<Loader variant="dots" size="md" />
<Loader variant="dots" size="lg" />`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Override colors globally or per instance.',
    component: <CustomStylingExample />,
    code: `import { MoveProvider, Loader } from 'move';

<MoveProvider
  slotProps={{
    Loader: {
      root: {
        style: { '--move-loader-color': 'var(--move-success)' },
      },
    },
  }}
>
  <Loader />
  <Loader variant="dots" />
</MoveProvider>`,
  },
];

export function LoaderDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Loader"
        description="Animated indicators that keep users in the loop while content loads."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Loader"
        properties={[
          { name: 'variant', type: "'spinner' | 'dots'", default: "'spinner'", description: 'The visual style of the loader.' },
          { name: 'color', type: "'primary' | 'secondary' | 'current'", default: "'primary'", description: 'Color preset for the loader.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the loader.' },
          { name: 'strokeWidth', type: 'number', default: '3', description: 'Thickness of the spinner stroke (spinner variant only).' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, svg, circle, dot.' },
        ]}
      />
    </DocPage.Root>
  );
}
