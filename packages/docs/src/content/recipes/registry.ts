import type { ComponentType } from 'react';
import type { PreviewWidth } from '../components/types';

import SignIn from './authentication/SignIn';
import SignInSrc from './authentication/SignIn.tsx?raw';
import ForgotPassword from './authentication/ForgotPassword';
import ForgotPasswordSrc from './authentication/ForgotPassword.tsx?raw';
import ResetPassword from './authentication/ResetPassword';
import ResetPasswordSrc from './authentication/ResetPassword.tsx?raw';
import MfaSetup from './authentication/MfaSetup';
import MfaSetupSrc from './authentication/MfaSetup.tsx?raw';
import MfaVerify from './authentication/MfaVerify';
import MfaVerifySrc from './authentication/MfaVerify.tsx?raw';

import SearchFilter from './data/SearchFilter';
import SearchFilterSrc from './data/SearchFilter.tsx?raw';
import FilterableDataTable from './data/FilterableDataTable';
import FilterableDataTableSrc from './data/FilterableDataTable.tsx?raw';

import AppSidebar from './navigation/AppSidebar';
import AppSidebarSrc from './navigation/AppSidebar.tsx?raw';

import DetailBasic from './page/DetailBasic';
import DetailBasicSrc from './page/DetailBasic.tsx?raw';
import DetailWithTabs from './page/DetailWithTabs';
import DetailWithTabsSrc from './page/DetailWithTabs.tsx?raw';
import ListBasic from './page/ListBasic';
import ListBasicSrc from './page/ListBasic.tsx?raw';
import ListSplitPane from './page/ListSplitPane';
import ListSplitPaneSrc from './page/ListSplitPane.tsx?raw';
import OverviewBasic from './page/OverviewBasic';
import OverviewBasicSrc from './page/OverviewBasic.tsx?raw';
import OverviewWithTabs from './page/OverviewWithTabs';
import OverviewWithTabsSrc from './page/OverviewWithTabs.tsx?raw';

/**
 * How a recipe renders in the overview's preview card — the same model
 * components use (see `ComponentPreview`), so recipes and components share one
 * preview system. Co-located with each recipe's registry entry.
 */
export interface RecipePreview {
  /**
   * Panel width. `'fit'` hugs the content; the named sizes are fixed widths
   * from `PREVIEW_WIDTHS` so previews share a consistent scale. Defaults to
   * `'full'` — most recipes are full flows or layouts that need the room.
   */
  width?: PreviewWidth;
  /**
   * `true` when the recipe is its own surface (a Card — the auth flows): drop
   * the white preview panel so it isn't a card-in-a-card; the recipe's own
   * surface floats with a drop-shadow.
   */
  bare?: boolean;
  /**
   * Optional pre-rendered preview image. When set it replaces the live render
   * in the card — the path we'll switch to once recipe screenshots are
   * automated.
   */
  image?: string;
}

export interface RecipeMeta {
  /** URL slug within its group, e.g. 'sign-in'. */
  slug: string;
  /** Display name of the group, e.g. 'Authentication'. */
  group: string;
  /** URL slug of the group, e.g. 'authentication'. */
  groupSlug: string;
  title: string;
  description: string;
  /** The live recipe component (rendered in the card preview and on the detail page). */
  Component: ComponentType<{ labels?: Record<string, string> }>;
  /** Recipe source, for the detail page's code view. */
  source: string;
  /** How this recipe renders in the overview's preview card. */
  preview?: RecipePreview;
}

export const RECIPES: RecipeMeta[] = [
  {
    slug: 'sign-in',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Sign in',
    description: 'Email + password login with a remember-me toggle and a forgot-password link.',
    Component: SignIn,
    source: SignInSrc,
    preview: { bare: true, width: 'md' },
  },
  {
    slug: 'forgot-password',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Forgot password',
    description: 'Request a password-reset link by email, with a back-to-sign-in link.',
    Component: ForgotPassword,
    source: ForgotPasswordSrc,
    preview: { bare: true, width: 'md' },
  },
  {
    slug: 'reset-password',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Reset password',
    description: 'Choose a new password with a confirmation field.',
    Component: ResetPassword,
    source: ResetPasswordSrc,
    preview: { bare: true, width: 'md' },
  },
  {
    slug: 'mfa-setup',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'MFA setup',
    description: 'Enroll in two-factor auth: scan a QR code and confirm with a one-time code.',
    Component: MfaSetup,
    source: MfaSetupSrc,
    preview: { bare: true, width: 'md' },
  },
  {
    slug: 'mfa-verify',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'MFA verify',
    description: 'Enter a six-digit one-time code to complete two-factor sign-in.',
    Component: MfaVerify,
    source: MfaVerifySrc,
    preview: { bare: true, width: 'md' },
  },

  {
    slug: 'search-filter',
    group: 'Data',
    groupSlug: 'data',
    title: 'Search & filter',
    description: 'Search input with a filter dialog and active filter chips over a live list.',
    Component: SearchFilter,
    source: SearchFilterSrc,
    preview: { width: 'lg' },
  },
  {
    slug: 'filterable-data-table',
    group: 'Data',
    groupSlug: 'data',
    title: 'Filterable data table',
    description: 'Full-featured data table with search, filters, sorting, and pagination.',
    Component: FilterableDataTable,
    source: FilterableDataTableSrc,
    preview: { width: 'full' },
  },

  {
    slug: 'app-sidebar',
    group: 'Navigation',
    groupSlug: 'navigation',
    title: 'App sidebar',
    description: 'Collapsible sidebar with mobile overlay, account dropdown, and i18n support.',
    Component: AppSidebar,
    source: AppSidebarSrc,
    preview: { width: 'full' },
  },

  {
    slug: 'detail',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Detail page',
    description: 'Entity detail page with breadcrumbs, a description list, and a sidebar notes card.',
    Component: DetailBasic,
    source: DetailBasicSrc,
    preview: { width: 'full' },
  },
  {
    slug: 'detail-with-tabs',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Detail page with tabs',
    description: 'Entity detail with tabbed sections for details, an activity timeline, and related items.',
    Component: DetailWithTabs,
    source: DetailWithTabsSrc,
    preview: { width: 'full' },
  },
  {
    slug: 'list',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'List page',
    description: 'Searchable data table with pagination and an empty state.',
    Component: ListBasic,
    source: ListBasicSrc,
    preview: { width: 'full' },
  },
  {
    slug: 'list-split-pane',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Split-pane list',
    description: 'Master-detail inbox layout with a resizable split pane.',
    Component: ListSplitPane,
    source: ListSplitPaneSrc,
    preview: { width: 'full' },
  },
  {
    slug: 'overview',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Overview page',
    description: 'Dashboard overview with KPI stat cards and a recent-activity feed.',
    Component: OverviewBasic,
    source: OverviewBasicSrc,
    preview: { width: 'full' },
  },
  {
    slug: 'overview-with-tabs',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Overview with tabs',
    description: 'Tabbed dashboard with overview stats, analytics, and reports sections.',
    Component: OverviewWithTabs,
    source: OverviewWithTabsSrc,
    preview: { width: 'full' },
  },
];

/** Group display names in display order. */
export const RECIPE_GROUPS: string[] = RECIPES.reduce<string[]>((acc, r) => {
  if (!acc.includes(r.group)) acc.push(r.group);
  return acc;
}, []);

export function getRecipe(groupSlug: string, slug: string): RecipeMeta | undefined {
  return RECIPES.find((r) => r.groupSlug === groupSlug && r.slug === slug);
}
