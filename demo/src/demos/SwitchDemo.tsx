import { Switch } from 'move';

export function SwitchDemo() {
  return (
    <div className="demo-section">
      <h3>Switch</h3>
      <div className="demo-box">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="switch-label">
            <Switch.Root className="switch-root" defaultChecked>
              <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
            <span>Airplane Mode</span>
          </label>

          <label className="switch-label">
            <Switch.Root className="switch-root">
              <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
            <span>Dark Mode</span>
          </label>

          <label className="switch-label">
            <Switch.Root className="switch-root" disabled>
              <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
            <span style={{ opacity: 0.5 }}>Disabled</span>
          </label>
        </div>
      </div>
    </div>
  );
}
