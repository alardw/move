import { Button, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="plus" />
      <Icon name="minus" />
      <Icon name="check" />
      <Icon name="x" />
      <Icon name="settings" />
      <Icon name="user" />
      <Icon name="heart" />
      <Icon name="star" />
    </div>
  );
}

function SizesExample() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="star" size="xs" />
      <Icon name="star" size="sm" />
      <Icon name="star" size="md" />
      <Icon name="star" size="lg" />
      <Icon name="star" size="xl" />
      <Icon name="star" size={48} />
    </div>
  );
}

function ColorsExample() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="heart" size="lg" color="var(--move-error)" />
      <Icon name="check-circle" size="lg" color="var(--move-success)" />
      <Icon name="alert-triangle" size="lg" color="var(--move-warning)" />
      <Icon name="info" size="lg" color="var(--move-info)" />
      <Icon name="star" size="lg" color="var(--move-primary)" />
    </div>
  );
}

function WithButtonsExample() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>
        <Icon name="plus" /> Add
      </Button>
      <Button variant="secondary">
        <Icon name="sparkles" /> Generate
      </Button>
      <Button variant="danger">
        <Icon name="trash" /> Delete
      </Button>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Basic icon usage.',
    component: <DefaultExample />,
    code: `<Icon name="plus" />
<Icon name="check" />
<Icon name="settings" />
<Icon name="heart" />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Icons in different sizes.',
    component: <SizesExample />,
    code: `<Icon name="star" size="xs" />
<Icon name="star" size="sm" />
<Icon name="star" size="md" />
<Icon name="star" size="lg" />
<Icon name="star" size={48} />`,
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'Icons with custom colors.',
    component: <ColorsExample />,
    code: `<Icon name="heart" color="var(--move-error)" />
<Icon name="check-circle" color="var(--move-success)" />
<Icon name="alert-triangle" color="var(--move-warning)" />`,
  },
  {
    id: 'buttons',
    name: 'With Buttons',
    description: 'Icons inside buttons.',
    component: <WithButtonsExample />,
    code: `<Button>
  <Icon name="plus" /> Add
</Button>
<Button variant="secondary">
  <Icon name="sparkles" /> Generate
</Button>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function IconDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Icon"
        description="SVG icons from Lucide and Streamline icon sets."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
