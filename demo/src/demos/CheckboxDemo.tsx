import { Checkbox } from 'move';

export function CheckboxDemo() {
  return (
    <div className="demo-section">
      <h3>Checkboxes</h3>
      <div className="demo-box">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="checkbox-label">
            <Checkbox.Root className="checkbox-root" defaultChecked>
              <Checkbox.Indicator className="checkbox-indicator">
                <Check />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span>Accept terms and conditions</span>
          </label>

          <label className="checkbox-label">
            <Checkbox.Root className="checkbox-root">
              <Checkbox.Indicator className="checkbox-indicator">
                <Check />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span>Subscribe to newsletter</span>
          </label>

          <label className="checkbox-label">
            <Checkbox.Root className="checkbox-root" disabled>
              <Checkbox.Indicator className="checkbox-indicator">
                <Check />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span style={{ opacity: 0.5 }}>Disabled option</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
