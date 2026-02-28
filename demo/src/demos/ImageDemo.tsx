import { Image, Button, Heading, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

const SAMPLE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop';
const SAMPLE_PORTRAIT = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop';
const BROKEN = 'https://broken-link.invalid/image.jpg';
const FALLBACK = 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=400&fit=crop';

function UsageExample() {
  return (
    <Image
      src={SAMPLE}
      alt="Mountain landscape"
      width={400}
      height={260}
      radius="md"
    />
  );
}

function RadiusExample() {
  return (
    <Stack gap="md" wrap>
      <Image src={SAMPLE} alt="None" width={120} height={120} radius="none" />
      <Image src={SAMPLE} alt="Small" width={120} height={120} radius="sm" />
      <Image src={SAMPLE} alt="Medium" width={120} height={120} radius="md" />
      <Image src={SAMPLE} alt="Large" width={120} height={120} radius="lg" />
      <Image src={SAMPLE} alt="Full" width={120} height={120} radius="full" />
    </Stack>
  );
}

function FitExample() {
  return (
    <Stack gap="md" wrap>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>cover</p>
        <Image src={SAMPLE_PORTRAIT} alt="Cover" width={160} height={120} fit="cover" radius="md" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>contain</p>
        <Image src={SAMPLE_PORTRAIT} alt="Contain" width={160} height={120} fit="contain" radius="md" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>scale-down</p>
        <Image src={SAMPLE_PORTRAIT} alt="Scale down" width={160} height={120} fit="scale-down" radius="md" />
      </div>
    </Stack>
  );
}

function AspectRatioExample() {
  return (
    <Stack gap="md" wrap>
      <div style={{ width: 200 }}>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>1 / 1</p>
        <Image src={SAMPLE} alt="Square" width="100%" aspectRatio="1/1" radius="md" />
      </div>
      <div style={{ width: 200 }}>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>16 / 9</p>
        <Image src={SAMPLE} alt="Widescreen" width="100%" aspectRatio="16/9" radius="md" />
      </div>
      <div style={{ width: 200 }}>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>4 / 3</p>
        <Image src={SAMPLE} alt="Classic" width="100%" aspectRatio="4/3" radius="md" />
      </div>
    </Stack>
  );
}

function FallbackExample() {
  return (
    <Stack gap="md" wrap>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>Fallback image</p>
        <Image src={BROKEN} fallbackSrc={FALLBACK} alt="With fallback" width={200} height={140} radius="md" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>Default fallback</p>
        <Image src={BROKEN} alt="Broken" width={200} height={140} radius="md" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>Custom fallback</p>
        <Image src={BROKEN} alt="Custom" width={200} height={140} radius="md">
          <span style={{ fontSize: 'var(--move-size-sm)' }}>No image available</span>
        </Image>
      </div>
    </Stack>
  );
}

function ActionExample() {
  return (
    <Stack gap="md" wrap>
      <Image
        src={SAMPLE}
        alt="With link"
        width={240}
        height={160}
        radius="md"
        action={
          <a href={SAMPLE} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Button variant="secondary" size="sm">View Full Size</Button>
          </a>
        }
      />
      <Image
        src={SAMPLE_PORTRAIT}
        alt="With button"
        width={240}
        height={160}
        radius="md"
        action={<Button variant="primary" size="sm">Download</Button>}
      />
    </Stack>
  );
}

function PositionExample() {
  return (
    <Stack gap="md" wrap>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>center (default)</p>
        <Image src={SAMPLE_PORTRAIT} alt="Center" width={160} height={120} fit="cover" radius="md" position="center" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>top</p>
        <Image src={SAMPLE_PORTRAIT} alt="Top" width={160} height={120} fit="cover" radius="md" position="top" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>bottom</p>
        <Image src={SAMPLE_PORTRAIT} alt="Bottom" width={160} height={120} fit="cover" radius="md" position="bottom" />
      </div>
    </Stack>
  );
}

function ResponsiveSourcesExample() {
  return (
    <Stack gap="md">
      <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>
        Drag the resize handle to see different sources load. Check DevTools Network tab.
      </p>
      <div style={{ width: '100%', maxWidth: 800, resize: 'horizontal', overflow: 'auto', border: '1px dashed var(--move-border-base)', padding: 8 }}>
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&fit=crop"
          sources={[
            { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&fit=crop', width: 400 },
            { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop', width: 800 },
            { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&fit=crop', width: 1200 },
          ]}
          alt="Responsive mountain landscape"
          width="100%"
          aspectRatio="16/9"
          radius="md"
        />
      </div>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider slotProps={{ Image: { root: { style: { border: '2px solid var(--move-border-base)' } } } }}>
      <Stack gap="md">
        <Image src={SAMPLE} alt="Global styled" width={200} height={140} radius="md" />
        <Image
          src={SAMPLE}
          alt="Instance styled"
          width={200}
          height={140}
          radius="md"
          sp={{ root: { style: { border: '2px solid var(--move-primary)', boxShadow: 'var(--move-shadow-elevated)' } } }}
        />
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
    code: `import { Image } from 'move';

<Image
  src="https://example.com/photo.jpg"
  alt="Mountain landscape"
  width={400}
  height={260}
  radius="md"
/>`,
  },
  {
    id: 'radius',
    name: 'Radius',
    description: 'From sharp to fully rounded',
    component: <RadiusExample />,
    code: `<Image src="..." alt="None" width={120} height={120} radius="none" />
<Image src="..." alt="Small" width={120} height={120} radius="sm" />
<Image src="..." alt="Medium" width={120} height={120} radius="md" />
<Image src="..." alt="Large" width={120} height={120} radius="lg" />
<Image src="..." alt="Full" width={120} height={120} radius="full" />`,
  },
  {
    id: 'fit',
    name: 'Object Fit',
    description: 'Control how the image fills its container',
    component: <FitExample />,
    code: `<Image src="..." alt="Cover" width={160} height={120} fit="cover" radius="md" />
<Image src="..." alt="Contain" width={160} height={120} fit="contain" radius="md" />
<Image src="..." alt="Scale down" width={160} height={120} fit="scale-down" radius="md" />`,
  },
  {
    id: 'aspect-ratio',
    name: 'Aspect Ratio',
    description: 'Lock images to a specific shape',
    component: <AspectRatioExample />,
    code: `<Image src="..." alt="Square" width="100%" aspectRatio="1/1" radius="md" />
<Image src="..." alt="Widescreen" width="100%" aspectRatio="16/9" radius="md" />
<Image src="..." alt="Classic" width="100%" aspectRatio="4/3" radius="md" />`,
  },
  {
    id: 'fallback',
    name: 'Fallback',
    description: 'Graceful handling when images fail to load',
    component: <FallbackExample />,
    code: `<Image src="broken.jpg" fallbackSrc="backup.jpg" alt="With fallback" width={200} height={140} radius="md" />
<Image src="broken.jpg" alt="Default icon" width={200} height={140} radius="md" />
<Image src="broken.jpg" alt="Custom" width={200} height={140} radius="md">
  <span>No image available</span>
</Image>`,
  },
  {
    id: 'position',
    name: 'Position',
    description: 'Control the focal point when the image is cropped',
    component: <PositionExample />,
    code: `<Image src="..." alt="Center" width={160} height={120} fit="cover" position="center" />
<Image src="..." alt="Top" width={160} height={120} fit="cover" position="top" />
<Image src="..." alt="Bottom" width={160} height={120} fit="cover" position="bottom" />`,
  },
  {
    id: 'responsive-sources',
    name: 'Responsive Sources',
    description: 'Container-aware image source selection based on available width',
    component: <ResponsiveSourcesExample />,
    code: `<Image
  src="/photo-sm.jpg"
  sources={[
    { src: '/photo-sm.jpg', width: 400 },
    { src: '/photo-md.jpg', width: 800 },
    { src: '/photo-lg.jpg', width: 1200 },
  ]}
  alt="Responsive photo"
  width="100%"
  aspectRatio="16/9"
  radius="md"
/>`,
  },
  {
    id: 'action',
    name: 'Action Overlay',
    description: 'Hover to reveal a link or button',
    component: <ActionExample />,
    code: `<Image
  src="photo.jpg"
  alt="With link"
  width={240}
  height={160}
  radius="md"
  action={
    <a href="photo.jpg" target="_blank">
      <Button variant="secondary" size="sm">View Full Size</Button>
    </a>
  }
/>
<Image
  src="portrait.jpg"
  alt="With button"
  width={240}
  height={160}
  radius="md"
  action={<Button variant="primary" size="sm">Download</Button>}
/>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider slotProps={{ Image: { root: { style: { border: '2px solid var(--move-border-base)' } } } }}>
  <Image src="..." alt="Global styled" width={200} height={140} radius="md" />
  <Image
    src="..."
    alt="Instance styled"
    width={200}
    height={140}
    radius="md"
    sp={{ root: { style: { border: '2px solid var(--move-primary)' } } }}
  />
</MoveProvider>`,
  },
];

export function ImageDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Image"
        description="A smarter image with fit, radius, and built-in fallback."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Image"
        properties={[
          { name: 'src', type: 'string', description: 'Image source URL. Used as SSR fallback when sources is provided.' },
          { name: 'sources', type: 'ImageSource[]', description: 'Responsive image variants. The component picks the best source based on container width and device pixel ratio.' },
          { name: 'alt', type: 'string', description: 'Alternative text for accessibility.' },
          { name: 'fallbackSrc', type: 'string', description: 'Fallback image URL shown when the primary source fails to load.' },
          { name: 'fit', type: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'", default: "'cover'", description: 'How the image fills its container (object-fit).' },
          { name: 'position', type: "'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'", default: "'center'", description: 'Focal point when the image is cropped (object-position).' },
          { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'none'", description: 'Border radius of the image container.' },
          { name: 'aspectRatio', type: 'string', description: 'CSS aspect ratio (e.g. "16/9", "1/1").' },
          { name: 'width', type: 'string | number', description: 'Width of the image container.' },
          { name: 'height', type: 'string | number', description: 'Height of the image container.' },
          { name: 'loading', type: "'lazy' | 'eager'", description: 'Browser loading strategy.' },
          { name: 'action', type: 'ReactNode', description: 'Overlay content shown on hover.' },
          { name: 'onLoad', type: 'ReactEventHandler', description: 'Called when the image loads successfully.' },
          { name: 'onError', type: 'ReactEventHandler', description: 'Called when the image fails to load.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for root, img, fallback, and action elements.' },
        ]}
      />
    </DocPage.Root>
  );
}
