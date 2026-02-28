import { Avatar, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

function UsageExample() {
  return (
    <Avatar.Root>
      <Avatar.Image
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
        alt="Jane Doe"
      />
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  );
}

function SizesExample() {
  return (
    <Avatar.Group>
      <Avatar.Root size="xs">
        <Avatar.Fallback>XS</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="sm">
        <Avatar.Fallback>SM</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="md">
        <Avatar.Fallback>MD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg">
        <Avatar.Fallback>LG</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Fallback>XL</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  );
}

function FallbackExample() {
  return (
    <Avatar.Group>
      <Avatar.Root>
        <Avatar.Image
          src="https://broken-link.example/no-image.jpg"
          alt="Missing"
        />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback>+3</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  );
}

function GroupExample() {
  return (
    <Avatar.Group>
      <Avatar.Root>
        <Avatar.Image
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          alt="User 1"
        />
        <Avatar.Fallback>A</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Image
          src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=128&h=128&fit=crop"
          alt="User 2"
        />
        <Avatar.Fallback>B</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback>C</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback>+2</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { Avatar } from 'move';

<Avatar.Root>
  <Avatar.Image src="https://example.com/photo.jpg" alt="Jane Doe" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to prominent',
    component: <SizesExample />,
    code: `<Avatar.Group>
  <Avatar.Root size="xs">
    <Avatar.Fallback>XS</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="sm">
    <Avatar.Fallback>SM</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="md">
    <Avatar.Fallback>MD</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="lg">
    <Avatar.Fallback>LG</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="xl">
    <Avatar.Fallback>XL</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Group>`,
  },
  {
    id: 'fallback',
    name: 'Fallback',
    description: 'Initials shown when no image is available',
    component: <FallbackExample />,
    code: `<Avatar.Group>
  <Avatar.Root>
    <Avatar.Image src="https://broken-link.example/no-image.jpg" alt="Missing" />
    <Avatar.Fallback>MK</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>AB</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>+3</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Group>`,
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Stack multiple avatars together',
    component: <GroupExample />,
    code: `<Avatar.Group>
  <Avatar.Root>
    <Avatar.Image src="https://example.com/user1.jpg" alt="User 1" />
    <Avatar.Fallback>A</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://example.com/user2.jpg" alt="User 2" />
    <Avatar.Fallback>B</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>+2</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Group>`,
  },
];

export function AvatarDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Avatar"
        description="A face for every user — image with graceful fallback."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Avatar.Root"
        properties={[
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the avatar.' },
          { name: 'animate', type: 'false', description: 'Set to false to disable the entrance animation.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Avatar.Image"
        properties={[
          { name: 'src', type: 'string', description: 'URL of the avatar image.' },
          { name: 'alt', type: 'string', description: 'Accessible alt text for the image.' },
          { name: 'onLoadingStatusChange', type: "(status: 'idle' | 'loading' | 'loaded' | 'error') => void", description: 'Called when the image loading status changes.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the image element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Avatar.Fallback"
        properties={[
          { name: 'delayMs', type: 'number', description: 'Milliseconds to wait before showing the fallback, giving the image time to load.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the fallback element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Avatar.Group"
        properties={[
          { name: 'staggerDelay', type: 'number', default: '50', description: 'Delay in milliseconds between each avatar entrance animation.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the group element.' },
        ]}
      />
    </DocPage.Root>
  );
}
