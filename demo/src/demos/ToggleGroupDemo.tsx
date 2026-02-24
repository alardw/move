import { ToggleGroup, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';
import {
  AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline,
  List, LayoutGrid, Rows3,
} from 'lucide-react';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Horizontal">
        <ToggleGroup.Root defaultValue="left">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>

      <DemoSample label="With labels">
        <ToggleGroup.Root defaultValue="list">
          <ToggleGroup.Item value="list">
            <List size={16} /> List
          </ToggleGroup.Item>
          <ToggleGroup.Item value="grid">
            <LayoutGrid size={16} /> Grid
          </ToggleGroup.Item>
          <ToggleGroup.Item value="table">
            <Rows3 size={16} /> Table
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>

      <DemoSample label="Vertical">
        <ToggleGroup.Root defaultValue="bold" orientation="vertical">
          <ToggleGroup.Item value="bold" aria-label="Bold">
            <Bold size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="italic" aria-label="Italic">
            <Italic size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="underline" aria-label="Underline">
            <Underline size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Small">
        <ToggleGroup.Root defaultValue="left" size="sm">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={14} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={14} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={14} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>

      <DemoSample label="Medium">
        <ToggleGroup.Root defaultValue="left" size="md">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>

      <DemoSample label="Large">
        <ToggleGroup.Root defaultValue="left" size="lg">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={18} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={18} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={18} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Secondary">
        <ToggleGroup.Root defaultValue="left" variant="secondary">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>

      <DemoSample label="Ghost">
        <ToggleGroup.Root defaultValue="left" variant="ghost">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Group disabled">
        <ToggleGroup.Root defaultValue="left" disabled>
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center">
            <AlignCenter size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>

      <DemoSample label="Single item">
        <ToggleGroup.Root defaultValue="left">
          <ToggleGroup.Item value="left" aria-label="Align left">
            <AlignLeft size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center" aria-label="Align center" disabled>
            <AlignCenter size={16} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="right" aria-label="Align right">
            <AlignRight size={16} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A single-selection group of toggle buttons, like a segmented control.',
    component: <UsageExample />,
    code: `import { ToggleGroup } from 'move';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

{/* Horizontal (default) */}
<ToggleGroup.Root defaultValue="left">
  <ToggleGroup.Item value="left" aria-label="Align left">
    <AlignLeft size={16} />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="center" aria-label="Align center">
    <AlignCenter size={16} />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="right" aria-label="Align right">
    <AlignRight size={16} />
  </ToggleGroup.Item>
</ToggleGroup.Root>

{/* Vertical */}
<ToggleGroup.Root defaultValue="bold" orientation="vertical">
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Set the size on Root — all items inherit it.',
    component: <SizesExample />,
    code: `<ToggleGroup.Root defaultValue="left" size="sm">
  <ToggleGroup.Item value="left">…</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root defaultValue="left" size="md">
  <ToggleGroup.Item value="left">…</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root defaultValue="left" size="lg">
  <ToggleGroup.Item value="left">…</ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Secondary (default) and ghost variants.',
    component: <VariantsExample />,
    code: `<ToggleGroup.Root defaultValue="left" variant="secondary">
  <ToggleGroup.Item value="left">…</ToggleGroup.Item>
</ToggleGroup.Root>

<ToggleGroup.Root defaultValue="left" variant="ghost">
  <ToggleGroup.Item value="left">…</ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Disable the entire group or individual items.',
    component: <DisabledExample />,
    code: `{/* Entire group */}
<ToggleGroup.Root defaultValue="left" disabled>
  <ToggleGroup.Item value="left">…</ToggleGroup.Item>
</ToggleGroup.Root>

{/* Single item */}
<ToggleGroup.Root defaultValue="left">
  <ToggleGroup.Item value="center" disabled>…</ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
];

export function ToggleGroupDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ToggleGroup"
        description="A single-selection group of toggle buttons with connected styling, like a segmented control."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ToggleGroup.Root"
        properties={[
          { name: 'value', type: 'string', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'string', description: 'The value selected by default.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected value changes.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction of the group.' },
          { name: 'disabled', type: 'boolean', description: 'Whether all items in the group are disabled.' },
          { name: 'loop', type: 'boolean', description: 'Whether keyboard navigation loops from last to first item.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of all items in the group.' },
          { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'secondary'", description: 'Visual style variant for all items.' },
        ]}
      />

      <DocPage.ApiSection
        title="ToggleGroup.Item"
        properties={[
          { name: 'value', type: 'string', description: 'The unique value for this item.' },
          { name: 'disabled', type: 'boolean', description: 'Whether this item is disabled.' },
          { name: 'animate', type: 'ElementAnimate | false', description: 'Animates ToggleGroup.Item (hover scale, press scale).' },
        ]}
      />
    </DocPage.Root>
  );
}
