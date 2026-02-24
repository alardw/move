import { useState } from 'react';
import { ThemeProvider, Button, Badge, Checkbox, Switch, darkTheme, lightTheme } from 'move';
import type { Theme } from 'move';
import { DocPage } from '../components/DocPage';
import { Stack, Text, ThemeZone } from '../components';

// Custom themes for examples
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

// ---------------------------------------------------------------------------
// Section styles
// ---------------------------------------------------------------------------

const sectionStyle: React.CSSProperties = {
  marginTop: 'var(--move-spacing-xl)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-lg)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  margin: '0 0 var(--move-spacing-sm) 0',
};

const proseStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-sm)',
  lineHeight: 1.7,
  color: 'var(--move-fg-muted)',
  margin: '0 0 var(--move-spacing-md) 0',
  maxWidth: '65ch',
};

const codeBlockStyle: React.CSSProperties = {
  background: 'var(--move-bg-muted)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-md)',
  padding: 'var(--move-spacing-md)',
  fontSize: 'var(--move-size-xs)',
  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
  color: 'var(--move-fg-muted)',
  overflowX: 'auto',
  lineHeight: 1.6,
  margin: '0 0 var(--move-spacing-md) 0',
  whiteSpace: 'pre',
};

const tierBoxStyle: React.CSSProperties = {
  background: 'var(--move-bg-subtle)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-lg)',
  padding: 'var(--move-spacing-md)',
};

const tierLabelStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-xs)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: 'var(--move-spacing-xs)',
};

const tierDescStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-sm)',
  color: 'var(--move-fg-muted)',
  margin: 0,
  lineHeight: 1.5,
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', monospace",
  fontSize: '0.8em',
  background: 'var(--move-bg-muted)',
  padding: '0.125rem 0.375rem',
  borderRadius: 'var(--move-rounded-sm)',
  color: 'var(--move-primary)',
};

// ---------------------------------------------------------------------------
// Inline Examples
// ---------------------------------------------------------------------------

function ThemeSwitchExample() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div style={tierBoxStyle}>
      <Stack direction="column" gap="md">
        <Stack gap="sm" align="center">
          <Text size="sm" variant="muted">Theme:</Text>
          <Switch.Root checked={isDark} onCheckedChange={setIsDark} label={isDark ? 'Dark' : 'Light'}><Switch.Thumb /></Switch.Root>
        </Stack>
        <ThemeProvider theme={theme} className="theme-zone">
          <Stack gap="md" wrap>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Badge variant="primary">Badge</Badge>
            <Checkbox defaultChecked />
          </Stack>
        </ThemeProvider>
      </Stack>
    </div>
  );
}

function SemanticOverrideExample() {
  return (
    <div style={tierBoxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Override a semantic token on a wrapper:
      </Text>
      <div
        style={{
          // @ts-expect-error CSS custom property
          '--move-primary': 'coral',
          '--move-primary-hover': '#ff8c69',
          '--move-primary-active': '#e06040',
          '--move-focus-ring-color': 'coral',
        }}
      >
        <Stack gap="md" wrap>
          <Button variant="primary">Coral Primary</Button>
          <Badge variant="primary">Coral</Badge>
          <Checkbox defaultChecked />
        </Stack>
      </div>
    </div>
  );
}

function ComponentTokenOverrideExample() {
  return (
    <div style={tierBoxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Override a component token for scoped styling:
      </Text>
      <Stack gap="lg" wrap>
        <div>
          <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-xs)' }}>Default</Text>
          <Button variant="primary">Button</Button>
        </div>
        <div
          style={{
            // @ts-expect-error CSS custom property
            '--move-button-radius': '0px',
          }}
        >
          <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-xs)' }}>Square corners</Text>
          <Button variant="primary">Button</Button>
        </div>
        <div
          style={{
            // @ts-expect-error CSS custom property
            '--move-button-radius': 'var(--move-rounded-full)',
          }}
        >
          <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-xs)' }}>Pill shape</Text>
          <Button variant="primary">Button</Button>
        </div>
      </Stack>
    </div>
  );
}

function NestedThemeExample() {
  return (
    <div style={tierBoxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Providers nest naturally — inner theme always wins:
      </Text>
      <Stack direction="column" gap="md">
        <Stack gap="md">
          <Button variant="primary">App Theme</Button>
          <Badge variant="primary">Default</Badge>
        </Stack>
        <ThemeZone theme={roseTheme} label="Rose zone">
          <Button variant="primary">Rose</Button>
          <Badge variant="primary">Rose</Badge>
        </ThemeZone>
        <ThemeProvider theme={roseTheme} className="theme-zone">
          <Text variant="muted" size="sm">Rose zone with nested ocean</Text>
          <ThemeProvider theme={oceanTheme} className="theme-zone" asWrapper>
            <Text variant="muted" size="sm">Ocean nested inside rose</Text>
            <Stack gap="md">
              <Button variant="primary">Ocean</Button>
              <Badge variant="primary">Ocean</Badge>
            </Stack>
          </ThemeProvider>
        </ThemeProvider>
      </Stack>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Demo
// ---------------------------------------------------------------------------

export function ThemingDemo() {
  return (
    <DocPage.Root>
      <DocPage.Header
        title="Theming"
        description="A layered token system that makes every component yours."
      />

      {/* How It Works */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>How It Works</h3>
        <p style={proseStyle}>
          Move uses a three-tier token architecture. Each tier builds on the one below it,
          giving you control at every level of abstraction.
        </p>

        <Stack direction="column" gap="md">
          <div style={tierBoxStyle}>
            <div style={tierLabelStyle}>1. Primitives</div>
            <p style={tierDescStyle}>
              Raw values — color scales, spacing units, font stacks. These are the building blocks.
              <br />
              <span style={monoStyle}>--move-violet-600</span>{' '}
              <span style={monoStyle}>--move-space-4</span>{' '}
              <span style={monoStyle}>--move-radius-4</span>
            </p>
          </div>

          <div style={tierBoxStyle}>
            <div style={tierLabelStyle}>2. Semantic Tokens</div>
            <p style={tierDescStyle}>
              Purpose-based tokens that map meaning to primitives. Changing these affects every component.
              <br />
              <span style={monoStyle}>--move-primary</span>{' '}
              <span style={monoStyle}>--move-spacing-md</span>{' '}
              <span style={monoStyle}>--move-rounded-md</span>
            </p>
          </div>

          <div style={tierBoxStyle}>
            <div style={tierLabelStyle}>3. Component Tokens</div>
            <p style={tierDescStyle}>
              Scoped tokens for individual components. Override one button's radius without touching anything else.
              <br />
              <span style={monoStyle}>--move-button-radius</span>{' '}
              <span style={monoStyle}>--move-dialog-content-bg</span>{' '}
              <span style={monoStyle}>--move-sidebar-width</span>
            </p>
          </div>
        </Stack>
      </div>

      {/* ThemeProvider */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>ThemeProvider</h3>
        <p style={proseStyle}>
          Wrap your app in a <code style={monoStyle}>ThemeProvider</code> to set the active theme.
          A theme is just a name and a set of token overrides — spread an existing theme and replace
          what you need.
        </p>

        <pre style={codeBlockStyle}>{`import { ThemeProvider, darkTheme } from 'move';
import type { Theme } from 'move';

const myTheme: Theme = {
  ...darkTheme,
  name: 'my-theme',
  tokens: {
    ...darkTheme.tokens,
    '--move-primary': '#e11d48',
    '--move-primary-hover': '#f43f5e',
  },
};

<ThemeProvider theme={myTheme}>
  <App />
</ThemeProvider>`}</pre>

        <p style={proseStyle}>
          Nest providers to style any section differently. Inner providers inherit from their parent
          and override only the tokens they specify.
        </p>

        <NestedThemeExample />
      </div>

      {/* Three Ways to Customize */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Three Ways to Customize</h3>

        <Stack direction="column" gap="lg">
          <div>
            <p style={{ ...proseStyle, fontWeight: 500, color: 'var(--move-fg-base)' }}>
              1. Swap themes
            </p>
            <p style={proseStyle}>
              Switch between pre-built themes or create your own by spreading and overriding tokens.
            </p>
            <ThemeSwitchExample />
          </div>

          <div>
            <p style={{ ...proseStyle, fontWeight: 500, color: 'var(--move-fg-base)' }}>
              2. Override semantic tokens
            </p>
            <p style={proseStyle}>
              Set CSS custom properties on any wrapper to change the design system within that scope.
            </p>
            <SemanticOverrideExample />
          </div>

          <div>
            <p style={{ ...proseStyle, fontWeight: 500, color: 'var(--move-fg-base)' }}>
              3. Override component tokens
            </p>
            <p style={proseStyle}>
              Each component exposes scoped tokens. Change just one component's look
              without affecting the rest.
            </p>
            <ComponentTokenOverrideExample />
          </div>
        </Stack>
      </div>
    </DocPage.Root>
  );
}
