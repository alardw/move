import { Button } from 'move';
import { DocPage } from '../components/DocPage';
import { Stack, Text } from '../components';

// =============================================================================
// Styles
// =============================================================================

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

const exampleBoxStyle: React.CSSProperties = {
  background: 'var(--move-bg-subtle)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-lg)',
  padding: 'var(--move-spacing-lg)',
};

const componentCardStyle: React.CSSProperties = {
  background: 'var(--move-bg-subtle)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-md)',
  padding: 'var(--move-spacing-md)',
};

const componentNameStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-sm)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  marginBottom: 'var(--move-spacing-xs)',
};

const tokenListStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-xs)',
  fontFamily: "'SF Mono', monospace",
  color: 'var(--move-fg-muted)',
  lineHeight: 1.8,
  margin: 0,
  padding: 0,
  listStyle: 'none',
};

// =============================================================================
// Component token registry
// =============================================================================

const componentTokens: { name: string; prefix: string; tokens: string[] }[] = [
  {
    name: 'Button',
    prefix: '--move-button-',
    tokens: [
      'radius', 'height', 'padding-x', 'font-size', 'font-weight', 'gap',
      'primary-bg', 'primary-bg-hover', 'primary-bg-active', 'primary-fg',
      'secondary-bg', 'secondary-bg-hover', 'secondary-bg-active', 'secondary-fg', 'secondary-border',
      'ghost-fg', 'ghost-bg-hover',
      'danger-bg', 'danger-bg-hover', 'danger-fg',
    ],
  },
  {
    name: 'Checkbox',
    prefix: '--move-checkbox-',
    tokens: [
      'size', 'icon-size', 'radius',
      'bg', 'bg-hover', 'bg-checked', 'bg-checked-hover',
      'border', 'border-hover', 'fg',
    ],
  },
  {
    name: 'Switch',
    prefix: '--move-switch-',
    tokens: [
      'width', 'height', 'bg', 'bg-checked', 'radius', 'padding', 'transition',
      'thumb-size',
    ],
  },
  {
    name: 'Dialog',
    prefix: '--move-dialog-',
    tokens: [
      'overlay-bg', 'overlay-backdrop-blur',
      'content-bg', 'content-border', 'content-radius', 'content-shadow',
      'content-padding', 'content-width', 'content-max-width', 'content-max-height',
      'title-font-size', 'title-font-weight', 'title-fg', 'title-margin-bottom',
      'description-font-size', 'description-fg', 'description-margin-bottom',
      'close-size', 'close-icon-size', 'close-fg', 'close-fg-hover', 'close-bg-hover', 'close-radius',
      'transition-duration', 'transition-easing',
    ],
  },
  {
    name: 'Dropdown',
    prefix: '--move-dropdown-',
    tokens: [
      'content-bg', 'content-border', 'content-radius', 'content-shadow',
      'content-padding', 'content-min-width', 'content-max-height',
      'item-radius', 'item-padding-x', 'item-padding-y', 'item-fg', 'item-fg-disabled', 'item-bg-highlight', 'item-font-size',
      'label-padding-x', 'label-padding-y', 'label-font-size', 'label-fg', 'label-font-weight',
      'separator-color', 'separator-margin',
    ],
  },
  {
    name: 'Tooltip',
    prefix: '--move-tooltip-',
    tokens: [
      'content-bg', 'content-fg', 'content-radius', 'content-shadow',
      'content-padding-x', 'content-padding-y', 'content-font-size', 'content-max-width',
    ],
  },
  {
    name: 'Popover',
    prefix: '--move-popover-',
    tokens: [
      'content-bg', 'content-border', 'content-radius', 'content-shadow',
      'content-padding', 'content-min-width', 'content-max-width',
      'close-size', 'close-radius', 'close-fg', 'close-fg-hover', 'close-bg-hover',
    ],
  },
  {
    name: 'Select',
    prefix: '--move-select-',
    tokens: [
      'trigger-bg', 'trigger-border', 'trigger-radius', 'trigger-padding-x', 'trigger-padding-y',
      'trigger-font-size', 'trigger-fg', 'trigger-height', 'trigger-min-width',
      'content-bg', 'content-border', 'content-radius', 'content-shadow',
      'content-padding', 'content-min-width', 'content-max-height',
      'item-radius', 'item-padding-x', 'item-padding-y', 'item-fg', 'item-fg-disabled', 'item-bg-highlight', 'item-font-size',
    ],
  },
  {
    name: 'Sidebar',
    prefix: '--move-sidebar-',
    tokens: [
      'width', 'width-collapsed', 'width-mobile',
      'bg', 'border', 'fg',
      'item-radius', 'item-padding-x', 'item-padding-y',
      'item-fg', 'item-fg-hover', 'item-fg-active', 'item-bg-hover', 'item-bg-active',
      'group-label-fg', 'group-label-size',
    ],
  },
  {
    name: 'Tabs',
    prefix: '--move-tabs-',
    tokens: [
      'border', 'trigger-fg', 'trigger-fg-active', 'trigger-bg-hover',
    ],
  },
  {
    name: 'Toast',
    prefix: '--move-toast-',
    tokens: [
      'bg', 'fg', 'border', 'radius', 'shadow',
      'padding-x', 'padding-y', 'accent', 'width',
      'viewport-spacing', 'viewport-z',
    ],
  },
];

// =============================================================================
// Live Examples
// =============================================================================

function ScopedOverrideExample() {
  return (
    <div style={exampleBoxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-md)' }}>
        Scoped: override button tokens on a single wrapper
      </Text>
      <Stack gap="lg" wrap>
        <div>
          <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-xs)' }}>Default</Text>
          <Button variant="primary">Save</Button>
        </div>
        <div
          style={{
            // @ts-expect-error CSS custom property
            '--move-button-radius': '0px',
            '--move-button-primary-bg': '#059669',
            '--move-button-primary-bg-hover': '#10b981',
            '--move-button-primary-bg-active': '#047857',
          }}
        >
          <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-xs)' }}>Square + green</Text>
          <Button variant="primary">Save</Button>
        </div>
        <div
          style={{
            // @ts-expect-error CSS custom property
            '--move-button-radius': 'var(--move-rounded-full)',
            '--move-button-primary-bg': '#e11d48',
            '--move-button-primary-bg-hover': '#f43f5e',
            '--move-button-primary-bg-active': '#be123c',
          }}
        >
          <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-xs)' }}>Pill + rose</Text>
          <Button variant="primary">Save</Button>
        </div>
      </Stack>
    </div>
  );
}

function GlobalOverrideExample() {
  return (
    <div style={exampleBoxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-md)' }}>
        Global: set component tokens at the app root to affect all instances
      </Text>
      <div
        style={{
          // @ts-expect-error CSS custom property
          '--move-button-radius': 'var(--move-rounded-full)',
          '--move-button-font-weight': '700',
        }}
      >
        <Stack gap="md" wrap>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Stack>
        <Text size="sm" variant="muted" style={{ marginTop: 'var(--move-spacing-sm)' }}>
          All buttons are now pill-shaped and bold — no CSS files changed.
        </Text>
      </div>
    </div>
  );
}

// =============================================================================
// Demo
// =============================================================================

export function ComponentTokensDemo() {
  return (
    <DocPage.Root>
      <DocPage.Header
        title="Component Tokens"
        description="Scoped CSS custom properties that let you customize individual components without touching global tokens."
      />

      {/* How It Works */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>How It Works</h3>
        <p style={proseStyle}>
          Each component declares its own set of CSS custom properties with sensible defaults that
          reference semantic tokens. The fallback pattern means the component works out of the box,
          but you can override any token on a wrapper element for scoped customization.
        </p>

        <pre style={codeBlockStyle}>{`/* Inside Button.module.css */
.root {
  border-radius: var(--move-button-radius, var(--move-rounded-md));
  height: var(--move-button-height, var(--move-control-height-md));
  font-size: var(--move-button-font-size, var(--move-size-sm));
}

/* Override on a wrapper — no CSS files touched */
<div style={{ '--move-button-radius': '0px' }}>
  <Button>Square Corners</Button>
</div>`}</pre>

        <p style={proseStyle}>
          Because CSS custom properties inherit, you can set them at any level: on a single wrapper
          for a scoped change, or on your app root for a global override.
        </p>
      </div>

      {/* Live Examples */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Live Examples</h3>

        <Stack direction="column" gap="lg">
          <ScopedOverrideExample />
          <GlobalOverrideExample />
        </Stack>
      </div>

      {/* Available Tokens */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Available Tokens</h3>
        <p style={proseStyle}>
          The following components expose overridable tokens. Set them on any ancestor element to
          customize that component within that scope.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--move-spacing-md)' }}>
          {componentTokens.map(({ name, prefix, tokens }) => (
            <div key={name} style={componentCardStyle}>
              <div style={componentNameStyle}>{name}</div>
              <ul style={tokenListStyle}>
                {tokens.map(t => (
                  <li key={t}>
                    <code style={{ fontSize: 'inherit', color: 'var(--move-fg-muted)' }}>{prefix}{t}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </DocPage.Root>
  );
}
