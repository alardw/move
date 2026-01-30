import { Spinner, MoveProvider } from 'move';
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

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      Spinner: {
        root: { style: { '--move-spinner-stroke': 'var(--move-success)' } as React.CSSProperties },
      },
    }}>
      <Stack gap="lg" align="center">
        <Spinner />
        <Spinner pt={{ root: { style: { '--move-spinner-stroke': 'var(--move-danger)' } as React.CSSProperties } }} />
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
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Change the color globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  Spinner: {
    root: { style: { '--move-spinner-stroke': 'var(--move-success)' } },
  },
}}>
  <Spinner />
  <Spinner pt={{ root: { style: { '--move-spinner-stroke': 'var(--move-danger)' } } }} />
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
