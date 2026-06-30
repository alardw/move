// ListSplitPane.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'ListSplitPane',
  slug: 'list-split-pane',
  group: 'Pages',
  groupSlug: 'pages',
  title: 'Split-pane list',
  description: 'Master-detail inbox layout with a resizable split pane.',
  synonyms: ['split pane', 'master detail', 'inbox', 'two pane', 'resizable'],
  composition: [
    'Stack',
    'Heading',
    'Text',
    'Splitter',
    'ScrollArea',
    'List',
    'Badge',
    'Button',
    'Divider',
    'Icon',
    'Avatar',
  ],
  behaviors: [
    'Master-detail layout in a resizable Splitter that collapses below 640px.',
    'The left pane lists messages with avatar, unread badge, subject, and time.',
    'Selecting a message shows its detail in the right pane; with none selected, an empty prompt is shown.',
    'A selected message offers reply, forward, and archive actions.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'messages',
      kind: 'data',
      description: 'Provide the real messages (replaces SAMPLE_MESSAGES).',
    },
    { id: 'onReply', kind: 'handler', description: 'Handle the reply action.' },
    { id: 'onForward', kind: 'handler', description: 'Handle the forward action.' },
    { id: 'onArchive', kind: 'handler', description: 'Handle the archive action.' },
    { id: 'onCompose', kind: 'handler', description: 'Handle the compose action.' },
  ],
  labels: [
    { key: 'title', default: 'Inbox', description: 'Page title.' },
    { key: 'compose', default: 'Compose', description: 'Compose button text.' },
    { key: 'selectMessage', default: 'Select a message', description: 'Empty-detail title.' },
    {
      key: 'selectMessageDescription',
      default: 'Choose a conversation from the list to view its contents.',
      description: 'Empty-detail description.',
    },
    { key: 'reply', default: 'Reply', description: 'Reply action text.' },
    { key: 'forward', default: 'Forward', description: 'Forward action text.' },
    { key: 'archive', default: 'Archive', description: 'Archive action text.' },
  ],
  preview: { width: 'full' },
} satisfies RecipeSpec;
