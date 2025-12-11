import { Separator } from 'move';

export function SeparatorDemo() {
  return (
    <div className="demo-section">
      <h3>Separator</h3>
      <div className="demo-box">
        <div>
          <div style={{ color: '#fff', fontWeight: 500 }}>Radix Primitives</div>
          <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>An open-source UI component library.</div>
        </div>
        <Separator className="separator-root" />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 20 }}>
          <span style={{ color: '#ccc', fontSize: 14 }}>Blog</span>
          <Separator className="separator-root" orientation="vertical" decorative />
          <span style={{ color: '#ccc', fontSize: 14 }}>Docs</span>
          <Separator className="separator-root" orientation="vertical" decorative />
          <span style={{ color: '#ccc', fontSize: 14 }}>Source</span>
        </div>
      </div>
    </div>
  );
}
