import { Icon, IconProvider, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, Text } from '../components';
import * as LucideIcons from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as faSolid from '@fortawesome/free-solid-svg-icons';
import * as HeroOutline from '@heroicons/react/24/outline';

// ── Resolvers for each icon library ──

function toPascalCase(name: string) {
  return name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

const lucideResolver = (name: string) => {
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || null;
};

const faResolver = (name: string) => {
  const key = 'fa' + toPascalCase(name);
  const icon = (faSolid as Record<string, any>)[key];
  if (!icon) return null;
  return (props: any) => <FontAwesomeIcon icon={icon} {...props} />;
};

const heroResolver = (name: string) => {
  const key = toPascalCase(name) + 'Icon';
  return (HeroOutline as Record<string, any>)[key] || null;
};

function UsageExample() {
  return (
    <Icon name="star" />
  );
}

function SizesExample() {
  return (
    <Stack gap="lg" align="center">
      <Icon name="heart" size="xs" />
      <Icon name="heart" size="sm" />
      <Icon name="heart" size="md" />
      <Icon name="heart" size="lg" />
      <Icon name="heart" size="xl" />
      <Icon name="heart" size={32} />
    </Stack>
  );
}

function ColorExample() {
  return (
    <Stack gap="lg" align="center">
      <Icon name="star" color="var(--move-primary)" size="lg" />
      <Icon name="circle-check" color="var(--move-success)" size="lg" />
      <Icon name="triangle-alert" color="var(--move-warning)" size="lg" />
      <Icon name="circle-x" color="var(--move-error)" size="lg" />
    </Stack>
  );
}

function GalleryExample() {
  return (
    <Stack gap="lg" wrap align="center">
      <Icon name="sun" size="lg" />
      <Icon name="moon" size="lg" />
      <Icon name="cloud" size="lg" />
      <Icon name="zap" size="lg" />
      <Icon name="bell" size="lg" />
      <Icon name="search" size="lg" />
      <Icon name="settings" size="lg" />
      <Icon name="user" size="lg" />
      <Icon name="mail" size="lg" />
      <Icon name="lock" size="lg" />
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <Stack gap="lg" align="center">
      <Icon name="star" size="xl" className="custom-icon" />
      <Icon name="award" size="xl" color="var(--move-warning)" />
    </Stack>
  );
}

function LibrariesExample() {
  return (
    <Stack direction="column" gap="lg">
      <IconProvider resolver={lucideResolver}>
        <Stack direction="column" gap="sm">
          <Text variant="muted" size="xs">Lucide</Text>
          <Stack gap="md" align="center" wrap>
            <Icon name="star" size="lg" />
            <Icon name="heart" size="lg" />
            <Icon name="shield" size="lg" />
            <Icon name="rocket" size="lg" />
            <Icon name="zap" size="lg" />
            <Icon name="bell" size="lg" />
          </Stack>
        </Stack>
      </IconProvider>
      <IconProvider resolver={faResolver}>
        <Stack direction="column" gap="sm">
          <Text variant="muted" size="xs">Font Awesome</Text>
          <Stack gap="md" align="center" wrap>
            <Icon name="star" size="lg" />
            <Icon name="heart" size="lg" />
            <Icon name="shield-halved" size="lg" />
            <Icon name="bolt" size="lg" />
            <Icon name="globe" size="lg" />
            <Icon name="flag" size="lg" />
          </Stack>
        </Stack>
      </IconProvider>
      <IconProvider resolver={heroResolver}>
        <Stack direction="column" gap="sm">
          <Text variant="muted" size="xs">Heroicons</Text>
          <Stack gap="md" align="center" wrap>
            <Icon name="star" size="lg" />
            <Icon name="heart" size="lg" />
            <Icon name="shield-check" size="lg" />
            <Icon name="rocket-launch" size="lg" />
            <Icon name="sparkles" size="lg" />
            <Icon name="fire" size="lg" />
          </Stack>
        </Stack>
      </IconProvider>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Set up IconProvider once at the app root, then use Icon anywhere',
    component: <UsageExample />,
    code: `import { Icon, IconProvider } from 'move';

// App root — set up once
<IconProvider resolver={yourResolver}>
  <App />
</IconProvider>

// Then anywhere in your app:
<Icon name="star" />`,
  },
  {
    id: 'libraries',
    name: 'Libraries',
    description: 'Bring your own icon library — just write a resolver',
    component: <LibrariesExample />,
    code: `// ── Lucide ──
import * as LucideIcons from 'lucide-react';

const lucideResolver = (name: string) => {
  const pascal = name
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('');
  return LucideIcons[pascal] || null;
};

// ── Font Awesome ──
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solid from '@fortawesome/free-solid-svg-icons';

const faResolver = (name: string) => {
  const key = 'fa' + name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  const icon = solid[key];
  if (!icon) return null;
  return () => <FontAwesomeIcon icon={icon} />;
};

// ── Heroicons ──
import * as HeroOutline from '@heroicons/react/24/outline';

const heroResolver = (name: string) => {
  const pascal = name
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('') + 'Icon';
  return HeroOutline[pascal] || null;
};

// Wrap your app with whichever resolver you choose
<IconProvider resolver={lucideResolver}>
  <App />
</IconProvider>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From tiny to extra large',
    component: <SizesExample />,
    code: `<Icon name="heart" size="xs" />\n<Icon name="heart" size="sm" />\n<Icon name="heart" size="md" />\n<Icon name="heart" size="lg" />\n<Icon name="heart" size="xl" />\n<Icon name="heart" size={32} />`,
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'Match any color from your theme',
    component: <ColorExample />,
    code: `<Icon name="circle" color="var(--move-primary)" size="lg" />\n<Icon name="circle" color="var(--move-success)" size="lg" />\n<Icon name="circle" color="var(--move-warning)" size="lg" />\n<Icon name="circle" color="var(--move-error)" size="lg" />`,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Any icon from your library, by name',
    component: <GalleryExample />,
    code: `<Icon name="sun" size="lg" />\n<Icon name="moon" size="lg" />\n<Icon name="cloud" size="lg" />\n<Icon name="zap" size="lg" />\n<Icon name="bell" size="lg" />\n<Icon name="search" size="lg" />\n<Icon name="settings" size="lg" />\n<Icon name="user" size="lg" />\n<Icon name="mail" size="lg" />\n<Icon name="lock" size="lg" />`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Add your own classes and colors',
    component: <CustomStylingExample />,
    code: `<Icon name="star" size="xl" className="custom-icon" />\n<Icon name="award" size="xl" color="var(--move-warning)" />`,
  },
];

export function IconDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Icon"
        description="Render any icon by name — bring your own icon library."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
