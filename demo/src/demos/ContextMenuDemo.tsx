import { ContextMenu } from 'move';

export function ContextMenuDemo() {
  return (
    <div className="demo-section">
      <h3>Context Menu</h3>
      <div className="demo-box">
        <ContextMenu.Root>
          <ContextMenu.Trigger className="context-trigger">
            Right click here
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className="menu-content">
              <ContextMenu.Item className="menu-item">
                Back <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+[</span>
              </ContextMenu.Item>
              <ContextMenu.Item className="menu-item" disabled>
                Forward <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+]</span>
              </ContextMenu.Item>
              <ContextMenu.Item className="menu-item">
                Reload <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+R</span>
              </ContextMenu.Item>
              <ContextMenu.Separator className="menu-separator" />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className="menu-sub-trigger">
                  More Tools
                  <ChevronRight />
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent className="menu-sub-content">
                    <ContextMenu.Item className="menu-item">Save Page As...</ContextMenu.Item>
                    <ContextMenu.Item className="menu-item">Create Shortcut...</ContextMenu.Item>
                    <ContextMenu.Item className="menu-item">Developer Tools</ContextMenu.Item>
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
              <ContextMenu.Separator className="menu-separator" />
              <ContextMenu.Item className="menu-item">View Source</ContextMenu.Item>
              <ContextMenu.Item className="menu-item">Inspect</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
