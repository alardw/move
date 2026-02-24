import { Card, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// ============================================================================
// Usage
// ============================================================================

function UsageExample() {
  return (
    <Card.Root style={{ maxWidth: 400 }}>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>A short description of the card content.</Card.Description>
      </Card.Header>
      <Card.Body>
        <p style={{ margin: 0, color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          Cards group related content and actions together. Use header, body, and footer to structure the layout.
        </p>
      </Card.Body>
      <Card.Footer>
        <Card.FooterEnd>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Save</Button>
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}

// ============================================================================
// Variants
// ============================================================================

function VariantsExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-lg)' }}>
      <Card.Root variant="default" style={{ maxWidth: 400 }}>
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>Bordered card with subtle background.</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root variant="elevated" style={{ maxWidth: 400 }}>
        <Card.Header>
          <Card.Title>Elevated</Card.Title>
          <Card.Description>Raised with a shadow, no border.</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root variant="ghost" style={{ maxWidth: 400 }}>
        <Card.Header>
          <Card.Title>Ghost</Card.Title>
          <Card.Description>No border, no background.</Card.Description>
        </Card.Header>
      </Card.Root>
    </div>
  );
}

// ============================================================================
// With Actions
// ============================================================================

function ActionsExample() {
  return (
    <Card.Root style={{ maxWidth: 400 }}>
      <Card.Header>
        <Card.Title>Delete Account</Card.Title>
        <Card.Description>
          Permanently remove your account and all associated data. This action cannot be undone.
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Card.FooterStart>
          <Button variant="ghost" size="sm">Learn more</Button>
        </Card.FooterStart>
        <Card.FooterEnd>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button variant="danger" size="sm">Delete</Button>
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}

// ============================================================================
// Examples
// ============================================================================

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A structured container with header, body, and footer',
    component: <UsageExample />,
    code: `import { Card, Button } from 'move';

<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>A short description of the card content.</Card.Description>
  </Card.Header>
  <Card.Body>
    <p>Cards group related content and actions together.</p>
  </Card.Body>
  <Card.Footer>
    <Card.FooterEnd>
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button size="sm">Save</Button>
    </Card.FooterEnd>
  </Card.Footer>
</Card.Root>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Bordered, elevated, or invisible',
    component: <VariantsExample />,
    code: `<Card.Root variant="default">
  <Card.Header>
    <Card.Title>Default</Card.Title>
    <Card.Description>Bordered card with subtle background.</Card.Description>
  </Card.Header>
</Card.Root>

<Card.Root variant="elevated">
  <Card.Header>
    <Card.Title>Elevated</Card.Title>
    <Card.Description>Raised with a shadow, no border.</Card.Description>
  </Card.Header>
</Card.Root>

<Card.Root variant="ghost">
  <Card.Header>
    <Card.Title>Ghost</Card.Title>
    <Card.Description>No border, no background.</Card.Description>
  </Card.Header>
</Card.Root>`,
  },
  {
    id: 'actions',
    name: 'Footer Actions',
    description: 'Split footer with actions on both sides',
    component: <ActionsExample />,
    code: `<Card.Root>
  <Card.Header>
    <Card.Title>Delete Account</Card.Title>
    <Card.Description>
      Permanently remove your account and all associated data.
    </Card.Description>
  </Card.Header>
  <Card.Footer>
    <Card.FooterStart>
      <Button variant="ghost" size="sm">Learn more</Button>
    </Card.FooterStart>
    <Card.FooterEnd>
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button variant="danger" size="sm">Delete</Button>
    </Card.FooterEnd>
  </Card.Footer>
</Card.Root>`,
  },
];

export function CardDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Card"
        description="Structured container for grouping related content and actions."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Card.Root"
        properties={[
          { name: 'variant', type: "'default' | 'elevated' | 'ghost'", default: "'default'", description: 'Visual style of the card.' },
        ]}
      />
    </DocPage.Root>
  );
}
