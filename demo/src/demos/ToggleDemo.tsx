import { Toggle } from 'move';

export function ToggleDemo() {
  return (
    <div className="demo-section">
      <h3>Toggle</h3>
      <div className="demo-box">
        <div style={{ display: 'flex', gap: 12 }}>
          <Toggle className="toggle-root" aria-label="Toggle italic">
            <Italic />
            Italic
          </Toggle>

          <Toggle className="toggle-root" aria-label="Toggle bold" defaultPressed>
            <Bold />
            Bold
          </Toggle>

          <Toggle className="toggle-root" aria-label="Toggle underline">
            <Underline />
            Underline
          </Toggle>
        </div>
      </div>
    </div>
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
