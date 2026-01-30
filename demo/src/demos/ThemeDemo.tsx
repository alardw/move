import { ThemeProvider, Button, Badge, Checkbox, darkTheme, lightTheme } from 'move';
import type { Theme } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, Text, ThemeZone } from '../components';

// Custom themes built by spreading + overriding tokens

const roseTheme: Theme = {
  ...darkTheme,
  name: 'rose',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#e11d48',
    '--move-primary-hover': '#f43f5e',
    '--move-primary-active': '#be123c',
    '--move-primary-subtle': '#4c0519',
    '--move-primary-fg': '#ffffff',
    '--move-focus-ring-color': '#f43f5e',
  },
};

const oceanTheme: Theme = {
  ...darkTheme,
  name: 'ocean',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#0891b2',
    '--move-primary-hover': '#06b6d4',
    '--move-primary-active': '#0e7490',
    '--move-primary-subtle': '#083344',
    '--move-primary-fg': '#ffffff',
    '--move-focus-ring-color': '#06b6d4',
  },
};

const emeraldTheme: Theme = {
  ...darkTheme,
  name: 'emerald',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#059669',
    '--move-primary-hover': '#10b981',
    '--move-primary-active': '#047857',
    '--move-primary-subtle': '#022c22',
    '--move-primary-fg': '#ffffff',
    '--move-focus-ring-color': '#10b981',
  },
};

// ---------------------------------------------------------------------------
// Examples
// ---------------------------------------------------------------------------

function OverrideExample() {
  return (
    <Stack direction="column" gap="lg">
      <ThemeZone theme={roseTheme} label="Rose theme zone">
        <Button variant="primary">Rose Primary</Button>
        <Badge variant="primary">Rose Badge</Badge>
        <Checkbox defaultChecked />
      </ThemeZone>
      <ThemeZone theme={oceanTheme} label="Ocean theme zone">
        <Button variant="primary">Ocean Primary</Button>
        <Badge variant="primary">Ocean Badge</Badge>
        <Checkbox defaultChecked />
      </ThemeZone>
      <ThemeZone theme={emeraldTheme} label="Emerald theme zone">
        <Button variant="primary">Emerald Primary</Button>
        <Badge variant="primary">Emerald Badge</Badge>
        <Checkbox defaultChecked />
      </ThemeZone>
    </Stack>
  );
}

function NestedExample() {
  return (
    <Stack direction="column" gap="md">
      <Text variant="muted" size="sm">Outer: app theme (inherited)</Text>
      <Stack gap="md">
        <Button variant="primary">App Theme</Button>
        <Badge variant="primary">Default</Badge>
      </Stack>

      <ThemeZone theme={roseTheme} label="Nested: rose theme">
        <Button variant="primary">Rose</Button>
        <Badge variant="primary">Rose</Badge>
      </ThemeZone>

      <ThemeProvider theme={roseTheme} className="theme-zone">
        <Text variant="muted" size="sm">Rose zone with nested ocean</Text>
        <ThemeProvider theme={oceanTheme} className="theme-zone" asWrapper>
          <Text variant="muted" size="sm">Double-nested: ocean theme</Text>
          <Stack gap="md">
            <Button variant="primary">Ocean</Button>
            <Badge variant="primary">Ocean</Badge>
          </Stack>
        </ThemeProvider>
      </ThemeProvider>
    </Stack>
  );
}

function CustomTokensExample() {
  const funkyTheme: Theme = {
    ...darkTheme,
    name: 'funky',
    tokens: {
      ...darkTheme.tokens,
      '--move-bg-base': '#1a1025',
      '--move-bg-subtle': '#231530',
      '--move-bg-muted': '#2d1d3d',
      '--move-bg-emphasis': '#3d2a52',
      '--move-border-base': '#4a3460',
      '--move-primary': '#f59e0b',
      '--move-primary-hover': '#fbbf24',
      '--move-primary-active': '#d97706',
      '--move-primary-subtle': '#451a03',
      '--move-primary-fg': '#000000',
      '--move-secondary': '#4a3460',
      '--move-secondary-hover': '#5c4275',
      '--move-secondary-active': '#3d2a52',
      '--move-secondary-fg': '#fafafa',
      '--move-focus-ring-color': '#fbbf24',
    },
  };

  return (
    <ThemeZone theme={funkyTheme} label="Deep purple background + amber primary">
      <Button variant="primary">Amber</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Badge variant="primary">Funky</Badge>
      <Badge variant="secondary">Tag</Badge>
    </ThemeZone>
  );
}

function LightDarkExample() {
  return (
    <Stack gap="lg" wrap>
      <Stack flex={1} className="min-w-200">
        <ThemeZone theme={darkTheme} label="Dark">
          <Button variant="primary">Button</Button>
          <Badge variant="primary">Badge</Badge>
        </ThemeZone>
      </Stack>
      <Stack flex={1} className="min-w-200">
        <ThemeZone theme={lightTheme} label="Light">
          <Button variant="primary">Button</Button>
          <Badge variant="primary">Badge</Badge>
        </ThemeZone>
      </Stack>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Examples array
// ---------------------------------------------------------------------------

const examples: Example[] = [
  {
    id: 'override',
    name: 'Custom Themes',
    description: 'Rose, ocean, and emerald — just a few token swaps away',
    component: <OverrideExample />,
    code: `const roseTheme: Theme = {
  ...darkTheme,
  name: 'rose',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#e11d48',
    '--move-primary-hover': '#f43f5e',
    '--move-primary-active': '#be123c',
    '--move-primary-subtle': '#4c0519',
    '--move-primary-fg': '#ffffff',
    '--move-focus-ring-color': '#f43f5e',
  },
};

const oceanTheme: Theme = {
  ...darkTheme,
  name: 'ocean',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#0891b2',
    '--move-primary-hover': '#06b6d4',
    '--move-primary-active': '#0e7490',
    '--move-primary-subtle': '#083344',
    '--move-primary-fg': '#ffffff',
    '--move-focus-ring-color': '#06b6d4',
  },
};

const emeraldTheme: Theme = {
  ...darkTheme,
  name: 'emerald',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#059669',
    '--move-primary-hover': '#10b981',
    '--move-primary-active': '#047857',
    '--move-primary-subtle': '#022c22',
    '--move-primary-fg': '#ffffff',
    '--move-focus-ring-color': '#10b981',
  },
};

<ThemeProvider theme={roseTheme}>
  <Button variant="primary">Rose Primary</Button>
  <Badge variant="primary">Rose Badge</Badge>
  <Checkbox defaultChecked />
</ThemeProvider>

<ThemeProvider theme={oceanTheme}>
  <Button variant="primary">Ocean Primary</Button>
  <Badge variant="primary">Ocean Badge</Badge>
  <Checkbox defaultChecked />
</ThemeProvider>

<ThemeProvider theme={emeraldTheme}>
  <Button variant="primary">Emerald Primary</Button>
  <Badge variant="primary">Emerald Badge</Badge>
  <Checkbox defaultChecked />
</ThemeProvider>`,
  },
  {
    id: 'nested',
    name: 'Nested Providers',
    description: 'Stack themes like layers — inner always wins',
    component: <NestedExample />,
    code: `<ThemeProvider theme={appTheme}>
  <Button variant="primary">App Theme</Button>
  <Badge variant="primary">Default</Badge>

  <ThemeProvider theme={roseTheme}>
    <Button variant="primary">Rose</Button>
    <Badge variant="primary">Rose</Badge>

    <ThemeProvider theme={oceanTheme}>
      <Button variant="primary">Ocean</Button>
      <Badge variant="primary">Ocean</Badge>
    </ThemeProvider>
  </ThemeProvider>
</ThemeProvider>`,
  },
  {
    id: 'tokens',
    name: 'Deep Customization',
    description: 'Go wild — change every surface and color',
    component: <CustomTokensExample />,
    code: `const funkyTheme: Theme = {
  ...darkTheme,
  name: 'funky',
  tokens: {
    ...darkTheme.tokens,
    '--move-bg-base': '#1a1025',
    '--move-bg-subtle': '#231530',
    '--move-bg-muted': '#2d1d3d',
    '--move-bg-emphasis': '#3d2a52',
    '--move-border-base': '#4a3460',
    '--move-primary': '#f59e0b',
    '--move-primary-hover': '#fbbf24',
    '--move-primary-active': '#d97706',
    '--move-primary-subtle': '#451a03',
    '--move-primary-fg': '#000000',
    '--move-secondary': '#4a3460',
    '--move-secondary-hover': '#5c4275',
    '--move-secondary-active': '#3d2a52',
    '--move-secondary-fg': '#fafafa',
    '--move-focus-ring-color': '#fbbf24',
  },
};

<ThemeProvider theme={funkyTheme}>
  <Button variant="primary">Amber</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Badge variant="primary">Funky</Badge>
  <Badge variant="secondary">Tag</Badge>
</ThemeProvider>`,
  },
  {
    id: 'light-dark',
    name: 'Side by Side',
    description: 'Dark meets light, side by side',
    component: <LightDarkExample />,
    code: `<ThemeProvider theme={darkTheme}>
  <Button variant="primary">Button</Button>
  <Badge variant="primary">Badge</Badge>
</ThemeProvider>

<ThemeProvider theme={lightTheme}>
  <Button variant="primary">Button</Button>
  <Badge variant="primary">Badge</Badge>
</ThemeProvider>`,
  },
];

export function ThemeDemo() {
  return (
    <DocPage.Root defaultExample="override">
      <DocPage.Header
        title="Theme"
        description="Swap colors and tokens to make every component yours. Nest themes to style any section differently."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
