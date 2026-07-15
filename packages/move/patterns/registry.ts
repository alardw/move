import type { DesignPatternSpec } from './spec-type';
import { itemGallery } from './item-gallery';
import { mediaTile } from './media-tile';
import { filter } from './filter';

/**
 * The design-pattern registry — the published catalogue behind the docs overview +
 * detail pages (the pattern analogue of the old recipe registry). An `available`
 * pattern carries its full `DesignPatternSpec` (drives the detail page); `planned`
 * ones are the roadmap from the brainstorm, shown but not yet openable.
 */

export type PatternScale = 'composite' | 'page' | 'feature' | 'shell';
export type PatternStatus = 'available' | 'planned';

export interface PatternMeta {
  slug: string;
  group: string;
  groupSlug: string;
  title: string;
  description: string;
  synonyms: string[];
  scale: PatternScale;
  status: PatternStatus;
  /** Present for `available` patterns — drives the detail page's spec sections. */
  spec?: DesignPatternSpec;
}

type Planned = Omit<PatternMeta, 'status' | 'spec' | 'groupSlug'>;
const groupSlug = (g: string) => g.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const planned = (p: Planned): PatternMeta => ({ ...p, groupSlug: groupSlug(p.group), status: 'planned' });

export const PATTERNS: PatternMeta[] = [
  {
    slug: 'item-gallery',
    group: 'Collections & data',
    groupSlug: groupSlug('Collections & data'),
    title: 'ItemGallery',
    description: itemGallery.intent,
    synonyms: [...itemGallery.synonyms],
    scale: 'composite',
    status: 'available',
    spec: itemGallery,
  },
  planned({ slug: 'data-table', group: 'Collections & data', title: 'DataTable', description: 'Rows × columns with sort, filter, selection, and paging.', synonyms: ['table', 'grid', 'datagrid'], scale: 'composite' }),
  {
    slug: 'filter',
    group: 'Collections & data',
    groupSlug: groupSlug('Collections & data'),
    title: 'Filter',
    description: filter.intent,
    synonyms: [...filter.synonyms],
    scale: 'composite',
    status: 'available',
    spec: filter,
  },
  planned({ slug: 'kanban-board', group: 'Collections & data', title: 'KanbanBoard', description: 'Columns of draggable cards with swimlanes and WIP limits.', synonyms: ['board', 'kanban'], scale: 'composite' }),
  planned({ slug: 'tree-view', group: 'Collections & data', title: 'TreeView', description: 'A hierarchy — files, nav, org — with selection and inline actions.', synonyms: ['tree', 'explorer'], scale: 'composite' }),

  planned({ slug: 'form', group: 'Forms & flows', title: 'Form', description: 'Fields, sections, validation, and submit — the base of most flows.', synonyms: ['form', 'input'], scale: 'composite' }),
  planned({ slug: 'auth-form', group: 'Forms & flows', title: 'AuthForm', description: 'A credential form parameterized by purpose × credentials × MFA × alternates.', synonyms: ['sign in', 'login', 'authentication', 'sign up'], scale: 'composite' }),
  planned({ slug: 'wizard', group: 'Forms & flows', title: 'Wizard', description: 'A multi-step flow with progress and step gating.', synonyms: ['stepper', 'multi-step'], scale: 'feature' }),
  planned({ slug: 'settings', group: 'Forms & flows', title: 'Settings', description: 'Grouped preferences with tabs/sections and an auto or explicit save model.', synonyms: ['preferences', 'options'], scale: 'composite' }),

  planned({ slug: 'app-shell', group: 'Navigation & shell', title: 'AppShell', description: 'Sidebar/topbar/content with a collapsible, multi-level nav and user menu.', synonyms: ['shell', 'layout', 'nav'], scale: 'shell' }),
  planned({ slug: 'dashboard', group: 'Navigation & shell', title: 'Dashboard', description: 'A grid of widgets, stats, and cards.', synonyms: ['dashboard', 'widgets'], scale: 'page' }),
  planned({ slug: 'detail-view', group: 'Navigation & shell', title: 'DetailView', description: 'A header with tabs/sections and related content.', synonyms: ['detail', 'record'], scale: 'page' }),

  planned({ slug: 'confirm-dialog', group: 'Overlays & feedback', title: 'ConfirmDialog', description: 'Confirm / destructive / form-in-dialog, keyed by severity.', synonyms: ['confirm', 'dialog', 'modal'], scale: 'composite' }),
  planned({ slug: 'empty-state', group: 'Overlays & feedback', title: 'EmptyState', description: 'Illustration + copy + action, keyed by reason (empty/error/first-run).', synonyms: ['empty', 'zero state'], scale: 'composite' }),
  planned({ slug: 'notification-center', group: 'Overlays & feedback', title: 'NotificationCenter', description: 'Transient toasts plus a persistent inbox.', synonyms: ['notifications', 'toasts', 'inbox'], scale: 'composite' }),

  {
    slug: 'media-tile',
    group: 'Composed primitives',
    groupSlug: groupSlug('Composed primitives'),
    title: 'MediaTile',
    description: mediaTile.intent,
    synonyms: [...mediaTile.synonyms],
    scale: 'composite',
    status: 'available',
    spec: mediaTile,
  },
  planned({ slug: 'profile-header', group: 'Composed primitives', title: 'ProfileHeader', description: 'Avatar + identity + stats + actions for an entity.', synonyms: ['profile', 'header', 'entity'], scale: 'composite' }),
];

export const PATTERN_GROUPS: string[] = [...new Set(PATTERNS.map((p) => p.group))];

export function getPattern(slug: string): PatternMeta | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}

/** The CHILD patterns this pattern delegates to — the `designPattern` slugs in its skeleton
 *  (composition, downward). Derived from the spec, so it can't drift. */
export function childPatternSlugs(slug: string): string[] {
  const spec = getPattern(slug)?.spec;
  if (!spec) return [];
  return [...new Set(spec.skeleton.map((s) => s.designPattern).filter((d): d is string => !!d))];
}

/** The PARENT patterns that use this one — every registered pattern whose skeleton delegates a
 *  slot to this slug (the inverse of `childPatternSlugs`, upward). */
export function parentPatternSlugs(slug: string): string[] {
  return PATTERNS.filter((p) =>
    p.spec?.skeleton.some((s) => s.designPattern === slug),
  ).map((p) => p.slug);
}
