import { Text, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Sizes">
        <Stack direction="column" gap="md">
          <Text size="xs">Extra small text (xs)</Text>
          <Text size="sm">Small text (sm)</Text>
          <Text size="base">Base text (base)</Text>
          <Text size="lg">Large text (lg)</Text>
          <Text size="xl">Extra large text (xl)</Text>
        </Stack>
      </DemoSample>

      <DemoSample label="Weights">
        <Stack direction="column" gap="md">
          <Text weight="normal">Normal weight</Text>
          <Text weight="medium">Medium weight</Text>
          <Text weight="semibold">Semibold weight</Text>
          <Text weight="bold">Bold weight</Text>
        </Stack>
      </DemoSample>

      <DemoSample label="Colors">
        <Stack direction="column" gap="md">
          <Text color="base">Base color</Text>
          <Text color="muted">Muted color</Text>
          <Text color="subtle">Subtle color</Text>
          <Text color="primary">Primary color</Text>
          <Text color="success">Success color</Text>
          <Text color="warning">Warning color</Text>
          <Text color="error">Error color</Text>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function PolymorphicExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Elements">
        <Stack direction="column" gap="md">
          <Text as="p">Paragraph (default)</Text>
          <Text as="span">Inline span</Text>
          <Text as="em">Emphasized text</Text>
          <Text as="strong">Strong text</Text>
          <Text as="small" size="sm">Small text element</Text>
          <Text as="del">Deleted text</Text>
        </Stack>
      </DemoSample>

      <DemoSample label="Truncate">
        <div style={{ maxWidth: '300px' }}>
          <Text truncate>This is a very long text that will be truncated with an ellipsis because it overflows the container width</Text>
        </div>
      </DemoSample>

      <DemoSample label="Align">
        <div style={{ width: '100%' }}>
          <Stack direction="column" gap="md">
            <Text align="left">Left aligned</Text>
            <Text align="center">Center aligned</Text>
            <Text align="right">Right aligned</Text>
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
    description: 'General-purpose text with size, weight, and color variants.',
    component: <UsageExample />,
    code: `import { Text } from 'move';

{/* Sizes */}
<Text size="xs">Extra small</Text>
<Text size="base">Base text</Text>
<Text size="xl">Extra large</Text>

{/* Weights */}
<Text weight="medium">Medium weight</Text>
<Text weight="bold">Bold weight</Text>

{/* Colors */}
<Text color="muted">Muted color</Text>
<Text color="primary">Primary color</Text>
<Text color="error">Error color</Text>`,
  },
  {
    id: 'polymorphic',
    name: 'Polymorphic',
    description: 'Render as different HTML elements with the as prop. Supports truncation and alignment.',
    component: <PolymorphicExample />,
    code: `import { Text } from 'move';

<Text as="span">Inline span</Text>
<Text as="em">Emphasized text</Text>
<Text as="strong">Strong text</Text>
<Text as="del">Deleted text</Text>

{/* Truncate */}
<Text truncate>Long text that will be truncated...</Text>

{/* Align */}
<Text align="center">Center aligned</Text>`,
  },
];

export function TextDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Text"
        description="General-purpose text component for body copy, labels, and inline text with size, weight, and color variants."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Text"
        properties={[
          { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl'", default: "'base'", description: 'Font size of the text.' },
          { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold'", default: "'normal'", description: 'Font weight of the text.' },
          { name: 'color', type: "'base' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'error'", default: "'base'", description: 'Text color variant.' },
          { name: 'align', type: "'left' | 'center' | 'right'", description: 'Horizontal text alignment.' },
          { name: 'as', type: "'p' | 'span' | 'div' | 'em' | 'strong' | 'small' | 'del'", default: "'p'", description: 'HTML element to render.' },
          { name: 'truncate', type: 'boolean', description: 'Truncate overflowing text with an ellipsis.' },
        ]}
      />
    </DocPage.Root>
  );
}
