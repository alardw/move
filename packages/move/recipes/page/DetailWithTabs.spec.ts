// DetailWithTabs.spec.ts — Recipe specification

import type { CompositionSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'DetailWithTabs',
  composition: [
    'Stack',
    'Heading',
    'Text',
    'Card',
    'Badge',
    'Breadcrumb',
    'Button',
    'Tabs',
    'List',
    'Timeline',
    'Icon',
    'Avatar',
    'Table',
  ],
  behaviors: [
    'Shows a breadcrumb trail to the entity.',
    'Header with title, status badge, description, and an edit action.',
    'Tabs switch between Details (description list), Activity (timeline), and Related (table).',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'entity',
      kind: 'data',
      description:
        'Provide the real entity — name, status, description, detail fields (replaces the sample entity).',
    },
    {
      id: 'activity',
      kind: 'data',
      description: 'Provide the real activity entries (replaces SAMPLE_ACTIVITY).',
    },
    {
      id: 'related',
      kind: 'data',
      description: 'Provide the real related items (replaces SAMPLE_RELATED).',
    },
    { id: 'onEdit', kind: 'handler', description: 'Handle the edit action.' },
  ],
  labels: [
    { key: 'home', default: 'Home', description: 'Breadcrumb: home.' },
    { key: 'projects', default: 'Projects', description: 'Breadcrumb: collection.' },
    { key: 'name', default: 'Website Redesign', description: 'Entity name.' },
    { key: 'status', default: 'In Progress', description: 'Status badge value.' },
    {
      key: 'description',
      default: 'Complete redesign of the marketing website with new brand guidelines.',
      description: 'Entity description.',
    },
    { key: 'edit', default: 'Edit', description: 'Edit button text.' },
    { key: 'details', default: 'Details', description: 'Details tab label.' },
    { key: 'activity', default: 'Activity', description: 'Activity tab label.' },
    { key: 'related', default: 'Related', description: 'Related tab label.' },
  ],
} satisfies CompositionSpec;
