import { Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Levels">
        <Stack direction="column" gap="md">
          <Heading level={1}>Heading level 1</Heading>
          <Heading level={2}>Heading level 2</Heading>
          <Heading level={3}>Heading level 3</Heading>
          <Heading level={4}>Heading level 4</Heading>
          <Heading level={5}>Heading level 5</Heading>
          <Heading level={6}>Heading level 6</Heading>
        </Stack>
      </DemoSample>

      <DemoSample label="Decoupled size">
        <Stack direction="column" gap="md">
          <Heading level={3} size="4xl">h3 with 4xl visual size</Heading>
          <Heading level={1} size="base">h1 with base visual size</Heading>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Weights">
        <Stack direction="column" gap="md">
          <Heading level={3} weight="medium">Medium weight</Heading>
          <Heading level={3} weight="semibold">Semibold weight</Heading>
          <Heading level={3} weight="bold">Bold weight</Heading>
        </Stack>
      </DemoSample>

      <DemoSample label="Colors">
        <Stack direction="column" gap="md">
          <Heading level={3} color="base">Base color</Heading>
          <Heading level={3} color="muted">Muted color</Heading>
          <Heading level={3} color="subtle">Subtle color</Heading>
        </Stack>
      </DemoSample>

      <DemoSample label="Tracking">
        <Stack direction="column" gap="md">
          <Heading level={2} tracking="tight">Tight tracking (default)</Heading>
          <Heading level={2} tracking="normal">Normal tracking</Heading>
        </Stack>
      </DemoSample>

      <DemoSample label="Truncate">
        <div style={{ maxWidth: '300px' }}>
          <Heading level={3} truncate>This heading is very long and will be truncated with an ellipsis</Heading>
        </div>
      </DemoSample>

      <DemoSample label="Align">
        <div style={{ width: '100%' }}>
          <Stack direction="column" gap="md">
            <Heading level={4} align="left">Left aligned</Heading>
            <Heading level={4} align="center">Center aligned</Heading>
            <Heading level={4} align="right">Right aligned</Heading>
          </Stack>
        </div>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Semantic h1\u2013h6 headings with visual size decoupled from the HTML level.',
    component: <UsageExample />,
    code: `import { Heading } from 'move';

{/* Auto-sized from level */}
<Heading level={1}>Heading 1</Heading>
<Heading level={2}>Heading 2</Heading>
<Heading level={3}>Heading 3</Heading>

{/* Decoupled visual size */}
<Heading level={3} size="4xl">h3 with 4xl visual size</Heading>
<Heading level={1} size="base">h1 with base visual size</Heading>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Weight, color, tracking, alignment, and truncation options.',
    component: <VariantsExample />,
    code: `import { Heading } from 'move';

{/* Weights */}
<Heading level={3} weight="medium">Medium</Heading>
<Heading level={3} weight="bold">Bold</Heading>

{/* Colors */}
<Heading level={3} color="muted">Muted</Heading>
<Heading level={3} color="subtle">Subtle</Heading>

{/* Tracking */}
<Heading level={2} tracking="normal">Normal tracking</Heading>

{/* Truncate */}
<Heading level={3} truncate>Long heading...</Heading>

{/* Align */}
<Heading level={4} align="center">Centered</Heading>`,
  },
];

export function HeadingDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Heading"
        description="Semantic h1\u2013h6 headings with visual size decoupled from the HTML level."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Heading"
        properties={[
          { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Semantic heading level (renders h1\u2013h6).' },
          { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'", description: 'Visual font size, overrides the auto-mapped size from level.' },
          { name: 'weight', type: "'medium' | 'semibold' | 'bold'", default: "'bold'", description: 'Font weight of the heading.' },
          { name: 'color', type: "'base' | 'muted' | 'subtle'", default: "'base'", description: 'Heading color variant.' },
          { name: 'tracking', type: "'tight' | 'normal'", default: "'tight'", description: 'Letter spacing.' },
          { name: 'align', type: "'left' | 'center' | 'right'", description: 'Horizontal text alignment.' },
          { name: 'truncate', type: 'boolean', description: 'Truncate overflowing text with an ellipsis.' },
        ]}
      />
    </DocPage.Root>
  );
}
