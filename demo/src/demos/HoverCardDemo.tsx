import { HoverCard } from 'move';

export function HoverCardDemo() {
  return (
    <div className="demo-section">
      <h3>Hover Card</h3>
      <div className="demo-box">
        <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.8 }}>
          Hover over{' '}
          <HoverCard.Root>
            <HoverCard.Trigger className="hovercard-trigger">
              @radix_ui
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content className="hovercard-content" sideOffset={5}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <img
                    src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
                    alt="Radix UI"
                    style={{ width: 48, height: 48, borderRadius: 8 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Radix</div>
                    <div style={{ color: '#666', fontSize: 13 }}>@radix_ui</div>
                  </div>
                </div>
                <p style={{ color: '#888', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
                  Components, icons, and colors for building high-quality, accessible UI.
                </p>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
                  <span><strong style={{ color: '#fff' }}>0</strong> <span style={{ color: '#666' }}>Following</span></span>
                  <span><strong style={{ color: '#fff' }}>2,900</strong> <span style={{ color: '#666' }}>Followers</span></span>
                </div>
                <HoverCard.Arrow className="hovercard-arrow" />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
          {' '}to see their profile card.
        </p>
      </div>
    </div>
  );
}
