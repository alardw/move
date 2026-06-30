import type { HighlightItem } from '../../components/HighlightList';
import type { RelatedItem } from '../../components/RelatedComponents';

export interface ComponentBadge {
  icon: string;
  label: string;
}

export interface KeyboardRow {
  key: string;
  action: string;
}

export interface ComponentSample {
  id: string;
  title: string;
  render: React.ComponentType;
  code: string;
}

/**
 * Named preview-panel widths (px) — the single source of truth so component
 * previews stay visually consistent instead of using ad-hoc pixel values.
 */
export const PREVIEW_WIDTHS = { xs: 280, sm: 340, md: 420, lg: 500, full: 560 } as const;

export type PreviewWidth = 'fit' | keyof typeof PREVIEW_WIDTHS;

/**
 * How a component renders in the overview's isometric preview card. Co-located
 * with the rest of a component's docs metadata so each component declares its
 * own preview behaviour — instead of central allow/deny lists.
 */
export interface ComponentPreview {
  /**
   * Panel width. `'fit'` hugs the content (atoms — Badge, Switch). The named
   * sizes are fixed widths from `PREVIEW_WIDTHS`, so long content wraps and
   * components share a consistent scale. `'full'` (default, 560px) is the
   * desktop width that width:100% components (Table, inputs) need.
   */
  width?: PreviewWidth;
  /**
   * `true` for components that are their own surface (Alert, Card, Toast):
   * drop the white preview panel so it isn't a card-in-a-card; the component's
   * own surface floats with a drop-shadow.
   */
  bare?: boolean;
  /**
   * Which sample (by its `id`) to render in the preview card. Defaults to the
   * first sample — set this when a later sample reads better as the thumbnail
   * (e.g. an open-state sample for an overlay).
   */
  sample?: string;
  /**
   * Optional pre-rendered preview image (e.g. an automated screenshot, or an
   * open-state shot for portalled overlays). When set it replaces the live
   * render in the card.
   */
  image?: string;
}

export interface ComponentDocument {
  /** Route slug, e.g. "select". */
  slug: string;
  /** Search synonyms / aliases for docs search. Document/discovery metadata —
   *  moved here from the component spec, which now holds substance only. */
  synonyms: string[];
  /** Display name used in headings and breadcrumbs. */
  name: string;
  /** Short descriptor shown under the page title. */
  tagline: string;
  /** Taxonomy category ids (see taxonomies.ts); categories[0] = canonical home. */
  categories: string[];
  /** Trait badges under the title (Animated, etc.) — the category badge is
   *  derived from `categories[0]`, so these no longer carry the category. */
  badges: ComponentBadge[];
  /** Bullet list of what makes this component notable. */
  highlights: HighlightItem[];
  /** Cross-references to sibling components. */
  related: RelatedItem[];
  /** Import snippet shown under "Installation". */
  importCode?: string;
  /** Keyboard map rows for the accessibility section. */
  keyboard: KeyboardRow[];
  /** Optional override for the accessibility lede. */
  accessibilityLede?: string;
  /** Optional override for the samples section title. */
  samplesTitle?: string;
  /** How this component renders in the overview's isometric preview card. */
  preview?: ComponentPreview;
}

export interface ComponentContent {
  meta: ComponentDocument;
  samples: ComponentSample[];
  /** Reference to the Move component spec — drives Props and Tokens tables.
   *  Shape is the loosely-typed `spec` exported from each component's
   *  `.spec.ts`; the template narrows `subComponents` and `tokens` at render. */
  spec: Record<string, unknown>;
  /**
   * Card-only preview render, separate from `samples`. For portalled overlays
   * whose spec sets `preview.staged`: a `StagedOverlay`-wrapped open snapshot
   * shown in the overview card but kept out of the interactive page samples.
   */
  preview?: React.ComponentType;
}
