import { useState } from 'react';
import { Pagination, MoveProvider, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <Pagination.Root total={5}>
      <Pagination.PrevTrigger />
      <Pagination.Items />
      <Pagination.NextTrigger />
    </Pagination.Root>
  );
}

function ControlledExample() {
  const [page, setPage] = useState(3);

  return (
    <Stack gap="md" align="start">
      <span>Page: {page}</span>
      <Pagination.Root total={20} page={page} onChange={setPage}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="lg">
      <Pagination.Root total={10} size="sm">
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
      <Pagination.Root total={10} size="md">
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
      <Pagination.Root total={10} size="lg">
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack gap="lg">
      <Pagination.Root total={10} variant="default" defaultPage={3}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
      <Pagination.Root total={10} variant="outline" defaultPage={3}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </Stack>
  );
}

function SiblingsExample() {
  return (
    <Stack gap="lg">
      <Pagination.Root total={20} defaultPage={10} siblings={1}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
      <Pagination.Root total={20} defaultPage={10} siblings={2}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
      <Pagination.Root total={20} defaultPage={10} siblings={3}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider
      pt={{
        PaginationRoot: {
          root: { style: { gap: '0.5rem' } },
        },
      }}
    >
      <Stack gap="md">
        <Pagination.Root total={10} defaultPage={3}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>
        <Pagination.Root
          total={10}
          defaultPage={5}
          pt={{ root: { style: { gap: '1rem' } } }}
        >
          <Pagination.PrevTrigger />
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    fullWidth: true,
    component: <UsageExample />,
    code: `import { Pagination } from 'move';

<Pagination.Root total={5}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Take the wheel and drive the page state yourself',
    fullWidth: true,
    component: <ControlledExample />,
    code: `const [page, setPage] = useState(3);

<Pagination.Root total={20} page={page} onChange={setPage}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to spacious',
    fullWidth: true,
    component: <SizesExample />,
    code: `<Pagination.Root total={10} size="sm">
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>

<Pagination.Root total={10} size="md">
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>

<Pagination.Root total={10} size="lg">
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'A style for every context',
    fullWidth: true,
    component: <VariantsExample />,
    code: `<Pagination.Root total={10} variant="default" defaultPage={3}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>

<Pagination.Root total={10} variant="outline" defaultPage={3}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>`,
  },
  {
    id: 'siblings',
    name: 'Siblings',
    description: 'Control how many page numbers surround the active one',
    fullWidth: true,
    component: <SiblingsExample />,
    code: `<Pagination.Root total={20} defaultPage={10} siblings={1}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>

<Pagination.Root total={20} defaultPage={10} siblings={2}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>

<Pagination.Root total={20} defaultPage={10} siblings={3}>
  <Pagination.PrevTrigger />
  <Pagination.Items />
  <Pagination.NextTrigger />
</Pagination.Root>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance',
    fullWidth: true,
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{ PaginationRoot: { root: { style: { gap: '0.5rem' } } } }}>
  <Pagination.Root total={10} defaultPage={3}>
    <Pagination.PrevTrigger />
    <Pagination.Items />
    <Pagination.NextTrigger />
  </Pagination.Root>
  <Pagination.Root total={10} defaultPage={5} pt={{ root: { style: { gap: '1rem' } } }}>
    <Pagination.PrevTrigger />
    <Pagination.Items />
    <Pagination.NextTrigger />
  </Pagination.Root>
</MoveProvider>`,
  },
];

export function PaginationDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Pagination"
        description="Navigate through pages of content with ease."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Pagination.Root"
        properties={[
          { name: 'total', type: 'number', description: 'Total number of pages.' },
          { name: 'page', type: 'number', description: 'Controlled active page (1-based).' },
          { name: 'defaultPage', type: 'number', default: '1', description: 'Initial page when uncontrolled.' },
          { name: 'onChange', type: '(page: number) => void', description: 'Called when the active page changes.' },
          { name: 'siblings', type: 'number', default: '1', description: 'Pages shown on each side of the active page.' },
          { name: 'boundaries', type: 'number', default: '1', description: 'Pages always visible at the start and end.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of pagination controls.' },
          { name: 'variant', type: "'default' | 'outline'", default: "'default'", description: 'Visual style of the active page.' },
        ]}
      />

      <DocPage.ApiSection
        title="Pagination.PrevTrigger"
        properties={[
          { name: 'children', type: 'ReactNode', description: 'Custom content. Defaults to a chevron icon.' },
        ]}
      />

      <DocPage.ApiSection
        title="Pagination.NextTrigger"
        properties={[
          { name: 'children', type: 'ReactNode', description: 'Custom content. Defaults to a chevron icon.' },
        ]}
      />
    </DocPage.Root>
  );
}
