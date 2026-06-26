/**
 * Component taxonomy — one functional axis, in deliberate browse order.
 *
 * Each component's `meta.categories` references these ids; `categories[0]` is
 * its canonical home (drives sorting + the detail-page category badge). A
 * component may list a second category when a user would genuinely look for it
 * there (e.g. Button under both Actions and Forms).
 */
export interface TaxonomyCategory {
  /** Stable id — matches the source folder + spec.category. */
  id: string;
  /** Display label (chips, group headers, detail badge). */
  label: string;
  /** Lucide icon name for the category badge. */
  icon: string;
}

export const TAXONOMY: readonly TaxonomyCategory[] = [
  { id: 'actions', label: 'Actions', icon: 'mouse-pointer-click' },
  { id: 'forms', label: 'Forms', icon: 'text-cursor-input' },
  { id: 'date-time', label: 'Date & Time', icon: 'calendar-clock' },
  { id: 'navigation', label: 'Navigation', icon: 'compass' },
  { id: 'overlays', label: 'Overlays', icon: 'layers' },
  { id: 'feedback', label: 'Feedback', icon: 'megaphone' },
  { id: 'data-display', label: 'Data Display', icon: 'table' },
  { id: 'disclosure', label: 'Disclosure', icon: 'chevrons-down-up' },
  { id: 'layout', label: 'Layout', icon: 'layout' },
  { id: 'typography', label: 'Typography', icon: 'type' },
  { id: 'media', label: 'Media', icon: 'image' },
];

export const TAXONOMY_BY_ID: Record<string, TaxonomyCategory> = Object.fromEntries(
  TAXONOMY.map((c) => [c.id, c]),
);

/** Category ids in canonical browse order. */
export const CATEGORY_ORDER: readonly string[] = TAXONOMY.map((c) => c.id);
