import { Menubar } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Menubar.Root className="menubar-root">
      <Menubar.Menu>
        <Menubar.Trigger className="menubar-trigger">File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="menubar-content" align="start" sideOffset={5}>
            <Menubar.Item className="menu-item">
              New Tab <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+T</span>
            </Menubar.Item>
            <Menubar.Item className="menu-item">
              New Window <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+N</span>
            </Menubar.Item>
            <Menubar.Separator className="menu-separator" />
            <Menubar.Item className="menu-item">Share</Menubar.Item>
            <Menubar.Separator className="menu-separator" />
            <Menubar.Item className="menu-item">Print</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="menubar-trigger">Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="menubar-content" align="start" sideOffset={5}>
            <Menubar.Item className="menu-item">
              Undo <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+Z</span>
            </Menubar.Item>
            <Menubar.Item className="menu-item">
              Redo <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+Shift+Z</span>
            </Menubar.Item>
            <Menubar.Separator className="menu-separator" />
            <Menubar.Item className="menu-item">Cut</Menubar.Item>
            <Menubar.Item className="menu-item">Copy</Menubar.Item>
            <Menubar.Item className="menu-item">Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="menubar-trigger">View</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="menubar-content" align="start" sideOffset={5}>
            <Menubar.Item className="menu-item">Zoom In</Menubar.Item>
            <Menubar.Item className="menu-item">Zoom Out</Menubar.Item>
            <Menubar.Separator className="menu-separator" />
            <Menubar.Item className="menu-item">Full Screen</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Application menubar with File, Edit, View menus.',
    component: <DefaultExample />,
    code: `<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>New Tab</Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item>Print</Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function MenubarDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Menubar"
        description="A horizontal menu bar typically used for application navigation."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
