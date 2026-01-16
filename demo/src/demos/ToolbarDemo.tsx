import { Toolbar, Icon, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Toolbar.Root className="toolbar-root">
      <Toolbar.ToggleGroup className="toolbar-toggle-group" type="multiple">
        <Toolbar.ToggleItem className="toolbar-toggle-item" value="bold" aria-label="Bold">
          <Icon name="bold" />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem className="toolbar-toggle-item" value="italic" aria-label="Italic">
          <Icon name="italic" />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem className="toolbar-toggle-item" value="underline" aria-label="Underline">
          <Icon name="underline" />
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className="toolbar-separator" />
      <Toolbar.ToggleGroup className="toolbar-toggle-group" type="single" defaultValue="center">
        <Toolbar.ToggleItem className="toolbar-toggle-item" value="left" aria-label="Left aligned">
          <Icon name="align-left" />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem className="toolbar-toggle-item" value="center" aria-label="Center aligned">
          <Icon name="align-center" />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem className="toolbar-toggle-item" value="right" aria-label="Right aligned">
          <Icon name="align-right" />
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className="toolbar-separator" />
      <Toolbar.Link className="toolbar-link" href="#">
        Edited 2 hours ago
      </Toolbar.Link>
      <Toolbar.Button className="toolbar-button" asChild>
        <Button variant="secondary" size="sm">
          <Icon name="share" /> Share
        </Button>
      </Toolbar.Button>
    </Toolbar.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Toolbar with toggle groups, separator, and buttons.',
    component: <DefaultExample />,
    code: `<Toolbar.Root>
  <Toolbar.ToggleGroup type="multiple">
    <Toolbar.ToggleItem value="bold">
      <Icon name="bold" />
    </Toolbar.ToggleItem>
    <Toolbar.ToggleItem value="italic">
      <Icon name="italic" />
    </Toolbar.ToggleItem>
  </Toolbar.ToggleGroup>
  <Toolbar.Separator />
  <Toolbar.Button asChild>
    <Button variant="secondary">
      <Icon name="share" /> Share
    </Button>
  </Toolbar.Button>
</Toolbar.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ToolbarDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Toolbar"
        description="A container for grouping related controls."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
