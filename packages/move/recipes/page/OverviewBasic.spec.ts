// OverviewBasic.spec.ts — Recipe specification

import type { CompositionSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'OverviewBasic',
  composition: [
    'Stack',
    'Grid',
    'Card',
    'Heading',
    'Text',
    'Badge',
    'Button',
    'Icon',
    'Avatar',
    'List',
    'Table',
  ],
  behaviors: [
    'KPI stat cards in a responsive 4-column grid that collapses below 640px.',
    'A 3-column grid pairs a recent-activity table (2/3) with a top-performers list (1/3), collapsing below 768px.',
    'Each stat card shows a label, value, icon, and a change badge.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'stats',
      kind: 'data',
      description: 'Provide the real KPI figures (replaces SAMPLE_STATS).',
    },
    {
      id: 'activities',
      kind: 'data',
      description: 'Provide the real activity feed (replaces SAMPLE_ACTIVITIES).',
    },
    {
      id: 'performers',
      kind: 'data',
      description: 'Provide the real top performers (replaces SAMPLE_PERFORMERS).',
    },
    { id: 'onViewAll', kind: 'handler', description: 'Handle the "view all" action.' },
  ],
  labels: [
    { key: 'title', default: 'Overview', description: 'Page title.' },
    { key: 'recentActivity', default: 'Recent Activity', description: 'Activity card title.' },
    { key: 'topPerformers', default: 'Top Performers', description: 'Performers card title.' },
    { key: 'viewAll', default: 'View all', description: 'View-all button text.' },
  ],
} satisfies CompositionSpec;
