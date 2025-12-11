import { Label } from 'move';

export function LabelDemo() {
  return (
    <div className="demo-section">
      <h3>Label</h3>
      <div className="demo-box">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Label className="label-root" htmlFor="email">
            Email address
          </Label>
          <input id="email" className="demo-input" type="email" placeholder="you@example.com" style={{ width: 300 }} />
        </div>
      </div>
    </div>
  );
}
