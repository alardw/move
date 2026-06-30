// AppSidebar.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'AppSidebar',
  slug: 'app-sidebar',
  group: 'Navigation',
  groupSlug: 'navigation',
  title: 'App sidebar',
  description: 'Collapsible sidebar with mobile overlay, account dropdown, and i18n support.',
  synonyms: ['sidebar', 'navigation', 'nav', 'app shell', 'drawer', 'menu'],
  composition: [
    'Sidebar',
    'useSidebarContext',
    'Avatar',
    'Icon',
    'Text',
    'Stack',
    'Tooltip',
    'Dropdown',
    'Button',
    'Badge',
  ],
  behaviors: [
    'The sidebar collapses and expands via a header toggle; collapsed shows icon-only items with tooltips.',
    'Below the breakpoint the sidebar becomes a mobile overlay sheet, opened by a mobile trigger.',
    'The active nav item is tracked and visually marked.',
    'A nav item can carry a count badge (e.g. chat = 3).',
    'The footer hosts an account dropdown (profile / billing / sign out) that collapses to an avatar + tooltip.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'navItems',
      kind: 'data',
      description: 'Provide the real nav items (replaces SAMPLE_NAV_ITEMS).',
    },
    {
      id: 'onNavigate',
      kind: 'handler',
      description: 'Handle nav item selection / routing and active-route detection.',
    },
    {
      id: 'account',
      kind: 'data',
      description: 'Provide the real user — name, role, avatar (replaces the sample account).',
    },
    {
      id: 'onSignOut',
      kind: 'handler',
      description: 'Sign the user out from the account dropdown.',
    },
  ],
  labels: [
    { key: 'appName', default: 'Acme', description: 'Product name in the header.' },
    {
      key: 'collapse',
      default: 'Collapse sidebar',
      description: 'Collapse control tooltip/label.',
    },
    { key: 'expand', default: 'Expand sidebar', description: 'Expand control tooltip/label.' },
    { key: 'home', default: 'Home', description: 'Home nav item.' },
    { key: 'chat', default: 'Chat', description: 'Chat nav item.' },
    { key: 'explore', default: 'Explore', description: 'Explore nav item.' },
    { key: 'projects', default: 'Projects', description: 'Projects nav item.' },
    { key: 'settings', default: 'Settings', description: 'Settings nav item.' },
    { key: 'help', default: 'Help & FAQ', description: 'Help nav item.' },
    { key: 'userName', default: 'Jane Cooper', description: 'Account name.' },
    { key: 'userRole', default: 'Pro plan', description: 'Account role/plan.' },
    { key: 'profile', default: 'Profile', description: 'Account menu: profile.' },
    { key: 'billing', default: 'Billing', description: 'Account menu: billing.' },
    { key: 'signOut', default: 'Sign out', description: 'Account menu: sign out.' },
    { key: 'menu', default: 'Open menu', description: 'Mobile trigger aria-label.' },
  ],
  preview: { width: 'full' },
} satisfies RecipeSpec;
