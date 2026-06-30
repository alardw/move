// DetailBasic.spec.ts — Recipe specification

import type { CompositionSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'DetailBasic',
  composition: [
    'Stack',
    'Heading',
    'Text',
    'Card',
    'Badge',
    'Breadcrumb',
    'Button',
    'List',
    'Icon',
    'Grid',
    'Avatar',
    'Accordion',
    'Table',
  ],
  behaviors: [
    'Shows a breadcrumb trail to the entity.',
    'Header with avatar, name, status badge, and an edit action.',
    'Responsive 3-column grid: a details card (2/3) beside a notes card (1/3), collapsing below 768px.',
    'A description list renders the entity fields.',
    'A settings accordion (team / integrations / activity) is open by default (type="multiple").',
    'Team and integrations render as lists; activity renders as a table.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'entity',
      kind: 'data',
      description:
        'Provide the real entity — name, role, detail fields (replaces the sample entity).',
    },
    {
      id: 'team',
      kind: 'data',
      description: 'Provide the real team members (replaces SAMPLE_TEAM).',
    },
    {
      id: 'integrations',
      kind: 'data',
      description: 'Provide the real integrations (replaces SAMPLE_INTEGRATIONS).',
    },
    {
      id: 'activity',
      kind: 'data',
      description: 'Provide the real activity log (replaces SAMPLE_ACTIVITY).',
    },
    { id: 'onEdit', kind: 'handler', description: 'Handle the edit action.' },
  ],
  labels: [
    { key: 'home', default: 'Home', description: 'Breadcrumb: home.' },
    { key: 'users', default: 'Users', description: 'Breadcrumb: collection.' },
    { key: 'name', default: 'Alice Johnson', description: 'Entity name.' },
    { key: 'role', default: 'Senior Engineer', description: 'Entity role.' },
    { key: 'edit', default: 'Edit', description: 'Edit button text.' },
    { key: 'detailsTitle', default: 'Details', description: 'Details card title.' },
    { key: 'status', default: 'Status', description: 'Status field label.' },
    { key: 'statusValue', default: 'Active', description: 'Status badge value.' },
    { key: 'notesTitle', default: 'Notes', description: 'Notes card title.' },
    {
      key: 'notesContent',
      default:
        'Leads the frontend platform team. Primary contact for design system adoption. Joined from Google where she led the Material Design web components team.',
      description: 'Notes body.',
    },
    { key: 'settingsTitle', default: 'Settings', description: 'Settings card title.' },
    { key: 'teamTitle', default: 'Team Access', description: 'Team accordion title.' },
    {
      key: 'integrationsTitle',
      default: 'Integrations',
      description: 'Integrations accordion title.',
    },
    { key: 'activityTitle', default: 'Activity Log', description: 'Activity accordion title.' },
  ],
} satisfies CompositionSpec;
