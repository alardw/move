/**
 * Infrastructure Reference
 *
 * Hand-authored foundational modules that live in src/infrastructure/.
 * These do NOT use the factory pattern and are NOT spec-driven.
 * They provide context, utilities, and resolution that other components consume.
 *
 * Infrastructure components are stable and imported from the library root ('move').
 */

// =============================================================================
// Directory structure
// =============================================================================

export const INFRASTRUCTURE_PATH = 'src/infrastructure' as const;

export const INFRASTRUCTURE_MODULES = {
  Icon: {
    path: 'src/infrastructure/Icon',
    description: 'Icon rendering system with pluggable resolver and built-in fallbacks',
    exports: {
      Icon: 'Renders a named icon via IconProvider resolver. Props: { name, size?, color?, className?, aria-label?, aria-hidden? }. Sizes: xs (0.75em), sm (1em), md (1.25em), lg (1.5em), xl (2em), or number (px).',
      IconProvider: 'Context provider that supplies an icon resolver function. Props: { resolver: IconResolver, fallback?: ReactNode }. The resolver maps icon names to components or ReactNodes.',
      useIconContext: 'Hook to access the IconProvider context. Returns { resolver, fallback } or null.',
      useResolvedIcon: 'Hook for components that need to render built-in icons. Tries IconProvider resolver first, falls back to built-in SVGs. Signature: useResolvedIcon(name: string, size: number) => ReactNode | null.',
      BUILTIN_ICONS: 'Map of essential built-in SVG icons that always work without IconProvider: chevron-left, chevron-right, chevron-up, chevron-down, x, check, calendar, image-off, info, circle-check, triangle-alert, circle-x, eye, eye-off, file, upload, play, pause, volume-2, volume-x, captions, maximize, minimize, search, settings, pipette.',
    },
  },
  Theme: {
    path: 'src/infrastructure/Theme',
    description: 'Theme system with context-based token application',
    exports: {
      ThemeProvider: 'Applies theme tokens to the DOM. Top-level: sets tokens on document.documentElement. Nested: scopes tokens via wrapper div. Props: { theme: Theme, children }.',
      useTheme: 'Hook to access current theme context. Returns { theme, animation }.',
    },
  },
} as const;

// =============================================================================
// Import patterns for components that consume infrastructure
// =============================================================================

export const INFRASTRUCTURE_IMPORTS = {
  /**
   * For components that render built-in icons (e.g. Dialog.Close, Select.Trigger):
   * Use useResolvedIcon in setup(), render the result in the JSX.
   */
  useResolvedIcon: {
    internal: "import { useResolvedIcon } from '../../../infrastructure/Icon';",
    usage: `
// In setup():
const icon = useResolvedIcon('x', 16);

// In render():
{props.children ?? <span className={styles.iconSlot} aria-hidden="true">{icon}</span>}
`,
    description: 'Resolves an icon name to a ReactNode. Tries IconProvider resolver first, then built-in fallback SVGs. Always returns something for essential icons (x, check, chevron-*, etc.).',
  },

  /**
   * For stories and demos — import from library root:
   */
  storyImport: "import { Icon, Button } from 'move';",
} as const;

// =============================================================================
// Guidelines
// =============================================================================

export const INFRASTRUCTURE_GUIDELINES = {
  /**
   * When to use useResolvedIcon vs Icon component:
   *
   * - useResolvedIcon: Inside component source (e.g. Dialog.Close default icon).
   *   Returns raw ReactNode, no wrapper span. The component handles its own styling.
   *
   * - Icon component: In stories, demos, and consumer code.
   *   Full component with size/color/a11y props and wrapper span.
   */
  iconUsage: 'useResolvedIcon for component internals, Icon component for stories/demos/consumers',

  /**
   * Infrastructure modules are NOT spec-driven:
   * - No .spec.ts files
   * - /generate-source skips source generation
   * - /generate-demo, /generate-test, /generate-meta work by reading source directly
   * - /validate applies reduced rules (no factory checks)
   */
  noSpec: 'Infrastructure modules do not go through the spec → generate pipeline',

  /**
   * IconProvider is optional:
   * Components must always work without IconProvider by using useResolvedIcon
   * (which falls back to BUILTIN_ICONS). Never assume IconProvider is present.
   */
  iconProviderOptional: 'Always fall back to built-in icons — never require IconProvider',
} as const;
