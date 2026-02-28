import { Button, Icon, Heading, Text } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
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

const squareTokens = {
  '--move-button-radius': '0px',
} as React.CSSProperties;

const sharpTokens = {
  '--move-rounded-md': '0px',
} as React.CSSProperties;

function CustomizeExample() {
  return (
    <Stack direction="column" gap="lg">
      <Text size="sm" color="muted">Component token — only affects buttons:</Text>
      <Stack gap="md" wrap style={squareTokens}>
        <Button variant="primary" animate={{ hover: { rotate: -2, easing: 'poppy' }, press: { rotate: 2, scale: 0.95, easing: 'snappy' } }}>
          Square Primary
        </Button>
        <Button variant="secondary" animate={{ hover: { y: -2, easing: 'poppy' }, press: { y: 1, scale: 0.97, easing: 'snappy' } }}>
          Square Secondary
        </Button>
        <Button variant="ghost" animate={false}>
          Square Static
        </Button>
      </Stack>
      <Text size="sm" color="muted">Semantic token — affects all components using <code>--move-rounded-md</code>:</Text>
      <Stack gap="md" wrap style={sharpTokens}>
        <Button animate={{ hover: { scale: 1.1, easing: 'poppy' }, press: { scale: 0.85, easing: 'snappy' } }}>
          Bouncy
        </Button>
        <Button animate={false}>No Animation</Button>
      </Stack>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Pick the right tone for the action',
    component: <UsageExample />,
    code: `import { Button } from 'move';

<Button variant="primary">Primary</Button>
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
    id: 'customize',
    name: 'Customize',
    description: 'Override tokens and animations to match your brand',
    component: <CustomizeExample />,
    code: `{/* Component token — only affects buttons */}
<div style={{ '--move-button-radius': '0px' }}>
  <Button
    animate={{
      hover: { rotate: -2, easing: 'poppy' },
      press: { rotate: 2, scale: 0.95, easing: 'snappy' },
    }}
  >
    Square Primary
  </Button>
  <Button variant="secondary" animate={false}>
    Square Static
  </Button>
</div>

{/* Semantic token — affects all components using --move-rounded-md */}
<div style={{ '--move-rounded-md': '0px' }}>
  <Button
    animate={{
      hover: { scale: 1.1, easing: 'poppy' },
      press: { scale: 0.85, easing: 'snappy' },
    }}
  >
    Bouncy
  </Button>
  <Button animate={false}>No Animation</Button>
</div>`,
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

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Button"
        properties={[
          { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual style of the button.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the button.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the button is disabled.' },
          { name: 'animate', type: 'ElementAnimate | false', description: 'Animates Button (hover scale, press scale).' },
          { name: 'elevation', type: 'ElevationLevel', description: 'Applies a shadow to the button.' },
          { name: 'asChild', type: 'boolean', default: 'false', description: 'Merge props onto the child element instead of rendering a button.' },
          { name: 'type', type: 'string', default: "'button'", description: 'HTML button type attribute.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />

      <Heading level={3}>Style Tokens</Heading>
      <Text color="muted" size="sm">Override these CSS custom properties on a parent element or via <code>style</code> to restyle buttons without affecting other components.</Text>

      <DocPage.TokenSection
        title="Layout"
        tokens={[
          { name: '--move-button-height', default: 'var(--move-control-height-md)', description: 'Button height. Overridden by size prop.', color: false },
          { name: '--move-button-padding-x', default: 'var(--move-spacing-md)', description: 'Horizontal padding. Overridden by size prop.', color: false },
          { name: '--move-button-gap', default: 'var(--move-spacing-sm)', description: 'Gap between icon and text.', color: false },
          { name: '--move-button-radius', default: 'var(--move-rounded-md)', description: 'Border radius. Overridden by size prop.', color: false },
          { name: '--move-button-font-size', default: 'var(--move-size-sm)', description: 'Font size. Overridden by size prop.', color: false },
          { name: '--move-button-font-weight', default: 'var(--move-weight-medium)', description: 'Font weight.', color: false },
        ]}
      />

      <DocPage.TokenSection
        title="Primary"
        tokens={[
          { name: '--move-button-primary-bg', default: 'var(--move-primary)', description: 'Background color.' },
          { name: '--move-button-primary-bg-hover', default: 'var(--move-primary-hover)', description: 'Background color on hover.' },
          { name: '--move-button-primary-bg-active', default: 'var(--move-primary-active)', description: 'Background color on press.' },
          { name: '--move-button-primary-fg', default: 'var(--move-primary-fg)', description: 'Text and icon color.' },
        ]}
      />

      <DocPage.TokenSection
        title="Secondary"
        tokens={[
          { name: '--move-button-secondary-bg', default: 'var(--move-bg-muted)', description: 'Background color.' },
          { name: '--move-button-secondary-bg-hover', default: 'var(--move-bg-emphasis)', description: 'Background color on hover.' },
          { name: '--move-button-secondary-bg-active', default: 'var(--move-bg-muted)', description: 'Background color on press.' },
          { name: '--move-button-secondary-fg', default: 'var(--move-fg-base)', description: 'Text and icon color.' },
          { name: '--move-button-secondary-border', default: 'var(--move-border-base)', description: 'Border color.' },
        ]}
      />

      <DocPage.TokenSection
        title="Ghost"
        tokens={[
          { name: '--move-button-ghost-fg', default: 'var(--move-fg-base)', description: 'Text and icon color.' },
          { name: '--move-button-ghost-bg-hover', default: 'var(--move-bg-muted)', description: 'Background color on hover.' },
        ]}
      />

      <DocPage.TokenSection
        title="Danger"
        tokens={[
          { name: '--move-button-danger-bg', default: 'var(--move-error)', description: 'Background color.' },
          { name: '--move-button-danger-bg-hover', default: 'var(--move-error-hover)', description: 'Background color on hover.' },
          { name: '--move-button-danger-fg', default: 'var(--move-error-fg)', description: 'Text and icon color.' },
        ]}
      />
    </DocPage.Root>
  );
}
