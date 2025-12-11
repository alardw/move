import { Popover } from 'move';

export function PopoverDemo() {
  return (
    <div className="demo-section">
      <h3>Popover</h3>
      <div className="demo-box">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="demo-button-outline">Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="popover-content" sideOffset={5}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ margin: 0, fontWeight: 500, color: '#fff' }}>Dimensions</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ width: 60, fontSize: 13, color: '#888' }}>Width</label>
                  <input className="demo-input" defaultValue="100%" style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ width: 60, fontSize: 13, color: '#888' }}>Height</label>
                  <input className="demo-input" defaultValue="25px" style={{ flex: 1 }} />
                </div>
              </div>
              <Popover.Close className="popover-close">
                <X />
              </Popover.Close>
              <Popover.Arrow className="popover-arrow" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}

function X() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
