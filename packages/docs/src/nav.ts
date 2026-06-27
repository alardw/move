/**
 * Docs navigation config. Single source of truth for the sidebar and routing.
 * Each section's first item is the section landing page (where clicking the
 * main label lands).
 *
 * The full originally-planned structure (Animation deep-dives, Theming
 * sub-pages, Recipes sub-categories, Reference section) lives in
 * `packages/docs/PLAN.md`. This nav is the pruned shipping version — entries
 * that don't have real content yet are kept out so visitors don't hit dead links.
 */
export interface NavItem {
  to: string;
  label: string;
}

export interface NavSection {
  key: string;
  label: string;
  icon: string;
  items: NavItem[];
}

export const DOCS_NAV: NavSection[] = [
  {
    key: 'getting-started',
    label: 'Getting started',
    icon: 'rocket',
    items: [
      { to: '/getting-started', label: 'Overview' },
      { to: '/getting-started/what-ai-gets-wrong', label: 'What AI Gets Wrong' },
      { to: '/getting-started/installation', label: 'Installation' },
      { to: '/getting-started/move-root', label: 'MoveRoot' },
      { to: '/getting-started/create-move-app', label: 'Create Move App' },
      { to: '/getting-started/vite', label: 'Vite' },
      { to: '/getting-started/next', label: 'Next.js' },
    ],
  },
  {
    key: 'core-concepts',
    label: 'Core Concepts',
    icon: 'brain',
    items: [
      { to: '/core-concepts', label: 'Overview' },
      { to: '/core-concepts/how-move-works', label: 'How Move Works' },
      { to: '/core-concepts/component-contract', label: 'Component Contract' },
      { to: '/core-concepts/animation-system', label: 'Animation System' },
      { to: '/core-concepts/theming-model', label: 'Theming Model' },
      { to: '/core-concepts/surfaces', label: 'Surfaces' },
      { to: '/core-concepts/stacking', label: 'Stacking' },
      { to: '/core-concepts/hooks', label: 'Hooks' },
    ],
  },
  {
    key: 'animation',
    label: 'Animation',
    icon: 'sparkles',
    items: [
      { to: '/animation', label: 'Overview' },
      { to: '/animation/lifecycle', label: 'Lifecycle' },
      { to: '/animation/triggers-and-sequences', label: 'Triggers & sequences' },
      { to: '/animation/springs', label: 'Springs & easings' },
      { to: '/animation/patterns', label: 'See it in action' },
      { to: '/animation/reference', label: 'Reference' },
    ],
  },
  {
    key: 'ai',
    label: 'AI',
    icon: 'bot',
    items: [
      { to: '/ai', label: 'Overview' },
      { to: '/ai/skills', label: 'Skills' },
      { to: '/ai/specs', label: 'Spec pipeline' },
    ],
  },
  {
    key: 'components',
    label: 'Components',
    icon: 'blocks',
    items: [
      { to: '/components', label: 'Overview' },
    ],
  },
  {
    key: 'recipes',
    label: 'Recipes',
    icon: 'book-open',
    items: [
      { to: '/recipes', label: 'Overview' },
    ],
  },
  {
    key: 'customize',
    label: 'Make it your own',
    icon: 'palette',
    items: [
      { to: '/customize', label: 'Overview' },
      { to: '/customize/typography', label: 'Typography' },
      { to: '/customize/icons', label: 'Icons' },
      { to: '/customize/internationalization', label: 'Internationalization' },
    ],
  },
];
