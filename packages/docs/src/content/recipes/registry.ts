import type { ComponentType } from 'react';
import type { RecipeSpec, RecipePreview } from './spec-type';

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
 * A recipe's registry entry. Metadata is DERIVED from the recipe's spec (the
 * source of truth) — never hand-authored here. The registry only adds the live
 * component and its `?raw` source, which a spec can't carry.
 */
export interface RecipeMeta {
  /** URL slug within its group, e.g. 'sign-in'. */
  slug: string;
  /** Display name of the group, e.g. 'Authentication'. */
  group: string;
  /** URL slug of the group, e.g. 'authentication'. */
  groupSlug: string;
  title: string;
  description: string;
  /** Search aliases — parity with components' `spec.synonyms`. */
  synonyms: string[];
  /** The live recipe component (rendered in the card preview and on the detail page). */
  Component: ComponentType<{ labels?: Record<string, string> }>;
  /** Recipe source, for the detail page's code view. */
  source: string;
  /** How this recipe renders in the overview's preview card. */
  preview: RecipePreview;
  /** The recipe's full spec — drives the detail page's spec-derived sections. */
  spec: RecipeSpec;
}

/** Build a registry entry from a spec + its live component and raw source. */
function toMeta(
  spec: RecipeSpec,
  Component: ComponentType<{ labels?: Record<string, string> }>,
  source: string,
): RecipeMeta {
  return {
    slug: spec.slug,
    group: spec.group,
    groupSlug: spec.groupSlug,
    title: spec.title,
    description: spec.description,
    synonyms: spec.synonyms,
    preview: spec.preview,
    Component,
    source,
    spec,
  };
}

export const RECIPES: RecipeMeta[] = [
  toMeta(signInSpec, SignIn, SignInSrc),
  toMeta(forgotPasswordSpec, ForgotPassword, ForgotPasswordSrc),
  toMeta(resetPasswordSpec, ResetPassword, ResetPasswordSrc),
  toMeta(mfaSetupSpec, MfaSetup, MfaSetupSrc),
  toMeta(mfaVerifySpec, MfaVerify, MfaVerifySrc),

  toMeta(searchFilterSpec, SearchFilter, SearchFilterSrc),
  toMeta(filterableDataTableSpec, FilterableDataTable, FilterableDataTableSrc),

  toMeta(appSidebarSpec, AppSidebar, AppSidebarSrc),

  toMeta(detailBasicSpec, DetailBasic, DetailBasicSrc),
  toMeta(detailWithTabsSpec, DetailWithTabs, DetailWithTabsSrc),
  toMeta(listBasicSpec, ListBasic, ListBasicSrc),
  toMeta(listSplitPaneSpec, ListSplitPane, ListSplitPaneSrc),
  toMeta(overviewBasicSpec, OverviewBasic, OverviewBasicSrc),
  toMeta(overviewWithTabsSpec, OverviewWithTabs, OverviewWithTabsSrc),
];

/** Group display names in display order. */
export const RECIPE_GROUPS: string[] = RECIPES.reduce<string[]>((acc, r) => {
  if (!acc.includes(r.group)) acc.push(r.group);
  return acc;
}, []);

export function getRecipe(groupSlug: string, slug: string): RecipeMeta | undefined {
  return RECIPES.find((r) => r.groupSlug === groupSlug && r.slug === slug);
}
