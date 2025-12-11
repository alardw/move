import { Toolbar } from 'move';

export function ToolbarDemo() {
  return (
    <div className="demo-section">
      <h3>Toolbar</h3>
      <div className="demo-box">
        <Toolbar.Root className="toolbar-root">
          <Toolbar.ToggleGroup className="toolbar-toggle-group" type="multiple">
            <Toolbar.ToggleItem className="toolbar-toggle-item" value="bold" aria-label="Bold">
              <Bold />
            </Toolbar.ToggleItem>
            <Toolbar.ToggleItem className="toolbar-toggle-item" value="italic" aria-label="Italic">
              <Italic />
            </Toolbar.ToggleItem>
            <Toolbar.ToggleItem className="toolbar-toggle-item" value="underline" aria-label="Underline">
              <Underline />
            </Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
          <Toolbar.Separator className="toolbar-separator" />
          <Toolbar.ToggleGroup className="toolbar-toggle-group" type="single" defaultValue="center">
            <Toolbar.ToggleItem className="toolbar-toggle-item" value="left" aria-label="Left aligned">
              <AlignLeft />
            </Toolbar.ToggleItem>
            <Toolbar.ToggleItem className="toolbar-toggle-item" value="center" aria-label="Center aligned">
              <AlignCenter />
            </Toolbar.ToggleItem>
            <Toolbar.ToggleItem className="toolbar-toggle-item" value="right" aria-label="Right aligned">
              <AlignRight />
            </Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
          <Toolbar.Separator className="toolbar-separator" />
          <Toolbar.Link className="toolbar-link" href="#">
            Edited 2 hours ago
          </Toolbar.Link>
          <Toolbar.Button className="toolbar-button">
            <Share /> Share
          </Toolbar.Button>
        </Toolbar.Root>
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

function Share() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
