import { Link, Text, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Variants">
        <Stack direction="row" gap="lg">
          <Link href="#" variant="default">Default link</Link>
          <Link href="#" variant="muted">Muted link</Link>
          <Link href="#" variant="subtle">Subtle link</Link>
        </Stack>
      </DemoSample>

      <DemoSample label="Underline">
        <Stack direction="row" gap="lg">
          <Link href="#" underline="always">Always underlined</Link>
          <Link href="#" underline="hover">Underline on hover</Link>
          <Link href="#" underline="none">No underline</Link>
        </Stack>
      </DemoSample>

      <DemoSample label="Sizes">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--move-spacing-lg)' }}>
          <Link href="#" size="xs">Extra small</Link>
          <Link href="#" size="sm">Small</Link>
          <Link href="#" size="base">Base</Link>
          <Link href="#" size="lg">Large</Link>
          <Link href="#" size="xl">Extra large</Link>
        </div>
      </DemoSample>

      <DemoSample label="External">
        <Link href="https://example.com" external>
          External link (opens in new tab)
        </Link>
      </DemoSample>

      <DemoSample label="Inline">
        <Text>
          This is a paragraph with an{' '}
          <Link href="#">inline link</Link>
          {' '}in the middle of it.
        </Text>
      </DemoSample>
    </Stack>
  );
}

function AsChildExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="asChild">
        <Link asChild variant="default" underline="always">
          <button type="button" onClick={() => alert('Clicked!')}>
            Link styled as button
          </button>
        </Link>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Anchor links with variant, underline, size, and external options.',
    component: <UsageExample />,
    code: `import { Link } from 'move';

{/* Variants */}
<Link href="#" variant="default">Default link</Link>
<Link href="#" variant="muted">Muted link</Link>
<Link href="#" variant="subtle">Subtle link</Link>

{/* Underline */}
<Link href="#" underline="always">Always underlined</Link>
<Link href="#" underline="hover">Underline on hover</Link>
<Link href="#" underline="none">No underline</Link>

{/* Sizes */}
<Link href="#" size="sm">Small link</Link>
<Link href="#" size="lg">Large link</Link>

{/* External (opens in new tab) */}
<Link href="https://example.com" external>
  External link
</Link>`,
  },
  {
    id: 'aschild',
    name: 'asChild',
    description: 'Compose Link styles onto any child element using the asChild prop.',
    component: <AsChildExample />,
    code: `import { Link } from 'move';

<Link asChild variant="default" underline="always">
  <button onClick={() => alert('Clicked!')}>
    Link styled as button
  </button>
</Link>`,
  },
];

export function LinkDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Link"
        description="Anchor links with variant, underline, and size options. Supports asChild for router link composition."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Link"
        properties={[
          { name: 'variant', type: "'default' | 'muted' | 'subtle'", default: "'default'", description: 'Visual style variant.' },
          { name: 'underline', type: "'always' | 'hover' | 'none'", default: "'hover'", description: 'When to show the underline.' },
          { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl'", description: 'Font size of the link.' },
          { name: 'external', type: 'boolean', description: 'Opens the link in a new tab with rel="noopener noreferrer".' },
          { name: 'asChild', type: 'boolean', default: 'false', description: 'Merge link styles onto the child element instead of rendering an anchor.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />
    </DocPage.Root>
  );
}
