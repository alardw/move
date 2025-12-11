import { ScrollArea } from 'move';

const TAGS = Array.from({ length: 50 }).map((_, i) => `Tag ${i + 1}`);

export function ScrollAreaDemo() {
  return (
    <div className="demo-section">
      <h3>Scroll Area</h3>
      <div className="demo-box">
        <ScrollArea.Root className="scrollarea-root">
          <ScrollArea.Viewport className="scrollarea-viewport">
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 500, color: '#fff', marginBottom: 12 }}>Tags</div>
              {TAGS.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #252525',
                    color: '#888',
                    fontSize: 14,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="scrollarea-scrollbar" orientation="vertical">
            <ScrollArea.Thumb className="scrollarea-thumb" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}
