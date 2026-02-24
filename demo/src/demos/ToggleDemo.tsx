import { ToggleButton, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';
import { Bold, Italic, Underline } from 'lucide-react';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Stack direction="row" gap="sm">
          <ToggleButton aria-label="Toggle bold">
            <Bold size={16} />
          </ToggleButton>
          <ToggleButton aria-label="Toggle italic">
            <Italic size={16} /> Italic
          </ToggleButton>
          <ToggleButton aria-label="Toggle underline">
            <Underline size={16} /> Underline
          </ToggleButton>
        </Stack>
      </DemoSample>

      <DemoSample label="Pressed">
        <Stack direction="row" gap="sm">
          <ToggleButton defaultPressed aria-label="Bold on">
            <Bold size={16} /> Bold
          </ToggleButton>
          <ToggleButton aria-label="Italic off">
            <Italic size={16} /> Italic
          </ToggleButton>
        </Stack>
      </DemoSample>

      <DemoSample label="Disabled">
        <Stack direction="row" gap="sm">
          <ToggleButton disabled aria-label="Disabled off">
            <Bold size={16} /> Off
          </ToggleButton>
          <ToggleButton disabled defaultPressed aria-label="Disabled on">
            <Italic size={16} /> On
          </ToggleButton>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A two-state button that can be toggled on or off.',
    component: <UsageExample />,
    code: `import { ToggleButton } from 'move';
import { Bold, Italic } from 'lucide-react';

<ToggleButton aria-label="Toggle bold">
  <Bold size={16} />
</ToggleButton>

{/* With text */}
<ToggleButton aria-label="Toggle italic">
  <Italic size={16} /> Italic
</ToggleButton>

{/* Default pressed */}
<ToggleButton defaultPressed>
  <Bold size={16} /> Bold
</ToggleButton>

{/* Disabled */}
<ToggleButton disabled>Off</ToggleButton>
<ToggleButton disabled defaultPressed>On</ToggleButton>`,
  },
];

export function ToggleDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ToggleButton"
        description="A two-state button that can be toggled on or off, using regular button styling."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ToggleButton"
        properties={[
          { name: 'pressed', type: 'boolean', description: 'Controlled pressed state.' },
          { name: 'defaultPressed', type: 'boolean', description: 'Whether the button is pressed by default.' },
          { name: 'onPressedChange', type: '(pressed: boolean) => void', description: 'Called when the pressed state changes.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the button is disabled.' },
          { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'secondary'", description: 'Visual style variant.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.' },
          { name: 'animate', type: 'ElementAnimate | false', description: 'Animates ToggleButton (hover scale, press scale).' },
        ]}
      />
    </DocPage.Root>
  );
}
