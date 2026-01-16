import { useState } from 'react';
import { DropdownMenu, Button, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" style={{ width: 200, justifyContent: 'space-between' }}>
          Options <Icon name="chevron-down" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu-content" sideOffset={5}>
          <DropdownMenu.Item className="menu-item">
            New Tab <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+T</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="menu-item">
            New Window <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>Cmd+N</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="menu-separator" />
          <DropdownMenu.Label className="menu-label">Settings</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem
            className="menu-item"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            Show Bookmarks
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            className="menu-item"
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            Show Full URLs
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function LongListExample() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" style={{ width: 200, justifyContent: 'space-between' }}>
          Long List <Icon name="chevron-down" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu-content" sideOffset={5}>
          {Array.from({ length: 20 }, (_, i) => (
            <DropdownMenu.Item key={i} className="menu-item">
              Item {i + 1}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Menu with items, checkboxes, and separators.',
    component: <DefaultExample />,
    code: `<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="secondary">
      Options <Icon name="chevron-down" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item>New Tab</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem checked={checked} onCheckedChange={setChecked}>
        Show Bookmarks
      </DropdownMenu.CheckboxItem>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>`,
  },
  {
    id: 'long',
    name: 'Long List',
    description: 'Scrollable menu with many items.',
    component: <LongListExample />,
    code: `<DropdownMenu.Content>
  {items.map((item, i) => (
    <DropdownMenu.Item key={i}>{item}</DropdownMenu.Item>
  ))}
</DropdownMenu.Content>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function DropdownMenuDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="DropdownMenu"
        description="A menu that appears when triggered by a button."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
