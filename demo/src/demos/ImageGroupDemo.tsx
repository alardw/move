import { Image, ImageGroup, Heading, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

const PHOTOS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop',
];

function UsageExample() {
  return (
    <ImageGroup columns={3} gap="md">
      {PHOTOS.map((src, i) => (
        <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="4/3" width="100%" radius="md" />
      ))}
    </ImageGroup>
  );
}

function ColumnsExample() {
  return (
    <Stack direction="column" gap="lg">
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>2 columns</p>
        <ImageGroup columns={2} gap="sm">
          {PHOTOS.slice(0, 4).map((src, i) => (
            <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="16/9" width="100%" radius="md" />
          ))}
        </ImageGroup>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>4 columns</p>
        <ImageGroup columns={4} gap="sm">
          {PHOTOS.slice(0, 4).map((src, i) => (
            <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="1/1" width="100%" radius="md" />
          ))}
        </ImageGroup>
      </div>
    </Stack>
  );
}

function GapExample() {
  return (
    <Stack direction="column" gap="lg">
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>Tight (xs)</p>
        <ImageGroup columns={3} gap="xs">
          {PHOTOS.slice(0, 3).map((src, i) => (
            <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="1/1" width="100%" radius="sm" />
          ))}
        </ImageGroup>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>Spacious (xl)</p>
        <ImageGroup columns={3} gap="xl">
          {PHOTOS.slice(0, 3).map((src, i) => (
            <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="1/1" width="100%" radius="lg" />
          ))}
        </ImageGroup>
      </div>
    </Stack>
  );
}

function ResponsiveExample() {
  return (
    <Stack direction="column" gap="lg">
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>Resize the container to see the grid adapt</p>
        <div style={{ maxWidth: 600, border: '1px dashed var(--move-border-base)', borderRadius: 'var(--move-rounded-md)', padding: 'var(--move-spacing-sm)', resize: 'horizontal', overflow: 'auto' }}>
          <ImageGroup columns={4} gap="sm">
            {PHOTOS.slice(0, 4).map((src, i) => (
              <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="1/1" width="100%" radius="md" />
            ))}
          </ImageGroup>
        </div>
      </div>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider slotProps={{ ImageGroup: { root: { style: { padding: 'var(--move-spacing-md)', backgroundColor: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-lg)' } } } }}>
      <ImageGroup columns={3} gap="md">
        {PHOTOS.slice(0, 3).map((src, i) => (
          <Image key={i} src={src} alt={`Photo ${i + 1}`} aspectRatio="4/3" width="100%" radius="md" />
        ))}
      </ImageGroup>
    </MoveProvider>
  );
}

function RadiusExample() {
  return (
    <Stack gap="lg" style={{ width: '100%' }}>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>none</p>
        <ImageGroup columns={3} radius="none">
          <Image src={PHOTOS[0]} alt="Sample" aspectRatio="1/1" width="100%" />
          <Image src={PHOTOS[1]} alt="Sample" aspectRatio="1/1" width="100%" />
          <Image src={PHOTOS[2]} alt="Sample" aspectRatio="1/1" width="100%" />
        </ImageGroup>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>md</p>
        <ImageGroup columns={3} radius="md">
          <Image src={PHOTOS[0]} alt="Sample" aspectRatio="1/1" width="100%" />
          <Image src={PHOTOS[1]} alt="Sample" aspectRatio="1/1" width="100%" />
          <Image src={PHOTOS[2]} alt="Sample" aspectRatio="1/1" width="100%" />
        </ImageGroup>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>full</p>
        <ImageGroup columns={3} radius="full">
          <Image src={PHOTOS[0]} alt="Sample" aspectRatio="1/1" width="100%" />
          <Image src={PHOTOS[1]} alt="Sample" aspectRatio="1/1" width="100%" />
          <Image src={PHOTOS[2]} alt="Sample" aspectRatio="1/1" width="100%" />
        </ImageGroup>
      </div>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { Image, ImageGroup } from 'move';

<ImageGroup columns={3} gap="md">
  <Image src="photo1.jpg" alt="Photo 1" aspectRatio="4/3" width="100%" radius="md" />
  <Image src="photo2.jpg" alt="Photo 2" aspectRatio="4/3" width="100%" radius="md" />
  <Image src="photo3.jpg" alt="Photo 3" aspectRatio="4/3" width="100%" radius="md" />
</ImageGroup>`,
  },
  {
    id: 'columns',
    name: 'Columns',
    description: 'Pick the right number for your layout',
    component: <ColumnsExample />,
    code: `<ImageGroup columns={2} gap="sm">
  <Image src="..." alt="Photo 1" aspectRatio="16/9" width="100%" radius="md" />
  <Image src="..." alt="Photo 2" aspectRatio="16/9" width="100%" radius="md" />
</ImageGroup>

<ImageGroup columns={4} gap="sm">
  <Image src="..." alt="Photo 1" aspectRatio="1/1" width="100%" radius="md" />
  <Image src="..." alt="Photo 2" aspectRatio="1/1" width="100%" radius="md" />
  <Image src="..." alt="Photo 3" aspectRatio="1/1" width="100%" radius="md" />
  <Image src="..." alt="Photo 4" aspectRatio="1/1" width="100%" radius="md" />
</ImageGroup>`,
  },
  {
    id: 'gap',
    name: 'Gap',
    description: 'From tight to spacious',
    component: <GapExample />,
    code: `<ImageGroup columns={3} gap="xs">
  <Image src="..." alt="Photo" aspectRatio="1/1" width="100%" radius="sm" />
  <Image src="..." alt="Photo" aspectRatio="1/1" width="100%" radius="sm" />
  <Image src="..." alt="Photo" aspectRatio="1/1" width="100%" radius="sm" />
</ImageGroup>

<ImageGroup columns={3} gap="xl">
  <Image src="..." alt="Photo" aspectRatio="1/1" width="100%" radius="lg" />
  <Image src="..." alt="Photo" aspectRatio="1/1" width="100%" radius="lg" />
  <Image src="..." alt="Photo" aspectRatio="1/1" width="100%" radius="lg" />
</ImageGroup>`,
  },
  {
    id: 'responsive',
    name: 'Responsive',
    description: 'Adapts to the container, not the viewport',
    component: <ResponsiveExample />,
    code: `{/* Columns automatically reduce when the container gets narrow */}
<ImageGroup columns={4} gap="sm">
  <Image src="photo1.jpg" alt="Photo 1" aspectRatio="1/1" width="100%" radius="md" />
  <Image src="photo2.jpg" alt="Photo 2" aspectRatio="1/1" width="100%" radius="md" />
  <Image src="photo3.jpg" alt="Photo 3" aspectRatio="1/1" width="100%" radius="md" />
  <Image src="photo4.jpg" alt="Photo 4" aspectRatio="1/1" width="100%" radius="md" />
</ImageGroup>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider slotProps={{ ImageGroup: { root: { style: { padding: 'var(--move-spacing-md)', backgroundColor: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-lg)' } } } }}>
  <ImageGroup columns={3} gap="md">
    <Image src="..." alt="Photo 1" aspectRatio="4/3" width="100%" radius="md" />
    <Image src="..." alt="Photo 2" aspectRatio="4/3" width="100%" radius="md" />
    <Image src="..." alt="Photo 3" aspectRatio="4/3" width="100%" radius="md" />
  </ImageGroup>
</MoveProvider>`,
  },
  {
    id: 'radius',
    name: 'Radius',
    description: 'Uniform border radius on all child images',
    component: <RadiusExample />,
    code: `<ImageGroup columns={3} radius="none">...</ImageGroup>
<ImageGroup columns={3} radius="md">...</ImageGroup>
<ImageGroup columns={3} radius="full">...</ImageGroup>`,
  },
];

export function ImageGroupDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ImageGroup"
        description="A simple grid to arrange multiple images side by side."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ImageGroup"
        properties={[
          { name: 'columns', type: 'number', default: '3', description: 'Number of grid columns. Automatically reduces on smaller containers.' },
          { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Spacing between images.' },
          { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", description: 'Border radius applied to all child images.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for the root element.' },
        ]}
      />
    </DocPage.Root>
  );
}
