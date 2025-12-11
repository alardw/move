import { useState } from 'react';
import { DropdownMenu } from 'move';

export function DropdownMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);

  return (
    <div className="demo-section">
      <h3>Dropdown Menu</h3>
      <div className="demo-box">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="demo-button-outline">
              Options <ChevronDown />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="menu-content" sideOffset={5}>
              <DropdownMenu.Item className="menu-item">
                New Tab <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+T</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="menu-item">
                New Window <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+N</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="menu-item" disabled>
                New Private Window
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="menu-separator" />

              <DropdownMenu.CheckboxItem
                className="menu-checkbox-item"
                checked={bookmarksChecked}
                onCheckedChange={setBookmarksChecked}
              >
                <DropdownMenu.ItemIndicator className="menu-item-indicator">
                  <Check />
                </DropdownMenu.ItemIndicator>
                Show Bookmarks
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.CheckboxItem
                className="menu-checkbox-item"
                checked={urlsChecked}
                onCheckedChange={setUrlsChecked}
              >
                <DropdownMenu.ItemIndicator className="menu-item-indicator">
                  <Check />
                </DropdownMenu.ItemIndicator>
                Show Full URLs
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.Separator className="menu-separator" />
              <DropdownMenu.Label className="menu-label">People</DropdownMenu.Label>
              <DropdownMenu.Item className="menu-item">John Doe</DropdownMenu.Item>
              <DropdownMenu.Item className="menu-item">Jane Smith</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
