// ListBasic.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'ListBasic',
  slug: 'list',
  group: 'Pages',
  groupSlug: 'pages',
  title: 'List page',
  description: 'Searchable data table with pagination and an empty state.',
  synonyms: ['list page', 'data table', 'index', 'records', 'pagination'],
  composition: [
    'Stack',
    'Heading',
    'Text',
    'Card',
    'Table',
    'Badge',
    'Button',
    'InputText',
    'Pagination',
    'EmptyState',
    'Icon',
    'Avatar',
    'usePagination',
  ],
  behaviors: [
    'Page header with title, description, and an add action.',
    'Search filters rows by name and email; searching resets to page 1.',
    'Table renders each user with avatar, role, project, and status badges.',
    'Pagination shows 5 rows per page and only appears when results exceed one page; a total count is shown.',
    'An EmptyState is shown when no rows match.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'data',
      kind: 'data',
      description: 'Provide the real users to display (replaces SAMPLE_USERS).',
    },
    { id: 'onAddUser', kind: 'handler', description: 'Handle the add-user action.' },
  ],
  labels: [
    { key: 'title', default: 'Users', description: 'Page title.' },
    {
      key: 'description',
      default: 'Manage your team members and their roles.',
      description: 'Page description.',
    },
    { key: 'addUser', default: 'Add User', description: 'Add button text.' },
    { key: 'searchPlaceholder', default: 'Search users...', description: 'Search placeholder.' },
    { key: 'name', default: 'Name', description: 'Name column header.' },
    { key: 'email', default: 'Email', description: 'Email column header.' },
    { key: 'role', default: 'Role', description: 'Role column header.' },
    { key: 'status', default: 'Status', description: 'Status column header.' },
    { key: 'project', default: 'Project', description: 'Project column header.' },
    { key: 'emptyTitle', default: 'No users found', description: 'Empty-state title.' },
    {
      key: 'emptyDescription',
      default: 'Try adjusting your search or add a new user.',
      description: 'Empty-state description.',
    },
  ],
  preview: { width: 'full' },
} satisfies RecipeSpec;
