import { Menubar } from 'move';

export function MenubarDemo() {
  return (
    <div className="demo-section">
      <h3>Menubar</h3>
      <div className="demo-box">
        <Menubar.Root className="menubar-root">
          <Menubar.Menu>
            <Menubar.Trigger className="menubar-trigger">File</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content className="menubar-content" align="start" sideOffset={5}>
                <Menubar.Item className="menu-item">
                  New Tab <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+T</span>
                </Menubar.Item>
                <Menubar.Item className="menu-item">
                  New Window <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+N</span>
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
                  Undo <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+Z</span>
                </Menubar.Item>
                <Menubar.Item className="menu-item">
                  Redo <span style={{ marginLeft: 'auto', color: '#666' }}>Cmd+Shift+Z</span>
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
      </div>
    </div>
  );
}
