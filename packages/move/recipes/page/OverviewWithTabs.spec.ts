// OverviewWithTabs.spec.ts — Recipe specification
//
// NOTE: the current source hardcodes a few strings inside the Overview tab
// (the "Revenue" / "Recent Sales" card titles and their placeholder copy).
// `recipe-validate` will flag those until they are moved into the labels below.

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'OverviewWithTabs',
  slug: 'overview-with-tabs',
  group: 'Pages',
  groupSlug: 'pages',
  title: 'Overview with tabs',
  description: 'Tabbed dashboard with overview stats, analytics, and reports sections.',
  synonyms: ['dashboard', 'tabs', 'analytics', 'reports', 'stats'],
  composition: ['Stack', 'Grid', 'Card', 'Heading', 'Text', 'Tabs', 'Icon'],
  behaviors: [
    'Tabs switch between Overview, Analytics, and Reports.',
    'The Overview tab shows 4 KPI stat cards (collapsing below 640px) plus two content cards (collapsing below 640px).',
    'The Analytics and Reports tabs show placeholder content cards.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'stats',
      kind: 'data',
      description: 'Provide the real KPI figures (replaces SAMPLE_STATS).',
    },
    {
      id: 'analyticsContent',
      kind: 'data',
      description: 'Replace the analytics placeholder with real charts.',
    },
    {
      id: 'reportsContent',
      kind: 'data',
      description: 'Replace the reports placeholder with real exports.',
    },
  ],
  labels: [
    { key: 'title', default: 'Dashboard', description: 'Page title.' },
    { key: 'overview', default: 'Overview', description: 'Overview tab label.' },
    { key: 'analytics', default: 'Analytics', description: 'Analytics tab label.' },
    { key: 'reports', default: 'Reports', description: 'Reports tab label.' },
    {
      key: 'analyticsPlaceholder',
      default: 'Charts and analytics content',
      description: 'Analytics tab placeholder.',
    },
    {
      key: 'reportsPlaceholder',
      default: 'Reports and exports content',
      description: 'Reports tab placeholder.',
    },
  ],
  preview: { width: 'full' },
} satisfies RecipeSpec;
