import { ToggleGroup } from 'move';

export function ToggleGroupDemo() {
  return (
    <div className="demo-section">
      <h3>Toggle Group</h3>
      <div className="demo-box">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Single selection</p>
            <ToggleGroup.Root className="toggle-group-root" type="single" defaultValue="center">
              <ToggleGroup.Item className="toggle-group-item" value="left" aria-label="Left aligned">
                <AlignLeft />
              </ToggleGroup.Item>
              <ToggleGroup.Item className="toggle-group-item" value="center" aria-label="Center aligned">
                <AlignCenter />
              </ToggleGroup.Item>
              <ToggleGroup.Item className="toggle-group-item" value="right" aria-label="Right aligned">
                <AlignRight />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          <div>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Multiple selection</p>
            <ToggleGroup.Root className="toggle-group-root" type="multiple" defaultValue={['bold']}>
              <ToggleGroup.Item className="toggle-group-item" value="bold" aria-label="Bold">
                <Bold />
              </ToggleGroup.Item>
              <ToggleGroup.Item className="toggle-group-item" value="italic" aria-label="Italic">
                <Italic />
              </ToggleGroup.Item>
              <ToggleGroup.Item className="toggle-group-item" value="underline" aria-label="Underline">
                <Underline />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlignLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  );
}

function AlignCenter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="10" x2="6" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="18" y1="18" x2="6" y2="18" />
    </svg>
  );
}

function AlignRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="21" y1="10" x2="7" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="7" y2="18" />
    </svg>
  );
}

function Bold() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

function Italic() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function Underline() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}
