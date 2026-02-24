import { DocPage, type TokenProp } from '../components/DocPage';

// =============================================================================
// Token Groups
// =============================================================================

const bgTokens: TokenProp[] = [
  { name: '--move-bg-base', default: 'var(--move-gray-950)', description: 'Page / app background' },
  { name: '--move-bg-subtle', default: 'var(--move-gray-900)', description: 'Subtle surface (cards, sidebar)' },
  { name: '--move-bg-muted', default: 'var(--move-gray-800)', description: 'Muted surface (inputs, toggles)' },
  { name: '--move-bg-emphasis', default: 'var(--move-gray-700)', description: 'Emphasized surface (hover states)' },
  { name: '--move-bg-inverse', default: 'var(--move-gray-50)', description: 'Inverted background' },
];

const fgTokens: TokenProp[] = [
  { name: '--move-fg-base', default: 'var(--move-gray-50)', description: 'Primary text' },
  { name: '--move-fg-muted', default: 'var(--move-gray-400)', description: 'Secondary text' },
  { name: '--move-fg-subtle', default: 'var(--move-gray-500)', description: 'Tertiary text (hints, placeholders)' },
  { name: '--move-fg-inverse', default: 'var(--move-gray-950)', description: 'Inverted text' },
];

const borderTokens: TokenProp[] = [
  { name: '--move-border-base', default: 'var(--move-gray-800)', description: 'Default border' },
  { name: '--move-border-muted', default: 'var(--move-gray-700)', description: 'Subtle border (dividers)' },
  { name: '--move-border-emphasis', default: 'var(--move-gray-600)', description: 'Emphasized border (hover)' },
];

const primaryTokens: TokenProp[] = [
  { name: '--move-primary', default: 'var(--move-violet-600)', description: 'Brand / primary action' },
  { name: '--move-primary-hover', default: 'var(--move-violet-500)', description: 'Primary hover state' },
  { name: '--move-primary-active', default: 'var(--move-violet-700)', description: 'Primary active / pressed' },
  { name: '--move-primary-subtle', default: 'var(--move-violet-950)', description: 'Primary subtle background' },
  { name: '--move-primary-fg', default: 'var(--move-white)', description: 'Text on primary surface' },
];

const secondaryTokens: TokenProp[] = [
  { name: '--move-secondary', default: 'var(--move-gray-700)', description: 'Secondary action surface' },
  { name: '--move-secondary-hover', default: 'var(--move-gray-600)', description: 'Secondary hover' },
  { name: '--move-secondary-active', default: 'var(--move-gray-800)', description: 'Secondary active' },
  { name: '--move-secondary-fg', default: 'var(--move-gray-50)', description: 'Text on secondary surface' },
];

const successTokens: TokenProp[] = [
  { name: '--move-success', default: 'var(--move-green-600)', description: 'Success indication' },
  { name: '--move-success-hover', default: 'var(--move-green-500)', description: 'Success hover' },
  { name: '--move-success-subtle', default: 'var(--move-green-950)', description: 'Subtle success background' },
  { name: '--move-success-fg', default: 'var(--move-white)', description: 'Text on success surface' },
];

const warningTokens: TokenProp[] = [
  { name: '--move-warning', default: 'var(--move-yellow-500)', description: 'Warning indication' },
  { name: '--move-warning-hover', default: 'var(--move-yellow-400)', description: 'Warning hover' },
  { name: '--move-warning-subtle', default: 'var(--move-yellow-950)', description: 'Subtle warning background' },
  { name: '--move-warning-fg', default: 'var(--move-black)', description: 'Text on warning surface' },
];

const errorTokens: TokenProp[] = [
  { name: '--move-error', default: 'var(--move-red-600)', description: 'Error / danger indication' },
  { name: '--move-error-hover', default: 'var(--move-red-500)', description: 'Error hover' },
  { name: '--move-error-subtle', default: 'var(--move-red-950)', description: 'Subtle error background' },
  { name: '--move-error-fg', default: 'var(--move-white)', description: 'Text on error surface' },
];

const infoTokens: TokenProp[] = [
  { name: '--move-info', default: 'var(--move-blue-600)', description: 'Informational indication' },
  { name: '--move-info-hover', default: 'var(--move-blue-500)', description: 'Info hover' },
  { name: '--move-info-subtle', default: 'var(--move-blue-950)', description: 'Subtle info background' },
  { name: '--move-info-fg', default: 'var(--move-white)', description: 'Text on info surface' },
];

const focusTokens: TokenProp[] = [
  { name: '--move-focus-ring-color', default: 'var(--move-violet-500)', description: 'Focus ring color', color: true },
  { name: '--move-focus-ring-width', default: '2px', description: 'Focus ring width', color: false },
  { name: '--move-focus-ring-offset', default: '2px', description: 'Focus ring offset', color: false },
  { name: '--move-focus-ring', default: '2px solid ...', description: 'Focus ring shorthand', color: false },
];

const controlTokens: TokenProp[] = [
  { name: '--move-control-height-sm', default: '2rem', description: 'Small control height', color: false },
  { name: '--move-control-height-md', default: '2.375rem', description: 'Medium control height (default)', color: false },
  { name: '--move-control-height-lg', default: '2.75rem', description: 'Large control height', color: false },
];

const disabledTokens: TokenProp[] = [
  { name: '--move-disabled-opacity', default: '0.6', description: 'Opacity for disabled elements', color: false },
];

const spacingTokens: TokenProp[] = [
  { name: '--move-spacing-xs', default: 'var(--move-space-1)', description: 'Extra-small spacing (0.25rem)', color: false },
  { name: '--move-spacing-sm', default: 'var(--move-space-2)', description: 'Small spacing (0.5rem)', color: false },
  { name: '--move-spacing-md', default: 'var(--move-space-4)', description: 'Medium spacing (1rem)', color: false },
  { name: '--move-spacing-lg', default: 'var(--move-space-6)', description: 'Large spacing (1.5rem)', color: false },
  { name: '--move-spacing-xl', default: 'var(--move-space-8)', description: 'Extra-large spacing (2rem)', color: false },
];

const radiusTokens: TokenProp[] = [
  { name: '--move-rounded-none', default: '0', description: 'No rounding', color: false },
  { name: '--move-rounded-sm', default: 'var(--move-radius-2)', description: 'Small radius (0.125rem)', color: false },
  { name: '--move-rounded-md', default: 'var(--move-radius-4)', description: 'Medium radius (0.25rem)', color: false },
  { name: '--move-rounded-lg', default: 'var(--move-radius-6)', description: 'Large radius (0.375rem)', color: false },
  { name: '--move-rounded-xl', default: 'var(--move-radius-8)', description: 'Extra-large radius (0.5rem)', color: false },
  { name: '--move-rounded-full', default: '9999px', description: 'Fully rounded (pill)', color: false },
];

const typographyTokens: TokenProp[] = [
  { name: '--move-font-body', default: 'var(--move-font-sans)', description: 'Body font family', color: false },
  { name: '--move-font-code', default: 'var(--move-font-mono)', description: 'Code font family', color: false },
  { name: '--move-size-xs', default: 'var(--move-text-xs)', description: 'Extra-small text (0.75rem)', color: false },
  { name: '--move-size-sm', default: 'var(--move-text-sm)', description: 'Small text (0.875rem)', color: false },
  { name: '--move-size-base', default: 'var(--move-text-base)', description: 'Base text (1rem)', color: false },
  { name: '--move-size-lg', default: 'var(--move-text-lg)', description: 'Large text (1.125rem)', color: false },
  { name: '--move-size-xl', default: 'var(--move-text-xl)', description: 'Extra-large text (1.25rem)', color: false },
];

const scrollbarTokens: TokenProp[] = [
  { name: '--move-scrollbar-thumb', default: 'var(--move-gray-700)', description: 'Scrollbar thumb color', color: true },
  { name: '--move-scrollbar-track', default: 'transparent', description: 'Scrollbar track color', color: false },
];

const shadowTokens: TokenProp[] = [
  { name: '--move-shadow-subtle', default: 'var(--move-shadow-sm)', description: 'Subtle elevation', color: false },
  { name: '--move-shadow-default', default: 'var(--move-shadow-md)', description: 'Default elevation', color: false },
  { name: '--move-shadow-elevated', default: 'var(--move-shadow-lg)', description: 'Elevated surface', color: false },
  { name: '--move-shadow-overlay', default: 'var(--move-shadow-xl)', description: 'Overlay / modal shadow', color: false },
];

const motionTokens: TokenProp[] = [
  { name: '--move-transition-fast', default: 'var(--move-duration-fast)', description: 'Fast transition (100ms)', color: false },
  { name: '--move-transition-normal', default: 'var(--move-duration-normal)', description: 'Normal transition (200ms)', color: false },
  { name: '--move-transition-slow', default: 'var(--move-duration-slow)', description: 'Slow transition (300ms)', color: false },
  { name: '--move-ease-default', default: 'var(--move-ease-out)', description: 'Default easing curve', color: false },
  { name: '--move-ease-interactive', default: 'var(--move-ease-spring)', description: 'Interactive element easing', color: false },
  { name: '--move-ease-enter', default: 'var(--move-ease-overlay-in)', description: 'Enter / appear easing', color: false },
  { name: '--move-ease-exit', default: 'var(--move-ease-overlay-out)', description: 'Exit / disappear easing', color: false },
];

const layerTokens: TokenProp[] = [
  { name: '--move-layer-base', default: 'var(--move-z-base)', description: 'Base layer (0)', color: false },
  { name: '--move-layer-dropdown', default: 'var(--move-z-dropdown)', description: 'Dropdown menus', color: false },
  { name: '--move-layer-overlay', default: 'var(--move-z-overlay)', description: 'Overlays / backdrops', color: false },
  { name: '--move-layer-modal', default: 'var(--move-z-modal)', description: 'Modal dialogs', color: false },
  { name: '--move-layer-popover', default: 'var(--move-z-popover)', description: 'Popovers', color: false },
  { name: '--move-layer-toast', default: 'var(--move-z-toast)', description: 'Toast notifications', color: false },
  { name: '--move-layer-tooltip', default: 'var(--move-z-tooltip)', description: 'Tooltips (highest)', color: false },
];

// =============================================================================
// Heading styles
// =============================================================================

const groupHeadingStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-lg)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  margin: '0 0 var(--move-spacing-sm) 0',
  paddingTop: 'var(--move-spacing-xl)',
};

// =============================================================================
// Demo
// =============================================================================

export function DesignTokensDemo() {
  return (
    <DocPage.Root>
      <DocPage.Header
        title="Design Tokens"
        description="The complete reference for Move's semantic tokens. These purpose-based variables map to primitives and drive every component."
      />

      {/* Colors */}
      <h3 style={groupHeadingStyle}>Colors</h3>
      <DocPage.TokenSection title="Background" tokens={bgTokens} />
      <DocPage.TokenSection title="Foreground" tokens={fgTokens} />
      <DocPage.TokenSection title="Border" tokens={borderTokens} />
      <DocPage.TokenSection title="Primary" tokens={primaryTokens} />
      <DocPage.TokenSection title="Secondary" tokens={secondaryTokens} />
      <DocPage.TokenSection title="Success" tokens={successTokens} />
      <DocPage.TokenSection title="Warning" tokens={warningTokens} />
      <DocPage.TokenSection title="Error" tokens={errorTokens} />
      <DocPage.TokenSection title="Info" tokens={infoTokens} />

      {/* Interactive */}
      <h3 style={groupHeadingStyle}>Interactive</h3>
      <DocPage.TokenSection title="Focus Ring" tokens={focusTokens} />
      <DocPage.TokenSection title="Control Heights" tokens={controlTokens} />
      <DocPage.TokenSection title="Disabled" tokens={disabledTokens} />

      {/* Layout */}
      <h3 style={groupHeadingStyle}>Layout</h3>
      <DocPage.TokenSection title="Spacing" tokens={spacingTokens} />
      <DocPage.TokenSection title="Border Radius" tokens={radiusTokens} />

      {/* Typography */}
      <h3 style={groupHeadingStyle}>Typography</h3>
      <DocPage.TokenSection title="Fonts & Sizes" tokens={typographyTokens} />

      {/* Visual */}
      <h3 style={groupHeadingStyle}>Visual</h3>
      <DocPage.TokenSection title="Scrollbar" tokens={scrollbarTokens} />
      <DocPage.TokenSection title="Shadows" tokens={shadowTokens} />

      {/* Motion */}
      <h3 style={groupHeadingStyle}>Motion</h3>
      <DocPage.TokenSection title="Animation" tokens={motionTokens} />

      {/* Layering */}
      <h3 style={groupHeadingStyle}>Layering</h3>
      <DocPage.TokenSection title="Z-Index" tokens={layerTokens} />
    </DocPage.Root>
  );
}
