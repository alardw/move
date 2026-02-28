import { useState } from 'react';
import { Timeline, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';
import { GitBranch, GitCommit, GitMerge, Check } from 'lucide-react';

function UsageExample() {
  return (
    <DemoSample label="Basic">
      <Timeline.Root active={1}>
        <Timeline.Item title="Order placed">
          Your order has been confirmed and is being processed.
        </Timeline.Item>
        <Timeline.Item title="Processing">
          Package is being prepared for shipment.
        </Timeline.Item>
        <Timeline.Item title="Shipped">
          On its way to the destination.
        </Timeline.Item>
        <Timeline.Item title="Delivered">
          Package delivered to your doorstep.
        </Timeline.Item>
      </Timeline.Root>
    </DemoSample>
  );
}

function BulletsExample() {
  return (
    <DemoSample label="Custom bullets">
      <Timeline.Root active={2}>
        <Timeline.Item title="Branch created" bullet={<GitBranch size={14} />}>
          New feature branch created from main.
        </Timeline.Item>
        <Timeline.Item title="Committed" bullet={<GitCommit size={14} />}>
          Initial implementation committed.
        </Timeline.Item>
        <Timeline.Item title="Merged" bullet={<GitMerge size={14} />}>
          Pull request merged into main.
        </Timeline.Item>
      </Timeline.Root>
    </DemoSample>
  );
}

function SizesExample() {
  return (
    <Stack gap="xl" wrap>
      <DemoSample label="Small">
        <Timeline.Root size="sm" active={1}>
          <Timeline.Item title="Step 1">First step completed.</Timeline.Item>
          <Timeline.Item title="Step 2">In progress.</Timeline.Item>
          <Timeline.Item title="Step 3">Waiting.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
      <DemoSample label="Medium (default)">
        <Timeline.Root size="md" active={1}>
          <Timeline.Item title="Step 1">First step completed.</Timeline.Item>
          <Timeline.Item title="Step 2">In progress.</Timeline.Item>
          <Timeline.Item title="Step 3">Waiting.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
      <DemoSample label="Large">
        <Timeline.Root size="lg" active={1}>
          <Timeline.Item title="Step 1">First step completed.</Timeline.Item>
          <Timeline.Item title="Step 2">In progress.</Timeline.Item>
          <Timeline.Item title="Step 3">Waiting.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
    </Stack>
  );
}

function ColorsExample() {
  return (
    <Stack gap="xl" wrap>
      {(['primary', 'success', 'warning', 'danger', 'gray'] as const).map(color => (
        <DemoSample key={color} label={color}>
          <Timeline.Root color={color} active={1}>
            <Timeline.Item title="Done">Completed.</Timeline.Item>
            <Timeline.Item title="Current">In progress.</Timeline.Item>
            <Timeline.Item title="Next">Pending.</Timeline.Item>
          </Timeline.Root>
        </DemoSample>
      ))}
    </Stack>
  );
}

function AlignExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Left (default)">
        <Timeline.Root active={1}>
          <Timeline.Item title="First">Content on the right.</Timeline.Item>
          <Timeline.Item title="Second">Content on the right.</Timeline.Item>
          <Timeline.Item title="Third">Content on the right.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
      <DemoSample label="Right">
        <Timeline.Root active={1} align="right">
          <Timeline.Item title="First">Content on the left.</Timeline.Item>
          <Timeline.Item title="Second">Content on the left.</Timeline.Item>
          <Timeline.Item title="Third">Content on the left.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
      <DemoSample label="Alternate">
        <Timeline.Root active={2} align="alternate">
          <Timeline.Item title="2024 Q1">Company founded with a small team.</Timeline.Item>
          <Timeline.Item title="2024 Q2">Seed round closed successfully.</Timeline.Item>
          <Timeline.Item title="2024 Q3">Product launched to public beta.</Timeline.Item>
          <Timeline.Item title="2024 Q4">Series A round planned.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
    </Stack>
  );
}

function LineVariantsExample() {
  return (
    <Stack gap="xl" wrap>
      <DemoSample label="Solid">
        <Timeline.Root active={1} lineVariant="solid">
          <Timeline.Item title="Step 1">Done.</Timeline.Item>
          <Timeline.Item title="Step 2">Current.</Timeline.Item>
          <Timeline.Item title="Step 3">Next.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
      <DemoSample label="Dashed">
        <Timeline.Root active={1} lineVariant="dashed">
          <Timeline.Item title="Step 1">Done.</Timeline.Item>
          <Timeline.Item title="Step 2">Current.</Timeline.Item>
          <Timeline.Item title="Step 3">Next.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
      <DemoSample label="Dotted">
        <Timeline.Root active={1} lineVariant="dotted">
          <Timeline.Item title="Step 1">Done.</Timeline.Item>
          <Timeline.Item title="Step 2">Current.</Timeline.Item>
          <Timeline.Item title="Step 3">Next.</Timeline.Item>
        </Timeline.Root>
      </DemoSample>
    </Stack>
  );
}

function ControlledExample() {
  const [active, setActive] = useState(0);
  const steps = ['Research', 'Design', 'Development', 'Testing', 'Launch'];

  return (
    <DemoSample label="Controlled">
      <Stack direction="column" gap="md">
        <Timeline.Root active={active} color="success">
          {steps.map((step, i) => (
            <Timeline.Item
              key={step}
              title={step}
              bullet={i <= active ? <Check size={12} /> : undefined}
            >
              {i < active ? 'Completed' : i === active ? 'In progress...' : 'Upcoming'}
            </Timeline.Item>
          ))}
        </Timeline.Root>
        <Stack gap="sm">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActive(Math.max(-1, active - 1))}
            disabled={active < 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
            disabled={active >= steps.length - 1}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </DemoSample>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A vertical timeline that tracks progress through a sequence of steps.',
    component: <UsageExample />,
    code: `import { Timeline } from 'move';

<Timeline.Root active={1}>
  <Timeline.Item title="Order placed">
    Your order has been confirmed and is being processed.
  </Timeline.Item>
  <Timeline.Item title="Processing">
    Package is being prepared for shipment.
  </Timeline.Item>
  <Timeline.Item title="Shipped">
    On its way to the destination.
  </Timeline.Item>
  <Timeline.Item title="Delivered">
    Package delivered to your doorstep.
  </Timeline.Item>
</Timeline.Root>`,
  },
  {
    id: 'bullets',
    name: 'Custom Bullets',
    description: 'Replace the default dot with icons or any content.',
    component: <BulletsExample />,
    code: `import { Timeline } from 'move';
import { GitBranch, GitCommit, GitMerge } from 'lucide-react';

<Timeline.Root active={2}>
  <Timeline.Item title="Branch created" bullet={<GitBranch size={14} />}>
    New feature branch created from main.
  </Timeline.Item>
  <Timeline.Item title="Committed" bullet={<GitCommit size={14} />}>
    Initial implementation committed.
  </Timeline.Item>
  <Timeline.Item title="Merged" bullet={<GitMerge size={14} />}>
    Pull request merged into main.
  </Timeline.Item>
</Timeline.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to spacious.',
    component: <SizesExample />,
    code: `<Timeline.Root size="sm" active={1}>
  <Timeline.Item title="Step 1">First step completed.</Timeline.Item>
  <Timeline.Item title="Step 2">In progress.</Timeline.Item>
  <Timeline.Item title="Step 3">Waiting.</Timeline.Item>
</Timeline.Root>

<Timeline.Root size="md" active={1}>
  <Timeline.Item title="Step 1">First step completed.</Timeline.Item>
  <Timeline.Item title="Step 2">In progress.</Timeline.Item>
  <Timeline.Item title="Step 3">Waiting.</Timeline.Item>
</Timeline.Root>

<Timeline.Root size="lg" active={1}>
  <Timeline.Item title="Step 1">First step completed.</Timeline.Item>
  <Timeline.Item title="Step 2">In progress.</Timeline.Item>
  <Timeline.Item title="Step 3">Waiting.</Timeline.Item>
</Timeline.Root>`,
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'A color for every context.',
    component: <ColorsExample />,
    code: `<Timeline.Root color="primary" active={1}>
  <Timeline.Item title="Done">Completed.</Timeline.Item>
  <Timeline.Item title="Current">In progress.</Timeline.Item>
  <Timeline.Item title="Next">Pending.</Timeline.Item>
</Timeline.Root>

<Timeline.Root color="success" active={1}>
  <Timeline.Item title="Done">Completed.</Timeline.Item>
  <Timeline.Item title="Current">In progress.</Timeline.Item>
  <Timeline.Item title="Next">Pending.</Timeline.Item>
</Timeline.Root>

<Timeline.Root color="danger" active={1}>
  <Timeline.Item title="Done">Completed.</Timeline.Item>
  <Timeline.Item title="Current">In progress.</Timeline.Item>
  <Timeline.Item title="Next">Pending.</Timeline.Item>
</Timeline.Root>`,
  },
  {
    id: 'alignment',
    name: 'Alignment',
    description: 'Left, right, or alternating sides.',
    component: <AlignExample />,
    code: `<Timeline.Root active={1} align="left">
  <Timeline.Item title="First">Content on the right.</Timeline.Item>
  <Timeline.Item title="Second">Content on the right.</Timeline.Item>
</Timeline.Root>

<Timeline.Root active={1} align="right">
  <Timeline.Item title="First">Content on the left.</Timeline.Item>
  <Timeline.Item title="Second">Content on the left.</Timeline.Item>
</Timeline.Root>

<Timeline.Root active={2} align="alternate">
  <Timeline.Item title="2024 Q1">Company founded.</Timeline.Item>
  <Timeline.Item title="2024 Q2">Seed round closed.</Timeline.Item>
  <Timeline.Item title="2024 Q3">Product launched.</Timeline.Item>
  <Timeline.Item title="2024 Q4">Series A planned.</Timeline.Item>
</Timeline.Root>`,
  },
  {
    id: 'line-variants',
    name: 'Line Variants',
    description: 'Solid, dashed, or dotted connectors.',
    component: <LineVariantsExample />,
    code: `<Timeline.Root active={1} lineVariant="solid">
  <Timeline.Item title="Step 1">Done.</Timeline.Item>
  <Timeline.Item title="Step 2">Current.</Timeline.Item>
  <Timeline.Item title="Step 3">Next.</Timeline.Item>
</Timeline.Root>

<Timeline.Root active={1} lineVariant="dashed">
  <Timeline.Item title="Step 1">Done.</Timeline.Item>
  <Timeline.Item title="Step 2">Current.</Timeline.Item>
  <Timeline.Item title="Step 3">Next.</Timeline.Item>
</Timeline.Root>

<Timeline.Root active={1} lineVariant="dotted">
  <Timeline.Item title="Step 1">Done.</Timeline.Item>
  <Timeline.Item title="Step 2">Current.</Timeline.Item>
  <Timeline.Item title="Step 3">Next.</Timeline.Item>
</Timeline.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Step through progress with external state.',
    component: <ControlledExample />,
    code: `import { useState } from 'react';
import { Timeline, Button } from 'move';
import { Check } from 'lucide-react';

const [active, setActive] = useState(0);
const steps = ['Research', 'Design', 'Development', 'Testing', 'Launch'];

<Timeline.Root active={active} color="success">
  {steps.map((step, i) => (
    <Timeline.Item
      key={step}
      title={step}
      bullet={i <= active ? <Check size={12} /> : undefined}
    >
      {i < active ? 'Completed' : i === active ? 'In progress...' : 'Upcoming'}
    </Timeline.Item>
  ))}
</Timeline.Root>
<Button onClick={() => setActive(a => Math.min(steps.length - 1, a + 1))}>
  Next
</Button>
<Button variant="secondary" onClick={() => setActive(a => Math.max(-1, a - 1))}>
  Previous
</Button>`,
  },
];

export function TimelineDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Timeline"
        description="Vertical timeline to visualize a sequence of events or steps with progress tracking."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Timeline.Root"
        properties={[
          { name: 'active', type: 'number', default: '-1', description: 'Index of the active item. Items before it show as completed.' },
          { name: 'align', type: "'left' | 'right' | 'alternate'", default: "'left'", description: 'Bullet position.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Timeline size.' },
          { name: 'color', type: "'primary' | 'gray' | 'success' | 'warning' | 'danger'", default: "'primary'", description: 'Active and completed color.' },
          { name: 'lineVariant', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'Connector line style.' },
          { name: 'reverseActive', type: 'boolean', default: 'false', description: 'Reverse active logic: items after active index are completed.' },
          { name: 'animate', type: 'ListAnimate | false', description: 'Stagger enter animation config.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for: root.' },
        ]}
      />

      <DocPage.ApiSection
        title="Timeline.Item"
        properties={[
          { name: 'title', type: 'ReactNode', description: 'Item title displayed above the content.' },
          { name: 'bullet', type: 'ReactNode', description: 'Custom bullet content (icon, number). Enlarges the bullet when provided.' },
          { name: 'color', type: "'primary' | 'gray' | 'success' | 'warning' | 'danger'", description: 'Override the root color for this item.' },
          { name: 'lineVariant', type: "'solid' | 'dashed' | 'dotted'", description: 'Override the line style for this item.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for: item, bullet, line, content, title.' },
        ]}
      />
    </DocPage.Root>
  );
}
