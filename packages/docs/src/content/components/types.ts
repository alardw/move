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

export interface ComponentMeta {
  /** Route slug, e.g. "select". */
  slug: string;
  /** Display name used in headings and breadcrumbs. */
  name: string;
  /** Short descriptor shown under the page title. */
  tagline: string;
  /** Badges under the title — category and traits. */
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
}

export interface ComponentContent {
  meta: ComponentMeta;
  samples: ComponentSample[];
  /** Reference to the Move component spec — drives Props and Tokens tables.
   *  Shape is the loosely-typed `spec` exported from each component's
   *  `.spec.ts`; the template narrows `subComponents` and `tokens` at render. */
  spec: Record<string, unknown>;
}
