import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'panel-left',
    text: 'Collapses to an icon-only rail on desktop and slides in as an overlay on mobile — one component, two layouts, no media-query gymnastics in your app code.',
  },
  {
    icon: 'rabbit',
    text: 'Nav items stagger in on first paint and on every collapse toggle — width animates with a spring, labels fade, badges tuck away, the whole thing settles instead of snapping.',
  },
  {
    icon: 'message-square',
    text: 'Pass a `tooltip` to each NavItem and the collapsed rail grows real labels on hover — discoverability without giving up the icons-only space saving.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/drawer',
    name: 'Drawer',
    reason: 'Use when the panel is transient — file pickers, detail views, settings flows that close after the user is done.',
  },
  {
    to: '/components/tabs',
    name: 'Tabs',
    reason: 'For switching between a small fixed set of views without leaving the page. Sidebar is for actual navigation.',
  },
];

export const meta: ComponentDocument = {
  slug: 'sidebar',
  synonyms: ['side nav', 'navigation rail', 'app rail', 'app shell', 'side menu'],
  name: 'Sidebar',
  tagline: 'A collapsible navigation aside that does the right thing on every screen — full labels on desktop, icons-only when collapsed, an overlay sheet on mobile.',
  categories: ['navigation'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Sidebar } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the next item or trigger.' },
    { key: 'Shift + Tab', action: 'Moves focus backwards.' },
    { key: 'Enter / Space', action: 'Activates the focused item or trigger.' },
  ],
  accessibilityLede:
    'Destinations live in a `Sidebar.Nav` — a navigation landmark around a real list, named by the `Sidebar.GroupLabel` beside it — so the sidebar announces as "Workspace navigation, list, 5 items" rather than as a run of unlabelled controls. Each `Sidebar.NavItem` is a link, and the one you are on carries `aria-current="page"`. Nav items stay focusable through the whole collapse/expand cycle; their labels are hidden with width and opacity rather than `display: none`, so they still name the link while the rail is narrow. Tooltips on collapsed items use Radix Tooltip and inherit its full accessibility contract.'
};
