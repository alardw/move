import { Button, Icon, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <Button>Click me</Button>;
}

function VariantsExample() {
  return (
    <Stack gap="md" wrap>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="md" align="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Stack>
  );
}

function WithIconExample() {
  return (
    <Stack gap="md" align="center" wrap>
      <Button variant="primary"><Icon name="plus" /> Add Item</Button>
      <Button variant="secondary"><Icon name="download" /> Export</Button>
      <Button variant="secondary">Next <Icon name="arrow-right" /></Button>
      <Button variant="ghost"><Icon name="trash-2" /> Delete</Button>
    </Stack>
  );
}

function AnimationExample() {
  return (
    <Stack gap="md" wrap>
      <Button>Default Animation</Button>
      <Button animate={{ hover: { scale: 1.1, easing: 'poppy' }, press: { scale: 0.9, easing: 'snappy' } }}>
        Bouncy
      </Button>
      <Button animate={false}>No Animation</Button>
    </Stack>
  );
}

function PassThroughExample() {
  return (
    <MoveProvider pt={{ Button: { root: { style: { textTransform: 'uppercase' } } } }}>
      <Stack gap="md">
        <Button>Global Style Applied</Button>
        <Button pt={{ root: { style: { borderRadius: '9999px' } } }}>Instance Style</Button>
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
    code: `import { Button } from 'move';\n\n<Button>Click me</Button>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Pick the right tone for the action',
    component: <VariantsExample />,
    code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to spacious',
    component: <SizesExample />,
    code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
  },
  {
    id: 'with-icon',
    name: 'With Icon',
    description: 'Place icons before or after text for clear actions',
    component: <WithIconExample />,
    code: `<Button><Icon name="plus" /> Add Item</Button>
<Button><Icon name="download" /> Export</Button>
<Button>Next <Icon name="arrow-right" /></Button>
<Button><Icon name="trash-2" /> Delete</Button>`,
  },
  {
    id: 'animation',
    name: 'Animation',
    description: 'Hover and press come to life',
    component: <AnimationExample />,
    code: `<Button>Default Animation</Button>
<Button
  animate={{
    hover: { scale: 1.1, easing: 'poppy' },
    press: { scale: 0.9, easing: 'snappy' },
  }}
>
  Bouncy
</Button>
<Button animate={false}>No Animation</Button>`,
  },
  {
    id: 'passthrough',
    name: 'Custom Styling',
    description: 'Override styles globally or per instance',
    component: <PassThroughExample />,
    code: `<MoveProvider pt={{ Button: { root: { style: { textTransform: 'uppercase' } } } }}>
  <Button>Global Style Applied</Button>
  <Button pt={{ root: { style: { borderRadius: '9999px' } } }}>Instance Style</Button>
</MoveProvider>`,
  },
];

export function ButtonDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Button"
        description="The everyday click target — with variants, sizes, and animations baked in."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
