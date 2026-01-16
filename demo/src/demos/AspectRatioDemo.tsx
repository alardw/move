import { AspectRatio } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function Ratio16x9Example() {
  return (
    <div style={{ width: 300 }}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600"
          alt="Landscape"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      </AspectRatio>
    </div>
  );
}

function Ratio1x1Example() {
  return (
    <div style={{ width: 200 }}>
      <AspectRatio ratio={1}>
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=400"
          alt="Square"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      </AspectRatio>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: '16x9',
    name: '16:9',
    description: 'Widescreen video aspect ratio.',
    component: <Ratio16x9Example />,
    code: `<AspectRatio ratio={16 / 9}>
  <img
    src="https://example.com/image.jpg"
    alt="Landscape"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</AspectRatio>`,
  },
  {
    id: '1x1',
    name: '1:1',
    description: 'Square aspect ratio for avatars or thumbnails.',
    component: <Ratio1x1Example />,
    code: `<AspectRatio ratio={1}>
  <img
    src="https://example.com/image.jpg"
    alt="Square"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</AspectRatio>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function AspectRatioDemo() {
  return (
    <DocPage.Root defaultExample="16x9">
      <DocPage.Header
        title="AspectRatio"
        description="Displays content within a desired ratio."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
