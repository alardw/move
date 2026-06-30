import type { ComponentType } from 'react';
import type { CompositionSpec, RecipeDocument } from './spec-type';

import SignIn from './authentication/SignIn';
import SignInSrc from './authentication/SignIn.tsx?raw';
import { spec as signInSpec } from './authentication/SignIn.spec';
import ForgotPassword from './authentication/ForgotPassword';
import ForgotPasswordSrc from './authentication/ForgotPassword.tsx?raw';
import { spec as forgotPasswordSpec } from './authentication/ForgotPassword.spec';
import ResetPassword from './authentication/ResetPassword';
import ResetPasswordSrc from './authentication/ResetPassword.tsx?raw';
import { spec as resetPasswordSpec } from './authentication/ResetPassword.spec';
import MfaSetup from './authentication/MfaSetup';
import MfaSetupSrc from './authentication/MfaSetup.tsx?raw';
import { spec as mfaSetupSpec } from './authentication/MfaSetup.spec';
import MfaVerify from './authentication/MfaVerify';
import MfaVerifySrc from './authentication/MfaVerify.tsx?raw';
import { spec as mfaVerifySpec } from './authentication/MfaVerify.spec';

import SearchFilter from './data/SearchFilter';
import SearchFilterSrc from './data/SearchFilter.tsx?raw';
import { spec as searchFilterSpec } from './data/SearchFilter.spec';
import FilterableDataTable from './data/FilterableDataTable';
import FilterableDataTableSrc from './data/FilterableDataTable.tsx?raw';
import { spec as filterableDataTableSpec } from './data/FilterableDataTable.spec';

import AppSidebar from './navigation/AppSidebar';
import AppSidebarSrc from './navigation/AppSidebar.tsx?raw';
import { spec as appSidebarSpec } from './navigation/AppSidebar.spec';

import DetailBasic from './page/DetailBasic';
import DetailBasicSrc from './page/DetailBasic.tsx?raw';
import { spec as detailBasicSpec } from './page/DetailBasic.spec';
import DetailWithTabs from './page/DetailWithTabs';
import DetailWithTabsSrc from './page/DetailWithTabs.tsx?raw';
import { spec as detailWithTabsSpec } from './page/DetailWithTabs.spec';
import ListBasic from './page/ListBasic';
import ListBasicSrc from './page/ListBasic.tsx?raw';
import { spec as listBasicSpec } from './page/ListBasic.spec';
import ListSplitPane from './page/ListSplitPane';
import ListSplitPaneSrc from './page/ListSplitPane.tsx?raw';
import { spec as listSplitPaneSpec } from './page/ListSplitPane.spec';
import OverviewBasic from './page/OverviewBasic';
import OverviewBasicSrc from './page/OverviewBasic.tsx?raw';
import { spec as overviewBasicSpec } from './page/OverviewBasic.spec';
import OverviewWithTabs from './page/OverviewWithTabs';
import OverviewWithTabsSrc from './page/OverviewWithTabs.tsx?raw';
import { spec as overviewWithTabsSpec } from './page/OverviewWithTabs.spec';

export type { RecipePreview } from './spec-type';

/**
 * A recipe's registry entry: a published composition. It carries the composition
 * SUBSTANCE (`spec`), the live component + `?raw` source (which a spec can't
 * hold), and the `RecipeDocument` publishing metadata (slug/group/title/…). The doc
 * fields are authored HERE — publishing is a registry concern, not spec data.
 */
export interface RecipeMeta extends RecipeDocument {
  /** The live recipe component (rendered in the card preview and on the detail page). */
  Component: ComponentType<{ labels?: Record<string, string> }>;
  /** Recipe source, for the detail page's code view. */
  source: string;
  /** The composition substance — drives the detail page's spec-derived sections. */
  spec: CompositionSpec;
}

/** Build a registry entry from a composition spec + its component, source, and doc. */
function toMeta(
  spec: CompositionSpec,
  Component: ComponentType<{ labels?: Record<string, string> }>,
  source: string,
  doc: RecipeDocument,
): RecipeMeta {
  return { ...doc, Component, source, spec };
}

export const RECIPES: RecipeMeta[] = [
  toMeta(signInSpec, SignIn, SignInSrc, {
    slug: 'sign-in',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Sign in',
    description: 'Email + password login with a remember-me toggle and a forgot-password link.',
    synonyms: ['login', 'log in', 'signin', 'sign on', 'credentials', 'authentication'],
    preview: { bare: true, width: 'md' },
  }),
  toMeta(forgotPasswordSpec, ForgotPassword, ForgotPasswordSrc, {
    slug: 'forgot-password',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Forgot password',
    description: 'Request a password-reset link by email, with a back-to-sign-in link.',
    synonyms: ['reset', 'recover', 'password recovery', 'forgot', 'email reset'],
    preview: { bare: true, width: 'md' },
  }),
  toMeta(resetPasswordSpec, ResetPassword, ResetPasswordSrc, {
    slug: 'reset-password',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Reset password',
    description: 'Choose a new password with a confirmation field.',
    synonyms: ['new password', 'change password', 'set password', 'reset'],
    preview: { bare: true, width: 'md' },
  }),
  toMeta(mfaSetupSpec, MfaSetup, MfaSetupSrc, {
    slug: 'mfa-setup',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'MFA setup',
    description: 'Enroll in two-factor auth: scan a QR code and confirm with a one-time code.',
    synonyms: ['two-factor', '2fa', 'mfa', 'totp', 'authenticator', 'qr code', 'enroll'],
    preview: { bare: true, width: 'md' },
  }),
  toMeta(mfaVerifySpec, MfaVerify, MfaVerifySrc, {
    slug: 'mfa-verify',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'MFA verify',
    description: 'Enter a six-digit one-time code to complete two-factor sign-in.',
    synonyms: ['two-factor', '2fa', 'mfa', 'otp', 'one-time code', 'verify', 'totp'],
    preview: { bare: true, width: 'md' },
  }),

  toMeta(searchFilterSpec, SearchFilter, SearchFilterSrc, {
    slug: 'search-filter',
    group: 'Data',
    groupSlug: 'data',
    title: 'Search & filter',
    description: 'Search input with a filter dialog and active filter chips over a live list.',
    synonyms: ['search', 'filter', 'chips', 'facets', 'query'],
    preview: { width: 'lg' },
  }),
  toMeta(filterableDataTableSpec, FilterableDataTable, FilterableDataTableSrc, {
    slug: 'filterable-data-table',
    group: 'Data',
    groupSlug: 'data',
    title: 'Filterable data table',
    description: 'Full-featured data table with search, filters, sorting, and pagination.',
    synonyms: ['data table', 'datagrid', 'grid', 'table', 'sort', 'filter', 'pagination', 'search'],
    preview: { width: 'full' },
  }),

  toMeta(appSidebarSpec, AppSidebar, AppSidebarSrc, {
    slug: 'app-sidebar',
    group: 'Navigation',
    groupSlug: 'navigation',
    title: 'App sidebar',
    description: 'Collapsible sidebar with mobile overlay, account dropdown, and i18n support.',
    synonyms: ['sidebar', 'navigation', 'nav', 'app shell', 'drawer', 'menu'],
    preview: { width: 'full' },
  }),

  toMeta(detailBasicSpec, DetailBasic, DetailBasicSrc, {
    slug: 'detail',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Detail page',
    description: 'Entity detail page with breadcrumbs, a description list, and a sidebar notes card.',
    synonyms: ['detail page', 'entity', 'record', 'description list'],
    preview: { width: 'full' },
  }),
  toMeta(detailWithTabsSpec, DetailWithTabs, DetailWithTabsSrc, {
    slug: 'detail-with-tabs',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Detail page with tabs',
    description: 'Entity detail with tabbed sections for details, an activity timeline, and related items.',
    synonyms: ['detail', 'tabs', 'tabbed', 'activity', 'timeline'],
    preview: { width: 'full' },
  }),
  toMeta(listBasicSpec, ListBasic, ListBasicSrc, {
    slug: 'list',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'List page',
    description: 'Searchable data table with pagination and an empty state.',
    synonyms: ['list page', 'data table', 'index', 'records', 'pagination'],
    preview: { width: 'full' },
  }),
  toMeta(listSplitPaneSpec, ListSplitPane, ListSplitPaneSrc, {
    slug: 'list-split-pane',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Split-pane list',
    description: 'Master-detail inbox layout with a resizable split pane.',
    synonyms: ['split pane', 'master detail', 'inbox', 'two pane', 'resizable'],
    preview: { width: 'full' },
  }),
  toMeta(overviewBasicSpec, OverviewBasic, OverviewBasicSrc, {
    slug: 'overview',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Overview page',
    description: 'Dashboard overview with KPI stat cards and a recent-activity feed.',
    synonyms: ['dashboard', 'overview', 'kpi', 'stats', 'metrics', 'home'],
    preview: { width: 'full' },
  }),
  toMeta(overviewWithTabsSpec, OverviewWithTabs, OverviewWithTabsSrc, {
    slug: 'overview-with-tabs',
    group: 'Pages',
    groupSlug: 'pages',
    title: 'Overview with tabs',
    description: 'Tabbed dashboard with overview stats, analytics, and reports sections.',
    synonyms: ['dashboard', 'tabs', 'analytics', 'reports', 'stats'],
    preview: { width: 'full' },
  }),
];

/** Group display names in display order. */
export const RECIPE_GROUPS: string[] = RECIPES.reduce<string[]>((acc, r) => {
  if (!acc.includes(r.group)) acc.push(r.group);
  return acc;
}, []);

export function getRecipe(groupSlug: string, slug: string): RecipeMeta | undefined {
  return RECIPES.find((r) => r.groupSlug === groupSlug && r.slug === slug);
}
