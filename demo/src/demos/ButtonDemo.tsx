import { Button, Icon, springs, easings, type SpringPreset, type Easing } from 'move';
import { DocPage, type Example } from '../components/DocPage';

const springPresetNames = Object.keys(springs) as SpringPreset[];

// =============================================================================
// Example Components
// =============================================================================

function VariantsExample() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}

function SizesExample() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

function IconsExample() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button>
        <Icon name="stream" /> Stream
      </Button>
      <Button variant="secondary">
        <Icon name="bluetooth" /> Connect
      </Button>
      <Button variant="danger">
        Next <Icon name="chevron-right" />
      </Button>
    </div>
  );
}

function AnimationsExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--move-fg-muted)' }}>Springs</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {springPresetNames.map((name) => (
            <Button key={name} animation={name} style={{ minWidth: 80 }}>
              {name}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--move-fg-muted)' }}>Curves</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {easings.slice(0, 8).map((ease) => (
            <Button key={ease} variant="secondary" animation={ease as Easing} style={{ minWidth: 90 }}>
              {ease}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'variants',
    name: 'Variants',
    description: 'Primary, secondary, ghost, and danger styles.',
    component: <VariantsExample />,
    code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Small, medium, and large button sizes.',
    component: <SizesExample />,
    code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
  },
  {
    id: 'icons',
    name: 'With Icons',
    description: 'Buttons with leading or trailing icons.',
    component: <IconsExample />,
    code: `<Button>
  <Icon name="stream" /> Stream
</Button>
<Button variant="secondary">
  <Icon name="bluetooth" /> Connect
</Button>`,
  },
  {
    id: 'animations',
    name: 'Animations',
    description: 'Spring and curve animation presets for hover/press.',
    component: <AnimationsExample />,
    code: `// Spring animation (default: snappy)
<Button animation="poppy">Poppy</Button>
<Button animation="gentle">Gentle</Button>

// Curve animation
<Button animation="outQuart">outQuart</Button>

// Disable animation
<Button animation="none">No animation</Button>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ButtonDemo() {
  return (
    <DocPage.Root defaultExample="variants">
      <DocPage.Header
        title="Button"
        description="Interactive button with spring and curve animation presets."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
