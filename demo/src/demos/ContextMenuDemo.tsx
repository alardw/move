import { ContextMenu, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="context-trigger">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="menu-content">
          <ContextMenu.Item className="menu-item">
            Back <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+[</span>
          </ContextMenu.Item>
          <ContextMenu.Item className="menu-item" disabled>
            Forward <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+]</span>
          </ContextMenu.Item>
          <ContextMenu.Item className="menu-item">
            Reload <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+R</span>
          </ContextMenu.Item>
          <ContextMenu.Separator className="menu-separator" />
          <ContextMenu.Item className="menu-item">View Source</ContextMenu.Item>
          <ContextMenu.Item className="menu-item">Inspect</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function SubMenuExample() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="context-trigger">
        Right click for submenu
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="menu-content">
          <ContextMenu.Item className="menu-item">New Tab</ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="menu-sub-trigger">
              More Tools <Icon name="chevron-right" />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="menu-sub-content">
                <ContextMenu.Item className="menu-item">Save Page As...</ContextMenu.Item>
                <ContextMenu.Item className="menu-item">Developer Tools</ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Basic context menu with items.',
    component: <DefaultExample />,
    code: `<ContextMenu.Root>
  <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Back</ContextMenu.Item>
      <ContextMenu.Item>Forward</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item>Inspect</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>`,
  },
  {
    id: 'submenu',
    name: 'With Submenu',
    description: 'Nested menu for more options.',
    component: <SubMenuExample />,
    code: `<ContextMenu.Sub>
  <ContextMenu.SubTrigger>
    More Tools <Icon name="chevron-right" />
  </ContextMenu.SubTrigger>
  <ContextMenu.Portal>
    <ContextMenu.SubContent>
      <ContextMenu.Item>Save Page As...</ContextMenu.Item>
    </ContextMenu.SubContent>
  </ContextMenu.Portal>
</ContextMenu.Sub>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ContextMenuDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="ContextMenu"
        description="A menu activated on right-click or long-press."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
