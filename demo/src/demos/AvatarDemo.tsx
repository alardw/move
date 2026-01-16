import { Avatar } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar.Root className="avatar-root">
        <Avatar.Image
          className="avatar-image"
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          alt="User"
        />
        <Avatar.Fallback className="avatar-fallback" delayMs={600}>
          JD
        </Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="avatar-root">
        <Avatar.Image
          className="avatar-image"
          src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=128&h=128&fit=crop"
          alt="User"
        />
        <Avatar.Fallback className="avatar-fallback" delayMs={600}>
          AB
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}

function FallbackExample() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar.Root className="avatar-root">
        <Avatar.Fallback className="avatar-fallback">MK</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="avatar-root">
        <Avatar.Fallback className="avatar-fallback">+3</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}

function GroupExample() {
  return (
    <Avatar.Group className="avatar-group">
      <Avatar.Root className="avatar-root">
        <Avatar.Fallback className="avatar-fallback">A</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="avatar-root">
        <Avatar.Fallback className="avatar-fallback">B</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root className="avatar-root">
        <Avatar.Fallback className="avatar-fallback">C</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Avatar with image and fallback.',
    component: <DefaultExample />,
    code: `<Avatar.Root>
  <Avatar.Image src="https://example.com/avatar.jpg" alt="User" />
  <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
</Avatar.Root>`,
  },
  {
    id: 'fallback',
    name: 'Fallback',
    description: 'Initials shown when no image is available.',
    component: <FallbackExample />,
    code: `<Avatar.Root>
  <Avatar.Fallback>MK</Avatar.Fallback>
</Avatar.Root>`,
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Stacked avatars for showing multiple users.',
    component: <GroupExample />,
    code: `<Avatar.Group>
  <Avatar.Root>
    <Avatar.Fallback>A</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>B</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Group>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function AvatarDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Avatar"
        description="An image element with a fallback for representing the user."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
