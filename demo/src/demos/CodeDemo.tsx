import { Code, Text, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Inline">
        <Text>
          Run <Code>npm install move</Code> to get started.
        </Text>
      </DemoSample>

      <DemoSample label="Variants">
        <Stack direction="row" gap="lg">
          <Code variant="subtle">subtle</Code>
          <Code variant="outline">outline</Code>
          <Code variant="ghost">ghost</Code>
        </Stack>
      </DemoSample>

      <DemoSample label="Sizes">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--move-spacing-lg)' }}>
          <Code size="xs">xs</Code>
          <Code size="sm">sm</Code>
          <Code size="base">base</Code>
          <Code size="lg">lg</Code>
        </div>
      </DemoSample>
    </Stack>
  );
}

function BlockExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Block">
        <Code block>{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}</Code>
      </DemoSample>

      <DemoSample label="Block outline">
        <Code block variant="outline">{`const config = {
  theme: 'dark',
  language: 'en',
};`}</Code>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Inline code spans with variant and size options.',
    component: <UsageExample />,
    code: `import { Code, Text } from 'move';

{/* Inline code */}
<Text>
  Run <Code>npm install move</Code> to get started.
</Text>

{/* Variants */}
<Code variant="subtle">subtle</Code>
<Code variant="outline">outline</Code>
<Code variant="ghost">ghost</Code>

{/* Sizes */}
<Code size="xs">xs</Code>
<Code size="base">base</Code>`,
  },
  {
    id: 'block',
    name: 'Code Block',
    description: 'Multi-line code blocks rendered as <pre><code>.',
    component: <BlockExample />,
    code: `import { Code } from 'move';

<Code block>{\`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`;
}\`}</Code>

<Code block variant="outline">{\`const config = {
  theme: 'dark',
};\`}</Code>`,
  },
];

export function CodeDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Code"
        description="Inline code and code blocks with monospace font. Supports variant and size options."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Code"
        properties={[
          { name: 'variant', type: "'subtle' | 'outline' | 'ghost'", default: "'subtle'", description: 'Visual style variant.' },
          { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg'", default: "'sm'", description: 'Font size of the code.' },
          { name: 'block', type: 'boolean', description: 'Render as a block-level code block wrapped in a <pre> element.' },
        ]}
      />
    </DocPage.Root>
  );
}
