import { useState } from 'react';
import { Collapsible } from 'move';

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-section">
      <h3>Collapsible</h3>
      <div className="demo-box">
        <Collapsible.Root className="collapsible-root" open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className="collapsible-trigger">
            <span>@peduarte starred 3 repositories</span>
            <ChevronDown style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </Collapsible.Trigger>
          <Collapsible.Content className="collapsible-content">
            <div className="collapsible-content-inner">
              <div style={{ padding: '8px 0', borderBottom: '1px solid #252525' }}>radix-ui/primitives</div>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #252525' }}>radix-ui/colors</div>
              <div style={{ padding: '8px 0' }}>radix-ui/themes</div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
}

function ChevronDown({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
