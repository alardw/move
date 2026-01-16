import { HoverCard } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
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
                <div style={{ color: '#9ca3af', fontSize: 13 }}>@radix_ui</div>
              </div>
            </div>
            <p style={{ marginTop: 12, lineHeight: 1.5 }}>
              Components, icons, and colors for building high-quality, accessible UI.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
              <span><strong style={{ color: '#fff' }}>0</strong> <span style={{ color: '#9ca3af' }}>Following</span></span>
              <span><strong style={{ color: '#fff' }}>2,900</strong> <span style={{ color: '#9ca3af' }}>Followers</span></span>
            </div>
            <HoverCard.Arrow className="hovercard-arrow" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
      {' '}to see their profile card.
    </p>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Shows a profile card on hover.',
    component: <DefaultExample />,
    code: `<HoverCard.Root>
  <HoverCard.Trigger>@radix_ui</HoverCard.Trigger>
  <HoverCard.Portal>
    <HoverCard.Content sideOffset={5}>
      <div>Profile info...</div>
      <HoverCard.Arrow />
    </HoverCard.Content>
  </HoverCard.Portal>
</HoverCard.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function HoverCardDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="HoverCard"
        description="A card that appears when hovering over a trigger element."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
