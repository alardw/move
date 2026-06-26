import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'chevron-right',
    text: 'Auto-injected separators between items — pass your own glyph (slash, chevron, dot) on Root and every separator picks it up.',
  },
  {
    icon: 'list-collapse',
    text: 'Collapsible overflow — long trails fold into an Ellipsis that expands on hover or click, so the trail never overflows the page header.',
  },
  {
    icon: 'eye',
    text: 'Renders as a real `<nav aria-label="Breadcrumb">` with an `<ol>` list — screen-reader users hear "Breadcrumb, list of N items" without you wiring labels.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/sidebar',
    name: 'Sidebar',
    reason: 'For primary navigation. Breadcrumb is the secondary "where you are" trail above the page content.',
  },
  {
    to: '/components/tabs',
    name: 'Tabs',
    reason: 'When the navigation is between sibling views, not a hierarchical path.',
  },
];

export const meta: ComponentMeta = {
  slug: 'breadcrumb',
  name: 'Breadcrumb',
  tagline: 'A trail of links showing the path from root to current page — with auto-separators, collapsible overflow, and the right ARIA semantics.',
  categories: ['navigation'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { Breadcrumb } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the next link.' },
    { key: 'Enter', action: 'Activates the focused link.' },
  ],
  accessibilityLede:
    'Root renders `<nav aria-label="Breadcrumb">` with an `<ol>` list. The current page is a `<span aria-current="page">` (not a link), so screen readers know which one you’re on. Separators are decorative and `aria-hidden`.',
};
