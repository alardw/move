import { Avatar, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

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

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      AvatarRoot: { root: { style: { borderRadius: '8px' } } },
      AvatarFallback: { fallback: { style: { background: 'var(--move-primary)', color: 'var(--move-primary-fg)' } } },
    }}>
      <Stack gap="md" align="center">
        <Avatar.Root>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root pt={{ root: { style: { border: '2px solid var(--move-primary)' } } }}>
          <Avatar.Image
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
            alt="Styled"
          />
          <Avatar.Fallback>CD</Avatar.Fallback>
        </Avatar.Root>
      </Stack>
    </MoveProvider>
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
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Restyle avatars globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  AvatarRoot: { root: { style: { borderRadius: '8px' } } },
  AvatarFallback: { fallback: { style: { background: 'var(--move-primary)', color: 'var(--move-primary-fg)' } } },
}}>
  <Avatar.Root>
    <Avatar.Fallback>AB</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root pt={{ root: { style: { border: '2px solid var(--move-primary)' } } }}>
    <Avatar.Image src="https://example.com/photo.jpg" alt="Styled" />
    <Avatar.Fallback>CD</Avatar.Fallback>
  </Avatar.Root>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
