import { useState } from 'react';
import { Skeleton, Button, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <Skeleton.Root>
      <Stack gap="md" align="center">
        <Skeleton.Circle />
        <Stack direction="column" gap="sm" flex={1}>
          <Skeleton.Rounded width="40%" height="0.875rem" />
          <Skeleton.Text lines={2} />
        </Stack>
      </Stack>
    </Skeleton.Root>
  );
}

function ShapesExample() {
  return (
    <Skeleton.Root>
      <Stack direction="column" gap="lg">
        <Stack gap="md" align="center">
          <Skeleton.Circle size={48} />
          <Skeleton.Circle size={32} />
          <Skeleton.Circle size={24} />
        </Stack>
        <Skeleton.Rectangle width="100%" height="1.5rem" />
        <Skeleton.Rounded width="200px" height="2.5rem" />
        <Skeleton.Rounded width="120px" height="2rem" radius="var(--move-rounded-full)" />
      </Stack>
    </Skeleton.Root>
  );
}

function TextExample() {
  return (
    <Skeleton.Root>
      <Stack direction="column" gap="xl">
        <Stack direction="column" gap="sm">
          <Skeleton.Rounded width="30%" height="1rem" />
          <Skeleton.Text lines={3} />
        </Stack>
        <Stack direction="column" gap="sm">
          <Skeleton.Rounded width="50%" height="1rem" />
          <Skeleton.Text lines={5} lastLineWidth="40%" />
        </Stack>
      </Stack>
    </Skeleton.Root>
  );
}

function CardSkeletonExample() {
  return (
    <Skeleton.Root>
      <div style={{
        padding: 'var(--move-spacing-lg)',
        border: '1px solid var(--move-border-base)',
        borderRadius: 'var(--move-rounded-lg)',
        maxWidth: '24rem',
      }}>
        <Skeleton.Rectangle width="100%" height="160px" />
        <div style={{ marginTop: 'var(--move-spacing-md)' }}>
          <Stack gap="md" align="center">
            <Skeleton.Circle size={40} />
            <Stack direction="column" gap="sm" flex={1}>
              <Skeleton.Rounded width="60%" height="0.875rem" />
              <Skeleton.Rounded width="40%" height="0.75rem" />
            </Stack>
          </Stack>
        </div>
        <div style={{ marginTop: 'var(--move-spacing-md)' }}>
          <Skeleton.Text lines={3} />
        </div>
      </div>
    </Skeleton.Root>
  );
}

function LoadingToggleExample() {
  const [loading, setLoading] = useState(true);

  return (
    <Stack direction="column" gap="md">
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLoading(!loading)}
        >
          {loading ? 'Show Content' : 'Show Skeleton'}
        </Button>
      </div>
      {loading ? (
        <Skeleton.Root loading={loading}>
          <Stack gap="md" align="center">
            <Skeleton.Circle size={40} />
            <Stack direction="column" gap="sm" flex={1}>
              <Skeleton.Rounded width="30%" height="0.875rem" />
              <Skeleton.Text lines={2} />
            </Stack>
          </Stack>
        </Skeleton.Root>
      ) : (
        <Stack gap="md" align="center">
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'var(--move-primary)',
          }} />
          <div>
            <div style={{ fontWeight: 600 }}>Jane Doe</div>
            <div style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
              Software Engineer at Acme Corp
            </div>
          </div>
        </Stack>
      )}
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider
      pt={{
        SkeletonCircle: {
          circle: {
            style: { backgroundColor: 'var(--move-primary)', opacity: 0.2 },
          },
        },
        SkeletonText: {
          line: {
            style: { backgroundColor: 'var(--move-primary)', opacity: 0.2 },
          },
        },
        SkeletonRounded: {
          rounded: {
            style: { backgroundColor: 'var(--move-primary)', opacity: 0.2 },
          },
        },
      }}
    >
      <Skeleton.Root>
        <Stack gap="md" align="center">
          <Skeleton.Circle size={48} />
          <Stack direction="column" gap="sm" flex={1}>
            <Skeleton.Rounded width="50%" height="0.875rem" />
            <Skeleton.Text lines={2} />
          </Stack>
        </Stack>
      </Skeleton.Root>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A common skeleton layout with avatar and text lines.',
    component: <UsageExample />,
    code: `import { Skeleton } from 'move';

<Skeleton.Root>
  <Skeleton.Circle />
  <Skeleton.Rounded width="40%" height="0.875rem" />
  <Skeleton.Text lines={2} />
</Skeleton.Root>`,
  },
  {
    id: 'shapes',
    name: 'Shapes',
    description: 'Circles, rectangles, and rounded blocks in different sizes.',
    component: <ShapesExample />,
    code: `<Skeleton.Root>
  <Skeleton.Circle size={48} />
  <Skeleton.Circle size={32} />
  <Skeleton.Rectangle width="100%" height="1.5rem" />
  <Skeleton.Rounded width="200px" height="2.5rem" />
  <Skeleton.Rounded width="120px" height="2rem" radius="var(--move-rounded-full)" />
</Skeleton.Root>`,
  },
  {
    id: 'text',
    name: 'Text Blocks',
    description: 'Multi-line text placeholders with a shorter last line.',
    component: <TextExample />,
    code: `<Skeleton.Root>
  <Skeleton.Text lines={3} />
  <Skeleton.Text lines={5} lastLineWidth="40%" />
</Skeleton.Root>`,
  },
  {
    id: 'card',
    name: 'Card Skeleton',
    description: 'Compose shapes into a realistic card placeholder.',
    component: <CardSkeletonExample />,
    code: `<Skeleton.Root>
  <Skeleton.Rectangle width="100%" height="160px" />
  <Skeleton.Circle size={40} />
  <Skeleton.Rounded width="60%" height="0.875rem" />
  <Skeleton.Rounded width="40%" height="0.75rem" />
  <Skeleton.Text lines={3} />
</Skeleton.Root>`,
  },
  {
    id: 'loading-toggle',
    name: 'Loading Toggle',
    description: 'Switch between the skeleton and real content.',
    component: <LoadingToggleExample />,
    code: `import { useState } from 'react';
import { Skeleton, Button } from 'move';

const [loading, setLoading] = useState(true);

<Button onClick={() => setLoading(!loading)}>
  {loading ? 'Show Content' : 'Show Skeleton'}
</Button>

<Skeleton.Root loading={loading}>
  <Skeleton.Circle size={40} />
  <Skeleton.Text lines={2} />
</Skeleton.Root>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Override colors globally or per instance.',
    component: <CustomStylingExample />,
    code: `import { MoveProvider, Skeleton } from 'move';

<MoveProvider
  pt={{
    SkeletonCircle: {
      circle: {
        style: { backgroundColor: 'var(--move-primary)', opacity: 0.2 },
      },
    },
    SkeletonText: {
      line: {
        style: { backgroundColor: 'var(--move-primary)', opacity: 0.2 },
      },
    },
  }}
>
  <Skeleton.Root>
    <Skeleton.Circle size={48} />
    <Skeleton.Text lines={2} />
  </Skeleton.Root>
</MoveProvider>`,
  },
];

export function SkeletonDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Skeleton"
        description="Placeholder shapes that hint at upcoming content while it loads."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
