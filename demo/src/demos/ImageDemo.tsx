import { Image, Button, MoveProvider } from 'move';
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
        <Image src={SAMPLE_PORTRAIT} alt="Contain" width={160} height={120} fit="contain" radius="md" style={{ backgroundColor: 'var(--move-bg-subtle)' }} />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>scale-down</p>
        <Image src={SAMPLE_PORTRAIT} alt="Scale down" width={160} height={120} fit="scale-down" radius="md" style={{ backgroundColor: 'var(--move-bg-subtle)' }} />
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

function CustomStylingExample() {
  return (
    <MoveProvider pt={{ Image: { root: { style: { border: '2px solid var(--move-border-base)' } } } }}>
      <Stack gap="md">
        <Image src={SAMPLE} alt="Global styled" width={200} height={140} radius="md" />
        <Image
          src={SAMPLE}
          alt="Instance styled"
          width={200}
          height={140}
          radius="md"
          pt={{ root: { style: { border: '2px solid var(--move-primary)', boxShadow: 'var(--move-shadow-elevated)' } } }}
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
    code: `<MoveProvider pt={{ Image: { root: { style: { border: '2px solid var(--move-border-base)' } } } }}>
  <Image src="..." alt="Global styled" width={200} height={140} radius="md" />
  <Image
    src="..."
    alt="Instance styled"
    width={200}
    height={140}
    radius="md"
    pt={{ root: { style: { border: '2px solid var(--move-primary)' } } }}
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
    </DocPage.Root>
  );
}
